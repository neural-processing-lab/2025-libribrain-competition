/**
 * One-off backfill of public/data/leaderboard/history.json from the kaggle
 * harvester's state files (state.<competition>.json, pulled from its volume).
 *
 *   node scripts/backfill-history.mjs <state-deep.json> <state-broad.json>
 *
 * Every archived submission carries its Kaggle submission date and public
 * score, so the summary snapshots (daily) and per-team trajectories (score
 * improvements) can be reconstructed exactly instead of accumulating from
 * whenever the mirror came back to life. Hidden teams (our own pre-launch
 * test entries) and unscored submissions are excluded, matching the live feed.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data', 'leaderboard', 'history.json');
const TRAJECTORY_TEAMS = 20; // same bound as fetch-leaderboard.mjs
const [deepPath, broadPath] = process.argv.slice(2);
if (!deepPath || !broadPath) {
  console.error('usage: node scripts/backfill-history.mjs <state-deep.json> <state-broad.json>');
  process.exit(1);
}

function subs(statePath) {
  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  return Object.values(state.archived)
    .filter((r) => r.status === 'COMPLETE' && !r.teamHidden && Number.isFinite(Number(r.kagglePublic)) && r.date)
    .map((r) => ({ teamId: r.teamId, team: r.teamName, score: Number(r.kagglePublic), t: Date.parse(r.date), date: r.date }))
    .filter((r) => Number.isFinite(r.t))
    .sort((a, b) => a.t - b.t);
}

const round = (n, dp = 5) => Number(n.toFixed(dp));
function quantile(sorted, q) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

function build(rows) {
  // Trajectories: per team, a point each time its own best improves.
  const perTeam = new Map();
  for (const r of rows) {
    const cur = perTeam.get(r.teamId) ?? { team: r.team, best: -Infinity, points: [] };
    cur.team = r.team;
    if (r.score > cur.best) {
      cur.best = r.score;
      cur.points.push([r.date, round(r.score)]);
    }
    perTeam.set(r.teamId, cur);
  }
  const leaders = [...perTeam.entries()].sort((a, b) => b[1].best - a[1].best).slice(0, TRAJECTORY_TEAMS);
  const trajectories = Object.fromEntries(leaders.map(([id, v]) => [String(id), { team: v.team, points: v.points }]));

  // Summary: one snapshot per UTC day with cumulative counts and the spread of
  // per-team bests as of that day (what the live snapshots would have shown).
  const summary = [];
  const bestByTeam = new Map();
  let submissions = 0;
  let i = 0;
  const days = [...new Set(rows.map((r) => r.date.slice(0, 10)))].sort();
  for (const day of days) {
    const cutoff = Date.parse(`${day}T23:59:59.999Z`);
    while (i < rows.length && rows[i].t <= cutoff) {
      const r = rows[i++];
      submissions++;
      bestByTeam.set(r.teamId, Math.max(bestByTeam.get(r.teamId) ?? -Infinity, r.score));
    }
    const bests = [...bestByTeam.values()].sort((a, b) => a - b);
    summary.push({
      t: `${day}T23:59:59.999Z`,
      teams: bestByTeam.size,
      submissions,
      best: bests.length ? round(bests[bests.length - 1]) : null,
      median: bests.length ? round(quantile(bests, 0.5)) : null,
      p25: bests.length ? round(quantile(bests, 0.25)) : null,
      p75: bests.length ? round(quantile(bests, 0.75)) : null,
    });
  }
  return { summary, trajectories };
}

const deep = build(subs(deepPath));
const broad = build(subs(broadPath));
writeFileSync(OUT, `${JSON.stringify({
  summary: { deep: deep.summary, broad: broad.summary },
  trajectories: { deep: deep.trajectories, broad: broad.trajectories },
}, null, 2)}\n`);
for (const [name, h] of [['deep', deep], ['broad', broad]]) {
  const pts = Object.values(h.trajectories).reduce((a, t) => a + t.points.length, 0);
  console.log(`${name}: ${h.summary.length} daily snapshots, ${Object.keys(h.trajectories).length} trajectory teams, ${pts} improvement points, latest best ${h.summary[h.summary.length - 1]?.best}`);
}
console.log(`wrote ${OUT}`);
