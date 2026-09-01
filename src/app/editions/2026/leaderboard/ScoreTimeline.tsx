// No 'use client': imported only by LeaderboardView (already a client component).
import { useMemo, useRef, useState } from 'react';
import type { History, TrackId } from '../../../../lib/leaderboard';

const INK = { primary: '#0a0a0a', secondary: '#555', muted: '#888' };

interface Dot {
  time: number;
  score: number;
  team: string;
  sota: boolean; // set a new overall best when it landed
}

/** "12 Aug" — fixed to UTC so the static build and the browser agree. */
function fmtDate(ms: number): string {
  return new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/**
 * Score over time. Every dot is one improvement of a team's own best Kaggle
 * public score (that is what the feed records — plain submissions that don't
 * improve a team's best carry no score signal); the stepped line traces the
 * best score overall, so the rising staircase IS the state of the art.
 */
export default function ScoreTimeline({
  history,
  track,
  accent,
  chance,
  metricName,
}: {
  history: History;
  track: TrackId;
  accent: string;
  chance: number;
  metricName: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Dot | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const model = useMemo(() => {
    const trajectories = Object.values(history.trajectories[track] ?? {});
    const dots: Dot[] = trajectories
      .flatMap((tr) => tr.points.map(([t, s]) => ({ time: Date.parse(t), score: s, team: tr.team, sota: false })))
      .filter((d) => Number.isFinite(d.time) && Number.isFinite(d.score))
      .sort((a, b) => a.time - b.time);
    if (dots.length < 2) return null;

    // Flag the dots that raised the overall best at the moment they landed.
    let best = -Infinity;
    for (const d of dots) {
      if (d.score > best) {
        best = d.score;
        d.sota = true;
      }
    }
    const sota = dots.filter((d) => d.sota);

    // Extend the staircase to the latest snapshot so "current SOTA" reads as current.
    const snaps = history.summary[track] ?? [];
    const lastT = Math.max(dots[dots.length - 1].time, ...snaps.map((s) => Date.parse(s.t)).filter(Number.isFinite));

    const t0 = dots[0].time;
    const tSpan = Math.max(lastT - t0, 1);
    const scores = dots.map((d) => d.score);
    const yMin = Math.min(chance, ...scores);
    const yMax = Math.max(...scores, chance);
    const yPad = Math.max((yMax - yMin) * 0.08, 0.01);

    return { dots, sota, t0, tSpan, lastT, yMin: yMin - yPad, yMax: yMax + yPad };
  }, [history, track, chance]);

  if (!model) {
    return (
      <p style={{ fontSize: '14px', color: INK.muted, margin: 0 }}>
        Not enough scored submissions yet to draw a timeline — check back once a few scores are in.
      </p>
    );
  }

  // ---------------------------------------------------------------- geometry
  const W = 860;
  const H = 300;
  const PAD = { left: 46, right: 14, top: 12, bottom: 30 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (t: number) => PAD.left + ((t - model.t0) / model.tSpan) * plotW;
  const y = (s: number) => PAD.top + (1 - (s - model.yMin) / (model.yMax - model.yMin)) * plotH;

  // SOTA staircase: hold each best flat until the next improvement, then step up.
  const steps = model.sota;
  let sotaPath = `M ${x(steps[0].time).toFixed(1)} ${y(steps[0].score).toFixed(1)}`;
  for (let i = 1; i < steps.length; i++) {
    sotaPath += ` H ${x(steps[i].time).toFixed(1)} V ${y(steps[i].score).toFixed(1)}`;
  }
  sotaPath += ` H ${x(model.lastT).toFixed(1)}`;

  // Axis ticks: ~5 time ticks, ~5 score ticks on tidy steps.
  const timeTicks = Array.from({ length: 5 }, (_, i) => model.t0 + (model.tSpan * i) / 4);
  const yRange = model.yMax - model.yMin;
  const yStepRaw = yRange / 4;
  const yStep = [0.005, 0.01, 0.02, 0.025, 0.05, 0.1, 0.2].find((s) => s >= yStepRaw) ?? 0.5;
  const yTicks: number[] = [];
  for (let v = Math.ceil(model.yMin / yStep) * yStep; v <= model.yMax + 1e-9; v += yStep) yTicks.push(v);

  const currentBest = steps[steps.length - 1];

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const my = ((e.clientY - rect.top) / rect.height) * H;
    let nearest: Dot | null = null;
    let bestD = 14 * 14; // px² hit radius in viewBox units
    for (const d of model!.dots) {
      const dx = x(d.time) - mx;
      const dy = y(d.score) - my;
      const dist = dx * dx + dy * dy;
      if (dist < bestD) {
        bestD = dist;
        nearest = d;
      }
    }
    setHover(nearest);
    if (nearest && wrapRef.current) {
      const wrap = wrapRef.current.getBoundingClientRect();
      setTip({
        x: ((x(nearest.time) / W) * rect.width + rect.left - wrap.left),
        y: ((y(nearest.score) / H) * rect.height + rect.top - wrap.top),
      });
    } else {
      setTip(null);
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label={`Each dot is a team improving its best ${metricName} score; the stepped line is the best score overall, currently ${currentBest.score.toFixed(3)}.`}
        onMouseMove={onMove}
        onMouseLeave={() => { setHover(null); setTip(null); }}
      >
        {/* horizontal grid + y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#efecf6" strokeWidth={1} />
            <text x={PAD.left - 7} y={y(v) + 3.5} textAnchor="end" fontSize={11} fill={INK.muted}>
              {v.toFixed(yStep < 0.01 ? 3 : 2)}
            </text>
          </g>
        ))}
        {/* time ticks */}
        {timeTicks.map((t, i) => (
          <text
            key={t}
            x={x(t)}
            y={H - 9}
            textAnchor={i === 0 ? 'start' : i === timeTicks.length - 1 ? 'end' : 'middle'}
            fontSize={11}
            fill={INK.muted}
          >
            {fmtDate(t)}
          </text>
        ))}

        {/* chance line */}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(chance)} y2={y(chance)} stroke={INK.muted} strokeWidth={1} strokeDasharray="5 4" opacity={0.7} />
        <text x={W - PAD.right} y={y(chance) - 5} textAnchor="end" fontSize={11} fill={INK.muted}>
          chance {chance.toFixed(2)}
        </text>

        {/* every improvement */}
        {model.dots.map((d, i) => (
          <circle
            key={i}
            cx={x(d.time)}
            cy={y(d.score)}
            r={d.sota ? 4 : 2.8}
            fill={accent}
            opacity={d === hover ? 1 : d.sota ? 0.95 : 0.3}
          />
        ))}

        {/* the state of the art */}
        <path d={sotaPath} fill="none" stroke={accent} strokeWidth={2.2} strokeLinejoin="round" />
        <text
          x={Math.min(x(model.lastT), W - PAD.right - 4)}
          y={y(currentBest.score) - 8}
          textAnchor="end"
          fontSize={12}
          fontWeight={700}
          fill={accent}
        >
          {currentBest.score.toFixed(3)}
        </text>
      </svg>

      {hover && tip && (
        <div
          style={{
            position: 'absolute',
            left: tip.x,
            top: tip.y - 10,
            transform: 'translate(-50%, -100%)',
            background: INK.primary,
            color: '#fff',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '12px',
            lineHeight: 1.45,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
            zIndex: 5,
          }}
        >
          <strong>{hover.team}</strong> · {hover.score.toFixed(4)}
          {hover.sota && <span style={{ color: '#c4b5fd' }}> — new best overall</span>}
          <br />
          <span style={{ opacity: 0.75 }}>{fmtDate(hover.time)}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '10px', fontSize: '12px', color: INK.secondary }}>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 99, background: accent, opacity: 0.35, marginRight: 6 }} />team improves its own best</span>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 99, background: accent, marginRight: 6 }} />new best overall</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 2.5, background: accent, marginRight: 6, verticalAlign: 'middle' }} />state of the art</span>
      </div>
    </div>
  );
}
