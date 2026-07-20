'use client';

import { useEffect, useMemo, useState } from 'react';
import type { LeaderboardData, MetricsLeaderboard, TrackId } from '../../../../lib/leaderboard';
import MultiMetricTable, { METRIC_INFO, metricLabel } from './MultiMetricTable';
import MetricBarChart from './MetricBarChart';

const INK = { primary: '#0a0a0a', secondary: '#555', muted: '#888' };
const BORDER = 'rgba(124,58,237,0.12)';
const SURFACE = '#faf8ff';
const TRACK_COLOR: Record<TrackId, string> = { deep: '#7c3aed', broad: '#0d9488' };
const TRACK_LABEL: Record<TrackId, string> = { deep: 'Deep', broad: 'Broad' };
const DEADLINE = '2026-10-16T12:00:00Z';
const COMPETITION_URL: Record<TrackId, string> = {
  deep: 'https://www.kaggle.com/competitions/pnpl-competition-2026-deep/leaderboard',
  broad: 'https://www.kaggle.com/competitions/pnpl-competition-2026-broad/leaderboard',
};
const METRIC_ORDER = ['balacc@10', 'balacc@1', 'ovmi'];

const fmtInt = (n: number) => n.toLocaleString('en-GB');

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: '12px', background: '#fff', padding: '20px 22px', ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ title, note }: { title: string; note?: string }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: INK.primary, margin: 0 }}>{title}</h3>
      {note && <p style={{ fontSize: '13px', color: INK.muted, margin: '4px 0 0', lineHeight: 1.5 }}>{note}</p>}
    </div>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: '26px', fontWeight: 700, color: color || INK.primary, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: INK.secondary, marginTop: '5px', fontWeight: 500 }}>{label}</div>
    </Card>
  );
}

function Pill({ active, color, onClick, children }: { active: boolean; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '7px 16px',
        borderRadius: '999px',
        border: `1px solid ${active ? color : BORDER}`,
        background: active ? color : '#fff',
        color: active ? '#fff' : INK.secondary,
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .15s ease',
      }}
    >
      {children}
    </button>
  );
}

export default function LeaderboardView({ data }: { data: LeaderboardData }) {
  const [track, setTrack] = useState<TrackId>('deep');
  const [metric, setMetric] = useState<string>('balacc@10');
  // Time-derived values differ between the static build and the browser, which
  // would trip React hydration — compute them only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const metrics: MetricsLeaderboard | null = data.metrics[track];
  const accent = TRACK_COLOR[track];
  const hasTeams = (m: MetricsLeaderboard | null) => !!m && m.teams.length > 0;
  const anyData = hasTeams(data.metrics.deep) || hasTeams(data.metrics.broad);

  const daysLeft = mounted ? Math.max(0, Math.ceil((Date.parse(DEADLINE) - Date.now()) / 86_400_000)) : null;

  // Which metrics actually have scores (drives the selector).
  const scoredMetrics = useMemo(
    () => METRIC_ORDER.filter((m) => metrics?.teams.some((t) => t.best[m])),
    [metrics],
  );
  const activeMetric = scoredMetrics.includes(metric) ? metric : (scoredMetrics[0] ?? metric);

  const stats = useMemo(() => {
    if (!metrics) return null;
    const submissions = metrics.teams.reduce((a, t) => a + (t.submissions || 0), 0);
    const values = metrics.teams.map((t) => t.best[activeMetric]?.value).filter((v): v is number => v != null);
    const best = values.length ? Math.max(...values) : null;
    return { teams: metrics.teams.length, submissions, best };
  }, [metrics, activeMetric]);

  // ---------------------------------------------------------------- empty state
  if (!anyData) {
    return (
      <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
        <Card style={{ textAlign: 'center', padding: '48px 24px', background: SURFACE }}>
          <div style={{ fontSize: '38px', marginBottom: '12px' }}>📊</div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: INK.primary, margin: '0 0 8px' }}>No submissions yet</h3>
          <p style={{ fontSize: '15px', color: INK.secondary, margin: '0 auto 22px', maxWidth: '520px', lineHeight: 1.6 }}>
            Both tracks open on 15 July 2026. This page fills in as submissions land — with each team&apos;s best
            score on multiple metrics, not just Kaggle&apos;s single number.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {(['deep', 'broad'] as TrackId[]).map((id, i) => (
              <a key={id} href={COMPETITION_URL[id]} target="_blank" rel="noopener noreferrer"
                style={{ padding: '11px 22px', borderRadius: '8px', border: `1px solid ${i === 0 ? 'transparent' : BORDER}`, background: i === 0 ? TRACK_COLOR.deep : '#fff', color: i === 0 ? '#fff' : TRACK_COLOR.deep, fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
                {TRACK_LABEL[id]} Track on Kaggle →
              </a>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------------- live board
  return (
    <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
      {data.demo && (
        <Card style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#9a3412' }}>
          <strong>Preview data.</strong> These standings are synthetic, for previewing the page before the
          competition opens. The live build reads the real scores.
        </Card>
      )}

      {/* Track toggle */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
        {(['deep', 'broad'] as TrackId[]).map((id) => (
          <Pill key={id} active={track === id} color={TRACK_COLOR[id]} onClick={() => setTrack(id)}>
            {TRACK_LABEL[id]} Track
            {hasTeams(data.metrics[id]) && <span style={{ opacity: 0.75, fontWeight: 400 }}> · {data.metrics[id]!.teams.length}</span>}
          </Pill>
        ))}
      </div>

      {!hasTeams(metrics) ? (
        <Card style={{ background: SURFACE, color: INK.muted, fontSize: '15px' }}>
          No standings for the {TRACK_LABEL[track]} Track yet.
        </Card>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            <Stat value={stats?.best != null ? stats.best.toFixed(3) : '—'} label={`Best ${metricLabel(activeMetric)}`} color={accent} />
            <Stat value={fmtInt(stats?.teams ?? 0)} label="Teams" />
            <Stat value={fmtInt(stats?.submissions ?? 0)} label="Submissions" />
            <Stat value={daysLeft != null ? String(daysLeft) : '—'} label="Days remaining" />
          </div>

          {/* Metric selector */}
          {scoredMetrics.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: INK.muted, marginRight: '2px' }}>Metric:</span>
              {scoredMetrics.map((m) => (
                <Pill key={m} active={m === activeMetric} color={accent} onClick={() => setMetric(m)}>
                  {metricLabel(m)}
                </Pill>
              ))}
            </div>
          )}

          {/* Topline graph */}
          <Card style={{ marginBottom: '20px' }}>
            <CardTitle
              title={`Teams by ${metricLabel(activeMetric)}`}
              note={METRIC_INFO[activeMetric]?.description}
            />
            {metrics && <MetricBarChart data={metrics} metric={activeMetric} accent={accent} />}
          </Card>

          {/* Full table */}
          <Card style={{ marginBottom: '20px' }}>
            <CardTitle
              title="Best score per team — every metric"
              note="Kaggle ranks one number. We archive every submission and re-score it ourselves, so each team's best on each metric sits side by side (public split). Click a metric to rank by it."
            />
            {metrics && <MultiMetricTable data={metrics} accent={accent} metric={activeMetric} onMetricChange={setMetric} />}
          </Card>

          <Card style={{ background: SURFACE }}>
            <CardTitle title="About these numbers" />
            <div style={{ fontSize: '14px', lineHeight: 1.7, color: INK.secondary }}>
              <p style={{ margin: '0 0 10px' }}>
                <strong>BalAcc@10</strong> is Kaggle&apos;s official public score, shown here exactly as Kaggle
                reports it. <strong>BalAcc@1</strong> (strict top-1) and <strong>OVMI</strong> (the information a
                decoder recovers over the vocabulary) are computed by us from the submitted files, on the same{' '}
                <strong>public split</strong> — final placements use the private split, revealed after the deadline.
              </p>
              <p style={{ margin: 0, color: INK.muted, fontSize: '13px' }}>
                Updated {mounted && metrics ? new Date(metrics.updatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '…'} ·{' '}
                <a href={COMPETITION_URL[track]} target="_blank" rel="noopener noreferrer" style={{ color: accent }}>
                  {TRACK_LABEL[track]} Track on Kaggle →
                </a>
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
