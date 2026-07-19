import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads the Kaggle leaderboard mirror written by scripts/fetch-leaderboard.mjs.
 *
 * The site is a static export, so this runs at build time only — the Kaggle
 * token never reaches the browser and the page ships as plain HTML. The refresh
 * workflow redeploys whenever the standings move.
 */

export type TrackId = 'deep' | 'broad';

export interface Team {
  rank: number;
  teamId: number;
  team: string;
  score: number;
  submissions: number;
  lastSubmission: string | null;
  members: string[];
}

export interface Totals {
  teams: number;
  submissions: number;
  best: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
}

export interface Standings {
  track: TrackId;
  competition: string;
  label: string;
  metric: string;
  chance: number;
  deadline: string;
  url: string;
  teams: Team[];
  totals: Totals;
  fetchedAt: string;
}

/** One snapshot of a track's leaderboard, appended only when something moved. */
export interface Snapshot {
  t: string;
  teams: number;
  submissions: number;
  best: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
}

/** [timestamp, score] for each score *improvement* by a leading team. */
export interface Trajectory {
  team: string;
  points: [string, number][];
}

export interface History {
  summary: Record<TrackId, Snapshot[]>;
  trajectories: Record<TrackId, Record<string, Trajectory>>;
}

/** Per-team best value on one metric (value only — no submission identifiers). */
export interface MetricBest {
  value: number;
}

export interface MetricTeam {
  teamId: number;
  team: string;
  rank: number;
  submissions: number;
  scoredSubmissions: number;
  kagglePublicBest: number | null;
  lastSubmission: string | null;
  best: Record<string, MetricBest>;
}

/**
 * The per-team, multi-metric leaderboard the harvester computes from the archived
 * submission files (BAcc@10/@1, Moses@10/@1, on the public split) — the metrics
 * Kaggle can't surface because it ranks a single number.
 */
export interface MetricsLeaderboard {
  competition: string;
  updatedAt: string;
  metrics: string[];
  teams: MetricTeam[];
}

export interface LeaderboardData {
  deep: Standings;
  broad: Standings;
  history: History;
  metrics: Record<TrackId, MetricsLeaderboard | null>;
  demo: boolean;
}

const DEMO = process.env.NEXT_PUBLIC_LEADERBOARD_DEMO === '1';
const DIR = path.join(process.cwd(), 'public', 'data', DEMO ? 'leaderboard-demo' : 'leaderboard');

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')) as T;
  } catch {
    return fallback;
  }
}

function emptyStandings(track: TrackId, label: string): Standings {
  const competition = `pnpl-competition-2026-${track}`;
  return {
    track,
    competition,
    label,
    metric: 'BAcc@10',
    chance: 0.2,
    deadline: '2026-10-16T12:00:00Z',
    url: `https://www.kaggle.com/competitions/${competition}/leaderboard`,
    teams: [],
    totals: { teams: 0, submissions: 0, best: null, median: null, p25: null, p75: null },
    fetchedAt: new Date(0).toISOString(),
  };
}

export function loadLeaderboard(): LeaderboardData {
  return {
    deep: readJson('deep.json', emptyStandings('deep', 'Deep')),
    broad: readJson('broad.json', emptyStandings('broad', 'Broad')),
    history: readJson<History>('history.json', {
      summary: { deep: [], broad: [] },
      trajectories: { deep: {}, broad: {} },
    }),
    metrics: {
      deep: readJson<MetricsLeaderboard | null>('metrics-deep.json', null),
      broad: readJson<MetricsLeaderboard | null>('metrics-broad.json', null),
    },
    demo: DEMO,
  };
}
