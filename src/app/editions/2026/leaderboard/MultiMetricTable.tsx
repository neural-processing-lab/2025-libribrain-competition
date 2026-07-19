// No 'use client': imported only by LeaderboardView (already a client component).
// Marking it a client entry would force every prop to be serializable, which the
// onMetricChange callback is not.
import { useMemo } from 'react';
import type { MetricsLeaderboard } from '../../../../lib/leaderboard';

const INK = { primary: '#0a0a0a', secondary: '#555', muted: '#888' };
const BORDER = 'rgba(124,58,237,0.12)';
const SURFACE = '#faf8ff';

// Client-safe metric labels (importing a runtime value from lib/leaderboard would
// pull its server-only fs loader into the browser bundle).
export const METRIC_INFO: Record<string, { label: string; description: string }> = {
  'balacc@10': { label: 'BalAcc@10', description: 'Top-10 balanced accuracy on the 50-word vocab — Kaggle’s official public score' },
  'balacc@1': { label: 'BalAcc@1', description: 'Top-1 balanced accuracy — the strict version (computed by us)' },
  ovmi: { label: 'OVMI', description: 'Out-of-Vocabulary Mutual Information (bits) — information the decoder recovers (computed by us)' },
};

export function metricLabel(m: string) {
  return METRIC_INFO[m]?.label || m;
}

/**
 * Per-team best score on EACH metric. Kaggle ranks one number; here every team's
 * best BalAcc@10, BalAcc@1 and OVMI sit side by side, ranked by the metric the
 * viewer picks above.
 */
export default function MultiMetricTable({
  data,
  accent,
  metric,
  onMetricChange,
}: {
  data: MetricsLeaderboard;
  accent: string;
  metric: string;
  onMetricChange: (m: string) => void;
}) {
  const metrics = useMemo(
    () => data.metrics.filter((m) => data.teams.some((t) => t.best[m])),
    [data],
  );
  const activeSort = metrics.includes(metric) ? metric : metrics[0];

  const rows = useMemo(() => {
    if (!activeSort) return data.teams;
    return [...data.teams].sort((a, b) => (b.best[activeSort]?.value ?? -1) - (a.best[activeSort]?.value ?? -1));
  }, [data.teams, activeSort]);

  const colMax = useMemo(() => {
    const m: Record<string, number> = {};
    for (const metricKey of metrics) {
      m[metricKey] = Math.max(0.0001, ...data.teams.map((t) => t.best[metricKey]?.value ?? 0));
    }
    return m;
  }, [data.teams, metrics]);

  if (!metrics.length) {
    return (
      <p style={{ fontSize: '14px', color: INK.muted, margin: 0 }}>
        Per-metric scores appear once submissions are scored against the solution. Until then, only Kaggle’s
        public score is available (rightmost column).
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '620px' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: INK.secondary, fontWeight: 600 }}>#</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: INK.secondary, fontWeight: 600 }}>Team</th>
            {metrics.map((m) => {
              const info = METRIC_INFO[m] || { label: m, description: '' };
              const active = m === activeSort;
              return (
                <th
                  key={m}
                  onClick={() => onMetricChange(m)}
                  title={info.description}
                  style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: active ? accent : INK.secondary,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    borderBottom: active ? `2px solid ${accent}` : '2px solid transparent',
                  }}
                >
                  {info.label} {active ? '↓' : ''}
                </th>
              );
            })}
            <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: INK.muted, fontWeight: 600 }}>Subs</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t, i) => (
            <tr key={t.teamId} style={{ borderBottom: '1px solid #f2f2f5' }}>
              <td style={{ padding: '10px 12px', color: i < 3 ? accent : INK.muted, fontWeight: i < 3 ? 700 : 400, fontVariantNumeric: 'tabular-nums' }}>
                {i + 1}
              </td>
              <td style={{ padding: '10px 12px', color: INK.primary, fontWeight: 500 }}>{t.team}</td>
              {metrics.map((m) => {
                const best = t.best[m];
                const active = m === activeSort;
                const frac = best ? best.value / colMax[m] : 0;
                return (
                  <td key={m} style={{ padding: '8px 12px', textAlign: 'right', minWidth: '92px' }}>
                    {best ? (
                      <>
                        <div style={{ fontWeight: active ? 700 : 500, color: INK.primary, fontVariantNumeric: 'tabular-nums' }}>
                          {best.value.toFixed(4)}
                        </div>
                        <div style={{ background: '#f0eef6', borderRadius: '999px', height: '3px', marginTop: '3px' }}>
                          <div style={{ width: `${Math.min(100, frac * 100)}%`, height: '100%', background: active ? accent : '#c4b5fd', borderRadius: '999px' }} />
                        </div>
                      </>
                    ) : (
                      <span style={{ color: INK.muted }}>—</span>
                    )}
                  </td>
                );
              })}
              <td style={{ padding: '10px 12px', textAlign: 'right', color: INK.muted, fontVariantNumeric: 'tabular-nums' }}>
                {t.submissions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
