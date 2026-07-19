#!/usr/bin/env node
/**
 * Pulls the public Kaggle leaderboards for both 2026 tracks and writes the JSON
 * the /editions/2026/leaderboard page renders.
 *
 * Kaggle gives us exactly one score per team (the public BAcc@10) — there is no
 * host API for participants' prediction files, so every number on the page is
 * either straight off the leaderboard or derived from our own snapshot history.
 *
 *   node scripts/fetch-leaderboard.mjs            # write if changed
 *   node scripts/fetch-leaderboard.mjs --dry-run  # print, touch nothing
 *   LEADERBOARD_FIXTURE=titanic node scripts/fetch-leaderboard.mjs --dry-run
 *
 * Auth: KAGGLE_API_TOKEN (a KGAT_… bearer token).
 */

import { inflateRawSync } from 'node:zlib';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'data', 'leaderboard');

const TRACKS = [
  { track: 'deep', competition: 'pnpl-competition-2026-deep', label: 'Deep' },
  { track: 'broad', competition: 'pnpl-competition-2026-broad', label: 'Broad' },
];

// The harvester service computes the per-team multi-metric leaderboard (BAcc@1,
// Moses-50, …) from the archived submission files. We pull its feed so the site
// can show what Kaggle's single score can't. Optional — skipped if unreachable.
const HARVESTER_URL = (process.env.HARVESTER_URL || 'https://kaggle-harvester-production.up.railway.app').replace(/\/+$/, '');

/** Uniform random guessing over the 50-word vocabulary at k=10 covers 10/50 words. */
const CHANCE = 0.2;
const METRIC = 'BAcc@10';
const DEADLINE = '2026-10-16T12:00:00Z';

/** Per-team trajectories are only kept for the leaders — keeps history-teams.json bounded. */
const TRAJECTORY_TEAMS = 20;

const DRY_RUN = process.argv.includes('--dry-run');
const FIXTURE = process.env.LEADERBOARD_FIXTURE || null;

// ---------------------------------------------------------------------------
// Kaggle
// ---------------------------------------------------------------------------

/**
 * Minimal ZIP reader. Kaggle serves the leaderboard as a one-entry archive and
 * we would otherwise pull in a dependency purely to read it. Walks the central
 * directory rather than trusting local-header sizes (they are zeroed when the
 * archive is written as a stream).
 */
function unzipSingleFile(buf) {
  const EOCD_SIG = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i >= buf.length - 22 - 65535; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a ZIP archive (no end-of-central-directory record).');

  const entries = buf.readUInt16LE(eocd + 10);
  if (entries < 1) throw new Error('ZIP archive is empty.');
  let p = buf.readUInt32LE(eocd + 16); // offset of first central-directory header

  if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Corrupt ZIP central directory.');
  const method = buf.readUInt16LE(p + 10);
  const compSize = buf.readUInt32LE(p + 20);
  const nameLen = buf.readUInt16LE(p + 28);
  const extraLen = buf.readUInt16LE(p + 30);
  const commentLen = buf.readUInt16LE(p + 32);
  const localOff = buf.readUInt32LE(p + 42);
  const name = buf.subarray(p + 46, p + 46 + nameLen).toString('utf8');
  void extraLen; void commentLen;

  // Re-read the local header: its own name/extra lengths give the true data offset.
  if (buf.readUInt32LE(localOff) !== 0x04034b50) throw new Error('Corrupt ZIP local header.');
  const lNameLen = buf.readUInt16LE(localOff + 26);
  const lExtraLen = buf.readUInt16LE(localOff + 28);
  const start = localOff + 30 + lNameLen + lExtraLen;
  const data = buf.subarray(start, start + compSize);

  const out = method === 0 ? data : inflateRawSync(data);
  return { name, text: out.toString('utf8') };
}

async function fetchLeaderboardCsv(competition) {
  const token = process.env.KAGGLE_API_TOKEN;
  if (!token) throw new Error('KAGGLE_API_TOKEN is not set.');

  const url = `https://www.kaggle.com/api/v1/competitions/${competition}/leaderboard/download`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, redirect: 'follow' });
  if (!res.ok) throw new Error(`Kaggle returned ${res.status} ${res.statusText} for ${competition}`);

  const buf = Buffer.from(await res.arrayBuffer());
  return unzipSingleFile(buf).text;
}

/** Pulls the harvester's per-team multi-metric leaderboard for a competition. */
async function fetchHarvesterMetrics(competition) {
  try {
    const res = await fetch(`${HARVESTER_URL}/leaderboard/${competition}.json`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const j = await res.json();
    return j && Array.isArray(j.teams) ? j : null;
  } catch {
    return null; // harvester down / not polling this competition yet — non-fatal
  }
}

/** RFC4180-ish parser — team names legitimately contain commas and quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { quoted = false; }
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  if (!rows.length) return [];
  const header = rows[0].map((h) => h.replace(/^﻿/, '').trim()); // Kaggle prefixes a BOM
  return rows.slice(1)
    .filter((r) => r.length === header.length && r.some((v) => v !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

// ---------------------------------------------------------------------------
// Shaping
// ---------------------------------------------------------------------------

const round = (n, dp = 5) => Number(n.toFixed(dp));

function quantile(sorted, q) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/**
 * Because we are the competition *host*, Kaggle's leaderboard CSV includes a
 * TeamMemberEmails column — real participant email addresses. This repository is
 * public and the refresh workflow commits whatever we write, so publishing that
 * column would leak participants' personal data.
 *
 * The shaping below is therefore a strict allowlist, and assertNoPii() re-checks
 * the result before anything reaches disk. Do not replace either with a
 * pass-through of the parsed CSV row.
 */
function assertNoPii(teams, csv) {
  const emails = parseCsv(csv)
    .flatMap((r) => (r.TeamMemberEmails || '').split(','))
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!emails.length) return;

  const serialised = JSON.stringify(teams).toLowerCase();
  const leaked = emails.filter((e) => serialised.includes(e));
  if (leaked.length) {
    throw new Error(
      `refusing to write: ${leaked.length} participant email address(es) would have been published.`,
    );
  }
}

function shapeTrack({ track, competition, label }, csv) {
  const teams = parseCsv(csv)
    .map((r) => ({
      // Allowlist. TeamMemberEmails is deliberately absent — see assertNoPii().
      rank: Number(r.Rank),
      teamId: Number(r.TeamId),
      team: r.TeamName,
      score: Number(r.Score),
      submissions: Number(r.SubmissionCount),
      lastSubmission: r.LastSubmissionDate ? `${r.LastSubmissionDate.replace(' ', 'T')}Z` : null,
      members: (r.TeamMemberUserNames || '').split(',').map((m) => m.trim()).filter(Boolean),
    }))
    .filter((t) => Number.isFinite(t.score) && Number.isFinite(t.teamId))
    .sort((a, b) => a.rank - b.rank);

  assertNoPii(teams, csv);

  const scores = teams.map((t) => t.score).sort((a, b) => a - b);
  const submissions = teams.reduce((a, t) => a + (t.submissions || 0), 0);

  return {
    track,
    competition,
    label,
    metric: METRIC,
    chance: CHANCE,
    deadline: DEADLINE,
    url: `https://www.kaggle.com/competitions/${competition}/leaderboard`,
    teams,
    totals: {
      teams: teams.length,
      submissions,
      best: scores.length ? round(scores[scores.length - 1]) : null,
      median: scores.length ? round(quantile(scores, 0.5)) : null,
      p25: scores.length ? round(quantile(scores, 0.25)) : null,
      p75: scores.length ? round(quantile(scores, 0.75)) : null,
    },
  };
}

const readJson = (path, fallback) => {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * History is append-only and split in two so the browser never downloads more
 * than it needs: a per-snapshot summary (drives the SOTA / participation /
 * spread charts) and score-change points for the leaders only (trajectories).
 */
function appendHistory(prev, shaped, now) {
  const summary = { ...(prev.summary || {}) };
  const trajectories = { ...(prev.trajectories || {}) };

  for (const t of shaped) {
    const snaps = summary[t.track] ? [...summary[t.track]] : [];
    const last = snaps[snaps.length - 1];
    const point = {
      t: now,
      teams: t.totals.teams,
      submissions: t.totals.submissions,
      best: t.totals.best,
      median: t.totals.median,
      p25: t.totals.p25,
      p75: t.totals.p75,
    };
    const unchanged =
      last &&
      last.teams === point.teams &&
      last.submissions === point.submissions &&
      last.best === point.best &&
      last.median === point.median;
    if (!unchanged) snaps.push(point);
    summary[t.track] = snaps;

    // Trajectories: one point per team per *score change*, so a team that submits
    // 200 times without improving still costs a single point.
    const byTeam = { ...(trajectories[t.track] || {}) };
    for (const team of t.teams.slice(0, TRAJECTORY_TEAMS)) {
      const key = String(team.teamId);
      const existing = byTeam[key] || { team: team.team, points: [] };
      existing.team = team.team; // teams rename themselves
      const lastPoint = existing.points[existing.points.length - 1];
      if (!lastPoint || lastPoint[1] !== team.score) {
        existing.points = [...existing.points, [now, team.score]];
      }
      byTeam[key] = existing;
    }
    trajectories[t.track] = byTeam;
  }

  return { summary, trajectories };
}

// ---------------------------------------------------------------------------

async function main() {
  let shaped;

  if (FIXTURE) {
    // Shape-test the whole pipeline against a competition that actually has
    // submissions — both PNPL tracks are still empty.
    const csv = await fetchLeaderboardCsv(FIXTURE);
    shaped = [shapeTrack({ track: 'deep', competition: FIXTURE, label: FIXTURE }, csv)];
  } else {
    // Per-track and resilient: a Kaggle-mirror failure (e.g. no KAGGLE_API_TOKEN)
    // must not block the harvester metrics feed, which is what the page renders.
    shaped = [];
    for (const t of TRACKS) {
      try {
        shaped.push(shapeTrack(t, await fetchLeaderboardCsv(t.competition)));
      } catch (err) {
        console.error(`  Kaggle mirror for ${t.competition} skipped: ${err.message}`);
      }
    }
  }

  const now = new Date().toISOString();

  for (const t of shaped) {
    console.log(
      `${t.label.padEnd(6)} teams=${String(t.totals.teams).padStart(5)} ` +
        `submissions=${String(t.totals.submissions).padStart(6)} ` +
        `best=${t.totals.best ?? '—'} median=${t.totals.median ?? '—'}`,
    );
  }

  if (DRY_RUN) {
    console.log('\n--dry-run: nothing written.');
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const historyPath = join(OUT_DIR, 'history.json');
  const history = appendHistory(readJson(historyPath, {}), shaped, now);

  // Only rewrite standings when something actually moved, so the cron does not
  // churn the git history (and retrigger a Pages build) every 15 minutes.
  let changed = false;
  for (const t of shaped) {
    const path = join(OUT_DIR, `${t.track}.json`);
    const prev = readJson(path, null);
    const same =
      prev &&
      JSON.stringify({ ...prev, fetchedAt: null }) === JSON.stringify({ ...t, fetchedAt: null });
    if (!same) {
      writeFileSync(path, `${JSON.stringify({ ...t, fetchedAt: now }, null, 2)}\n`);
      changed = true;
    }
  }

  // Pull the harvester's multi-metric leaderboard per track (best effort, and
  // independent of the Kaggle mirror — this is what the page renders).
  for (const t of TRACKS) {
    const metrics = await fetchHarvesterMetrics(t.competition);
    if (!metrics) continue;
    const path = join(OUT_DIR, `metrics-${t.track}.json`);
    const prev = readJson(path, null);
    const same = prev && JSON.stringify({ ...prev, updatedAt: null }) === JSON.stringify({ ...metrics, updatedAt: null });
    if (!same) {
      writeFileSync(path, `${JSON.stringify(metrics, null, 2)}\n`);
      changed = true;
      console.log(`  metrics-${t.track}: ${metrics.teams?.length ?? 0} team(s)`);
    }
  }

  if (changed) {
    writeFileSync(historyPath, `${JSON.stringify(history)}\n`);
    writeFileSync(
      join(OUT_DIR, 'meta.json'),
      `${JSON.stringify({ fetchedAt: now, metric: METRIC, chance: CHANCE, deadline: DEADLINE }, null, 2)}\n`,
    );
    console.log(`\nWrote ${OUT_DIR}`);
  } else {
    console.log('\nNo change since last run — nothing written.');
  }

  // Consumed by the workflow to decide whether to commit.
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`, { flag: 'a' });
  }
}

main().catch((err) => {
  console.error(`fetch-leaderboard: ${err.message}`);
  process.exit(1);
});
