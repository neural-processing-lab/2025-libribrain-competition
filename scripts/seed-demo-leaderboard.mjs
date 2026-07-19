#!/usr/bin/env node
/**
 * Writes SYNTHETIC standings to public/data/leaderboard-demo/ so the leaderboard
 * page can be designed and reviewed before the competition opens.
 *
 * This is preview scaffolding, not data. It never touches public/data/leaderboard/
 * (the real Kaggle mirror), and the page only reads it when the build sets
 * NEXT_PUBLIC_LEADERBOARD_DEMO=1:
 *
 *   node scripts/seed-demo-leaderboard.mjs
 *   NEXT_PUBLIC_LEADERBOARD_DEMO=1 npm run dev
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data', 'leaderboard-demo');

const CHANCE = 0.2;
const METRIC = 'BAcc@10';
const DEADLINE = '2026-10-16T12:00:00Z';
const OPEN = Date.UTC(2026, 6, 15); // 15 Jul 2026 — competition opens
const NOW = Date.UTC(2026, 8, 20); // pretend we are ~2/3 of the way through

// Deterministic PRNG so the demo is stable across runs (mulberry32).
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ADJ = ['Neural', 'Cortical', 'Silent', 'Temporal', 'Deep', 'Latent', 'Spectral', 'Quantum', 'Auditory', 'Phase', 'Hidden', 'Sparse', 'Recurrent', 'Bayesian', 'Adaptive', 'Dynamic'];
const NOUN = ['Decoders', 'Gyrus', 'Speech', 'Lab', 'Signal', 'Cortex', 'Minds', 'Waves', 'Ensemble', 'Collective', 'Group', 'Circuit', 'Sensors', 'Units', 'Transformers', 'Baselines'];

function teamNames(n, rand) {
  const seen = new Set();
  const out = [];
  while (out.length < n) {
    const name = `${ADJ[Math.floor(rand() * ADJ.length)]} ${NOUN[Math.floor(rand() * NOUN.length)]}`;
    const final = seen.has(name) ? `${name} ${out.length}` : name;
    seen.add(final);
    out.push(final);
  }
  return out;
}

/**
 * Simulates a track: each team has a latent skill ceiling and climbs toward it
 * over the competition, submitting in bursts. We record every score improvement
 * so the trajectory/SOTA charts have something with real shape.
 */
function simulate({ track, competition, label, nTeams, topScore, seed }) {
  const rand = rng(seed);
  const names = teamNames(nTeams, rand);

  const teams = names.map((team, i) => {
    // Skill spread: a few strong teams, a long tail hovering near chance.
    const q = i / Math.max(1, nTeams - 1);
    const ceiling = CHANCE + (topScore - CHANCE) * Math.pow(1 - q, 1.7) * (0.85 + rand() * 0.3);
    const joined = OPEN + rand() * (NOW - OPEN) * 0.75;
    const nSubs = 1 + Math.floor(Math.pow(rand(), 1.8) * 60);

    // Score improvements over time, approaching the ceiling.
    const points = [];
    let best = CHANCE + rand() * 0.03;
    for (let s = 0; s < nSubs; s++) {
      const t = joined + ((NOW - joined) * (s + 1)) / (nSubs + 1);
      const progress = (s + 1) / nSubs;
      const target = CHANCE + (ceiling - CHANCE) * (1 - Math.exp(-2.4 * progress));
      const candidate = target + (rand() - 0.5) * 0.02;
      if (candidate > best) {
        best = candidate;
        points.push([new Date(t).toISOString(), Number(best.toFixed(5))]);
      }
    }
    if (!points.length) points.push([new Date(joined).toISOString(), Number(best.toFixed(5))]);

    return {
      teamId: 9000000 + seed * 1000 + i,
      team,
      score: Number(best.toFixed(5)),
      submissions: nSubs,
      lastSubmission: new Date(joined + (NOW - joined) * 0.95).toISOString(),
      members: [team.toLowerCase().replace(/\s+/g, '_')],
      points,
    };
  });

  teams.sort((a, b) => b.score - a.score);
  teams.forEach((t, i) => { t.rank = i + 1; });

  const scores = teams.map((t) => t.score).sort((a, b) => a - b);
  const qtl = (q) => {
    const pos = (scores.length - 1) * q;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return Number((lo === hi ? scores[lo] : scores[lo] + (scores[hi] - scores[lo]) * (pos - lo)).toFixed(5));
  };

  const standings = {
    track,
    competition,
    label,
    metric: METRIC,
    chance: CHANCE,
    deadline: DEADLINE,
    url: `https://www.kaggle.com/competitions/${competition}/leaderboard`,
    teams: teams.map((t) => {
      const row = { ...t };
      delete row.points; // trajectories live in history.json, not the standings
      return row;
    }),
    totals: {
      teams: teams.length,
      submissions: teams.reduce((a, t) => a + t.submissions, 0),
      best: scores[scores.length - 1],
      median: qtl(0.5),
      p25: qtl(0.25),
      p75: qtl(0.75),
    },
    fetchedAt: new Date(NOW).toISOString(),
  };

  // Replay the per-team improvements into weekly-ish snapshots.
  const summary = [];
  const STEPS = 70;
  for (let s = 0; s <= STEPS; s++) {
    const t = OPEN + ((NOW - OPEN) * s) / STEPS;
    const iso = new Date(t).toISOString();
    const live = teams
      .map((team) => {
        const seenPts = team.points.filter((p) => Date.parse(p[0]) <= t);
        return seenPts.length ? seenPts[seenPts.length - 1][1] : null;
      })
      .filter((v) => v !== null)
      .sort((a, b) => a - b);
    if (!live.length) continue;
    const subs = teams.reduce((a, team) => {
      const frac = Math.min(1, Math.max(0, (t - Date.parse(team.points[0][0])) / (NOW - Date.parse(team.points[0][0])) || 0));
      return a + Math.round(team.submissions * frac);
    }, 0);
    const q = (p) => {
      const pos = (live.length - 1) * p;
      const lo = Math.floor(pos);
      const hi = Math.ceil(pos);
      return Number((lo === hi ? live[lo] : live[lo] + (live[hi] - live[lo]) * (pos - lo)).toFixed(5));
    };
    summary.push({
      t: iso,
      teams: live.length,
      submissions: subs,
      best: live[live.length - 1],
      median: q(0.5),
      p25: q(0.25),
      p75: q(0.75),
    });
  }

  const trajectories = {};
  for (const team of teams.slice(0, 20)) {
    trajectories[String(team.teamId)] = { team: team.team, points: team.points };
  }

  return { standings, summary, trajectories };
}

/**
 * Synthesizes the harvester's per-team multi-metric leaderboard from the
 * simulated standings: each team gets a best on every metric, with per-team
 * variation so the ranking genuinely differs by metric (the whole point — a
 * team best at BAcc@10 need not lead on Moses-50).
 */
function buildMetrics(sim) {
  const teams = sim.standings.teams.map((t) => {
    const r = rng(t.teamId);
    const b10 = t.score;
    const b1 = Number((b10 * (0.30 + 0.16 * r())).toFixed(5));
    // OVMI is in bits (~0–1.8 for this vocab); loosely tracks balacc@10 but with
    // enough per-team variation that its ranking differs from the accuracy metrics.
    const ov = Number(Math.max(0, (b10 - 0.2) * (3.0 + 1.4 * r()) + (r() - 0.5) * 0.2).toFixed(5));
    const at = (v) => ({ value: v });
    return {
      teamId: t.teamId,
      team: t.team,
      submissions: t.submissions,
      scoredSubmissions: t.submissions,
      kagglePublicBest: t.score,
      lastSubmission: t.lastSubmission,
      best: { 'balacc@10': at(b10), 'balacc@1': at(b1), ovmi: at(ov) },
    };
  });
  teams.sort((a, b) => b.best['balacc@10'].value - a.best['balacc@10'].value).forEach((t, i) => { t.rank = i + 1; });
  return {
    competition: sim.standings.competition,
    updatedAt: new Date(NOW).toISOString(),
    metrics: ['balacc@10', 'balacc@1', 'ovmi'],
    teams,
  };
}

const deep = simulate({ track: 'deep', competition: 'pnpl-competition-2026-deep', label: 'Deep', nTeams: 88, topScore: 0.58, seed: 11 });
const broad = simulate({ track: 'broad', competition: 'pnpl-competition-2026-broad', label: 'Broad', nTeams: 61, topScore: 0.49, seed: 23 });

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'deep.json'), `${JSON.stringify(deep.standings, null, 2)}\n`);
writeFileSync(join(OUT_DIR, 'broad.json'), `${JSON.stringify(broad.standings, null, 2)}\n`);
writeFileSync(
  join(OUT_DIR, 'history.json'),
  `${JSON.stringify({
    summary: { deep: deep.summary, broad: broad.summary },
    trajectories: { deep: deep.trajectories, broad: broad.trajectories },
  })}\n`,
);
writeFileSync(join(OUT_DIR, 'metrics-deep.json'), `${JSON.stringify(buildMetrics(deep), null, 2)}\n`);
writeFileSync(join(OUT_DIR, 'metrics-broad.json'), `${JSON.stringify(buildMetrics(broad), null, 2)}\n`);
writeFileSync(
  join(OUT_DIR, 'meta.json'),
  `${JSON.stringify({ fetchedAt: new Date(NOW).toISOString(), metric: METRIC, chance: CHANCE, deadline: DEADLINE, demo: true }, null, 2)}\n`,
);

console.log(`Demo standings written to ${OUT_DIR}`);
console.log(`  deep : ${deep.standings.totals.teams} teams, ${deep.standings.totals.submissions} submissions, best ${deep.standings.totals.best}`);
console.log(`  broad: ${broad.standings.totals.teams} teams, ${broad.standings.totals.submissions} submissions, best ${broad.standings.totals.best}`);
