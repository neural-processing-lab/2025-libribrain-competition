// No 'use client': imported only by LeaderboardView (already a client component).
import { useMemo, useState } from 'react';
import type { MetricsLeaderboard } from '../../../../lib/leaderboard';

const INK = { primary: '#0a0a0a', secondary: '#555', muted: '#888' };

/**
 * Teams ranked by the chosen metric. One bar per team; the viewer picks the
 * metric with the selector above, so a single graph covers BalAcc@10, BalAcc@1
 * and OVMI without stacking a dozen charts on the page.
 */
export default function MetricBarChart({
  data,
  metric,
  accent,
  topN = 20,
}: {
  data: MetricsLeaderboard;
  metric: string;
  accent: string;
  topN?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const ranked = useMemo(
    () =>
      data.teams
        .filter((t) => t.best[metric])
        .map((t) => ({ team: t.team, value: t.best[metric]!.value }))
        .sort((a, b) => b.value - a.value),
    [data.teams, metric],
  );

  if (!ranked.length) {
    return (
      <p style={{ fontSize: '14px', color: INK.muted, margin: 0 }}>
        No scored submissions yet on this metric.
      </p>
    );
  }

  const shown = ranked.slice(0, topN);
  const max = Math.max(...shown.map((r) => r.value), 0.0001);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {shown.map((r, i) => (
          <div
            key={r.team + i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ display: 'grid', gridTemplateColumns: '26px minmax(90px, 160px) 1fr 64px', alignItems: 'center', gap: '10px' }}
          >
            <span style={{ fontSize: '12px', color: i < 3 ? accent : INK.muted, fontWeight: i < 3 ? 700 : 400, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {i + 1}
            </span>
            <span style={{ fontSize: '13px', color: INK.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.team}>
              {r.team}
            </span>
            <div style={{ background: '#f0eef6', borderRadius: '999px', height: '14px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(r.value / max) * 100}%`,
                  height: '100%',
                  background: accent,
                  borderRadius: '999px',
                  opacity: hover === null || hover === i ? 1 : 0.55,
                  transition: 'opacity .12s',
                }}
              />
            </div>
            <span style={{ fontSize: '13px', color: INK.primary, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {r.value.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
      {ranked.length > topN && (
        <p style={{ fontSize: '12px', color: INK.muted, margin: '12px 0 0' }}>
          Showing top {topN} of {ranked.length} teams — full standings in the table below.
        </p>
      )}
    </div>
  );
}
