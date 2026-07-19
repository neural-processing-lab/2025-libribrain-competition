# Leaderboard pipeline (2026)

`/editions/2026/leaderboard/` mirrors the two Kaggle public leaderboards and renders
them as interactive charts. No server is involved: a scheduled GitHub Action pulls
from Kaggle, commits the result, and the static site rebuilds.

```
Kaggle  ──(cron, every 15 min)──>  scripts/fetch-leaderboard.mjs
                                          │  writes public/data/leaderboard/*.json
                                          │  (only when the standings actually moved)
                                          ▼
                                   git commit  ──>  deploy.yml  ──>  GitHub Pages
```

## Setup (one-off)

Add a repository secret **`KAGGLE_API_TOKEN`** containing a Kaggle API token
(the `KGAT_…` form). It needs host access to both competitions. Nothing else is
required — the token stays in CI and never reaches the browser, because the page
is built as static HTML.

## Files

| Path | Role |
|---|---|
| `scripts/fetch-leaderboard.mjs` | Pulls both leaderboards, shapes the JSON, appends history |
| `scripts/seed-demo-leaderboard.mjs` | Writes **synthetic** standings for local preview |
| `.github/workflows/leaderboard.yml` | Cron + commit + redeploy |
| `src/lib/leaderboard.ts` | Build-time loader and types |
| `src/app/editions/2026/leaderboard/page.tsx` | Server component; reads the JSON |
| `src/app/editions/2026/leaderboard/LeaderboardView.tsx` | The interactive board |
| `src/app/editions/2026/leaderboard/charts.tsx` | SVG chart primitives (no chart library) |
| `public/data/leaderboard/` | The committed mirror — also a public JSON feed |

## Local development

```bash
# Preview with synthetic standings (the competition has no submissions yet)
npm run leaderboard:demo
NEXT_PUBLIC_LEADERBOARD_DEMO=1 npm run dev

# Pull the real standings
KAGGLE_API_TOKEN=KGAT_… npm run leaderboard
KAGGLE_API_TOKEN=KGAT_… npm run leaderboard -- --dry-run   # print, write nothing

# Exercise the pipeline against a competition that actually has submissions
KAGGLE_API_TOKEN=KGAT_… LEADERBOARD_FIXTURE=titanic npm run leaderboard -- --dry-run
```

Demo data is gitignored and never ships; the page shows an amber "preview data"
banner whenever it is in use, so synthetic standings cannot be mistaken for real
ones.

## What Kaggle does and does not give us

The refresh calls `competitions/{id}/leaderboard/download` (what `kaggle
competitions leaderboard -d` wraps), which returns one row **per team**:

```
Rank, TeamId, TeamName, LastSubmissionDate, Score, SubmissionCount, TeamMemberUserNames, TeamMemberEmails
```

> **`TeamMemberEmails` is participant PII, and it only appears because we are the
> host.** This repository is public and the refresh workflow commits what the
> script writes, so that column must never be published. `shapeTrack()` is a strict
> allowlist and `assertNoPii()` re-checks the shaped output before anything is
> written — it throws rather than emit an address. Do not replace either with a
> pass-through of the parsed CSV row.

`Score` is the **public** BAcc@10 — a single scalar. That is the whole of what
Kaggle exposes, and it has two consequences worth knowing before anyone asks the
page for more:

- **Kaggle never hands the host participants' prediction files.** The API only has
  `submissions list/submit/upload`, all scoped to your *own* submissions
  (`kaggle competitions submissions` is documented as "shows **your** past
  submissions", and it 403s here with "you must accept the rules"); `leaderboard -d`
  is documented as "download entire leaderboard to CSV" and does exactly that — the
  standings table, not submissions. Verified against
  `pnpl-competition-2026`, which has a real submission on it: the download is a
  single row with a single score, and every host-submission endpoint 404s. So we
  cannot re-score anyone's predictions ourselves.
- **Therefore the secondary metrics cannot be shown per team while the competition
  is live** — BAcc@1 (the documented tie-break) and the Moses-50 vocabulary both
  need the 50-wide probability rows we never receive, even though
  `submission-system/top10-balanced-accuracy-score.ipynb` is written to compute
  them (`k=1`, and the `moses_` block).

  The zero-infrastructure way to get them is to let **Kaggle** re-score: after the
  deadline, point the competition's metric at the same notebook with `k=1` (or at
  the `moses_` block) and read the recomputed leaderboard. Verify that flow on a
  throwaway competition first, and only ever do it once submissions have closed —
  it rewrites the scores participants can see.

Everything else on the page is derived from our own snapshot history
(`public/data/leaderboard/history.json`), which is why the time-series charts only
grow as rich as the number of refreshes behind them.

## Cost and scale

Two HTTP calls per run. The fetch writes nothing when Kaggle returns what we
already have, so a quiet competition costs no commits and no deploys. History is
split so the browser only ever downloads a bounded payload: per-snapshot summaries,
plus score-*changes* for the top 20 teams (a team that submits 200 times without
improving adds one point). At the expected ~5000 submissions this stays well under
100 KB.
