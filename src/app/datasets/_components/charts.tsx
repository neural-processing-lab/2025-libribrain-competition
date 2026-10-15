'use client';

import React, { useState } from 'react';
import { useInView } from './ui';

const r2 = (v: number) => Math.round(v * 100) / 100;

export interface Series { name: string; color: string; points: [number, number][]; dashed?: boolean }

/** Line chart with optional log-x, hover readout, and draw-on animation. */
export function LineChart({
  series, logX = false, xLabel, yLabel, yMin, yMax, xTicks, yTicks, chance, chanceLabel = 'chance', height = 280, yFmt = (v: number) => v.toFixed(2), xFmt = (v: number) => String(v), dark = false,
}: {
  series: Series[]; logX?: boolean; xLabel: string; yLabel: string; yMin: number; yMax: number; xTicks: number[]; yTicks: number[];
  chance?: number; chanceLabel?: string; height?: number; yFmt?: (v: number) => string; xFmt?: (v: number) => string; dark?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<{ s: number; p: number } | null>(null);
  const W = 520, H = height, L = 52, R = 16, T = 14, B = 42;
  const xs = series.flatMap(s => s.points.map(p => p[0]));
  const xmin = Math.min(...xTicks, ...xs), xmax = Math.max(...xTicks, ...xs);
  const fx = (v: number) => logX ? Math.log10(v) : v;
  const X = (v: number) => r2(L + ((fx(v) - fx(xmin)) / (fx(xmax) - fx(xmin))) * (W - L - R));
  const Y = (v: number) => r2(T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B));
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="ds-chart" style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="img" aria-label={`${yLabel} versus ${xLabel}`}>
        {yTicks.map(t => (
          <g key={t}><line className="grid" x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} /><text className="ax" x={L - 8} y={Y(t) + 4} textAnchor="end">{yFmt(t)}</text></g>
        ))}
        {xTicks.map(t => <text key={t} className="ax" x={X(t)} y={H - B + 18} textAnchor="middle">{xFmt(t)}</text>)}
        <text className="ax-title" x={(L + W - R) / 2} y={H - 4} textAnchor="middle">{xLabel.toUpperCase()}</text>
        <text className="ax-title" x={14} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>{yLabel.toUpperCase()}</text>
        {chance !== undefined && (
          <g>
            <line x1={L} x2={W - R} y1={Y(chance)} y2={Y(chance)} stroke={dark ? '#8a85a0' : '#a9a5b8'} strokeDasharray="4 4" />
            <text x={W - R} y={Y(chance) - 6} textAnchor="end" fontSize="10.5" fill={dark ? '#8a85a0' : '#a9a5b8'} fontFamily="var(--ds-mono)">{chanceLabel}</text>
          </g>
        )}
        {series.map((s, si) => {
          const d = s.points.map((p, k) => `${k ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? '5 5' : undefined}
                pathLength={1} style={s.dashed ? undefined : { strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1, transition: `stroke-dashoffset 1.6s ${si * 0.25}s cubic-bezier(.3,.7,.2,1)` }} />
              {s.points.map((p, k) => (
                <circle key={k} cx={X(p[0])} cy={Y(p[1])} r={hover?.s === si && hover.p === k ? 6 : 4} fill={dark ? '#0b0a1a' : '#fff'} stroke={s.color} strokeWidth={2.2}
                  style={{ opacity: inView ? 1 : 0, transition: `opacity 0.4s ${0.4 + k * 0.12 + si * 0.25}s` }}
                  onPointerEnter={() => setHover({ s: si, p: k })} onPointerLeave={() => setHover(null)} />
              ))}
            </g>
          );
        })}
      </svg>
      {hover && (() => {
        const s = series[hover.s], p = s.points[hover.p];
        return (
          <div className="ds-tip" style={{ left: `${(X(p[0]) / W) * 100}%`, top: `${(Y(p[1]) / H) * 100}%` }}>
            <b style={{ color: s.color }}>{s.name}</b><br />
            <span className="m">{xLabel}: {xFmt(p[0])} · {yLabel}: {yFmt(p[1])}</span>
          </div>
        );
      })()}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem', paddingLeft: L * 0.6 }}>
        {series.map(s => (
          <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: dark ? '#b4afc6' : 'var(--ds-muted)' }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, background: s.color }} />{s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface BarGroup { label: string; bars: { name: string; value: number; color: string; hatch?: boolean; note?: string }[] }

/** Grouped vertical bars with value labels, chance line and optional significance brackets. */
export function GroupedBars({ groups, yMax = 0.8, chance, height = 300, yLabel = 'Top-10 balanced accuracy', dark = false, digits = 3 }: { groups: BarGroup[]; yMax?: number; chance?: number; height?: number; yLabel?: string; dark?: boolean; digits?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<string | null>(null);
  const W = 560, H = height, L = 48, R = 8, T = 18, B = 40;
  const nBars = groups.reduce((a, g) => a + g.bars.length, 0);
  const gap = 26;
  const bw = Math.min(54, (W - L - R - gap * (groups.length + 1)) / nBars);
  const Y = (v: number) => r2(T + (1 - v / yMax) * (H - T - B));
  const ticks = Array.from({ length: Math.floor(yMax / 0.2) + 1 }, (_, i) => +(i * 0.2).toFixed(1));
  const used = groups.reduce((a, g) => a + g.bars.length * bw, 0) + gap * (groups.length - 1);
  let cx = L + (W - L - R - used) / 2;
  const txt = dark ? '#e9e5f7' : '#0b0a1a';
  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="ds-chart" style={{ width: '100%', height: 'auto' }} role="img" aria-label={yLabel}>
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
          </pattern>
        </defs>
        {ticks.map(t => <g key={t}><line className="grid" x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} /><text className="ax" x={L - 8} y={Y(t) + 4} textAnchor="end">{t.toFixed(1)}</text></g>)}
        <text className="ax-title" x={13} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 13 ${(T + H - B) / 2})`}>{yLabel.toUpperCase()}</text>
        {groups.map((g, gi) => {
          const x0 = cx;
          const els = g.bars.map((b, bi) => {
            const x = x0 + bi * bw;
            const key = `${gi}-${bi}`;
            const h = (H - B) - Y(b.value);
            return (
              <g key={key} onPointerEnter={() => setHover(key)} onPointerLeave={() => setHover(null)}>
                <rect x={x + 2} y={inView ? Y(b.value) : H - B} width={bw - 4} height={inView ? h : 0} rx={3} fill={b.color}
                  opacity={hover && hover !== key ? 0.55 : 1} style={{ transition: `all 0.9s ${0.1 * (gi * 3 + bi)}s cubic-bezier(.3,.7,.2,1), opacity 0.2s` }} />
                {b.hatch && <rect x={x + 2} y={inView ? Y(b.value) : H - B} width={bw - 4} height={inView ? h : 0} rx={3} fill="url(#hatch)" style={{ transition: `all 0.9s ${0.1 * (gi * 3 + bi)}s cubic-bezier(.3,.7,.2,1)` }} />}
                <text x={x + bw / 2} y={Y(b.value) - 6} textAnchor="middle" fontSize="11.5" fontWeight={600} fill={txt} style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s 0.9s' }}>{b.value.toFixed(digits)}</text>
              </g>
            );
          });
          cx += g.bars.length * bw + gap;
          return (
            <g key={g.label}>
              {els}
              <text x={x0 + (g.bars.length * bw) / 2} y={H - B + 18} textAnchor="middle" fontSize="12.5" fontWeight={600} fill={txt}>{g.label}</text>
            </g>
          );
        })}
        {chance !== undefined && (
          <line x1={L} x2={W - R} y1={Y(chance)} y2={Y(chance)} stroke={dark ? '#fff' : '#0b0a1a'} strokeOpacity={0.5} strokeDasharray="4 4" />
        )}
      </svg>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.2rem' }}>
        {Array.from(new Map(groups.flatMap(g => g.bars.map(b => [b.name, b]))).values()).map(b => (
          <span key={b.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: dark ? '#b4afc6' : 'var(--ds-muted)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: b.hatch ? `repeating-linear-gradient(45deg, #77738a 0 2px, transparent 2px 5px)` : '#77738a', border: '1px solid #77738a' }} />{b.name}
          </span>
        ))}
        {chance !== undefined && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: dark ? '#b4afc6' : 'var(--ds-muted)' }}>
            <span style={{ width: 16, borderTop: `1.5px dashed ${dark ? '#c9c5d8' : '#77738a'}` }} />chance = {chance}
          </span>
        )}
      </div>
    </div>
  );
}
