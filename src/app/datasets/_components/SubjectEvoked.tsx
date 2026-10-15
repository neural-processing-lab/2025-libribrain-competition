'use client';

import React, { useEffect, useState } from 'react';
import { LUT_POWER_LIGHT } from '../_lib/meg';
import Topomap from './Topomap';
import { loadMulti, SUBJ_COLORS } from './MultiPlayer';

type Multi = Awaited<ReturnType<typeof loadMulti>>;

/** Word-onset responses (temporal-sensor power) for every subject, plus each subject's peak topography. */
export default function SubjectEvoked({ dir }: { dir: string }) {
  const [d, setD] = useState<Multi | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => { loadMulti(dir).then(setD); }, [dir]);
  if (!d) return <div style={{ minHeight: 360 }} />;
  const W = 560, H = 260, L = 40, R = 10, T = 10, B = 34;
  const norm = d.subjects.map(s => { const base = s.gfp.slice(0, 20).reduce((a, v) => a + v, 0) / 20; const mx = Math.max(...s.gfp); return s.gfp.map(v => (v - base) / (mx - base)); });
  const X = (k: number) => L + (k / 99) * (W - L - R);
  const Y = (v: number) => T + (1 - (v + 0.4) / 1.5) * (H - T - B);
  const mean = norm[0].map((_, k) => norm.reduce((a, r) => a + r[k], 0) / norm.length);
  const path = (arr: number[]) => arr.map((v, k) => `${k ? 'L' : 'M'}${X(k).toFixed(1)},${Y(v).toFixed(1)}`).join('');
  const peaks = d.subjects.map(s => s.peak_ms).sort((a, b) => a - b);
  return (
    <div className="ds-cols-2">
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} className="ds-chart" style={{ width: '100%', height: 'auto' }} role="img" aria-label="Normalised word-onset responses for each subject">
          {[-200, 0, 200, 400, 600, 800].map(ms => { const k = (ms + 200) / 10; return <g key={ms}><line className="grid" x1={X(k)} x2={X(k)} y1={T} y2={H - B} /><text className="ax" x={X(k)} y={H - B + 16} textAnchor="middle">{ms}</text></g>; })}
          <text className="ax-title" x={(L + W - R) / 2} y={H - 2} textAnchor="middle">Time from word onset (ms)</text>
          <line x1={X(20)} x2={X(20)} y1={T} y2={H - B} stroke="#0b0a1a" strokeOpacity={0.4} strokeDasharray="3 3" />
          {norm.map((r, k) => (
            <path key={k} d={path(r)} fill="none" stroke={SUBJ_COLORS[k % SUBJ_COLORS.length]} strokeWidth={hover === k ? 2.6 : 1.3} strokeOpacity={hover === null || hover === k ? 0.9 : 0.15}
              onPointerEnter={() => setHover(k)} onPointerLeave={() => setHover(null)} style={{ filter: 'saturate(1.3) brightness(0.8)' }} />
          ))}
          <path d={path(mean)} fill="none" stroke="#0b0a1a" strokeWidth={3} />
        </svg>
        <p className="ds-note">
          Each line is one listener&apos;s average response to ~3,250 word onsets in the same chapter, measured over temporal gradiometers and normalised. The black line is their mean.
          Peaks fall between {peaks[0]} and {peaks[peaks.length - 1]} ms.
        </p>
      </div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))', gap: '0.5rem' }}>
          {d.subjects.map((s, k) => (
            <div key={s.id} onPointerEnter={() => setHover(k)} onPointerLeave={() => setHover(null)} style={{ textAlign: 'center', opacity: hover === null || hover === k ? 1 : 0.45, transition: 'opacity 0.2s' }}>
              <Topomap xy={d.layout.xy} values={s.topo.map(v => v / 1000)} lo={0} hi={1} lut={LUT_POWER_LIGHT} size="100%" dark={false} sensors={false} res={44} />
              <div style={{ fontFamily: 'var(--ds-mono)', fontSize: 10.5, color: 'var(--ds-muted)' }}>{s.id} · {s.peak_ms} ms</div>
            </div>
          ))}
        </div>
        <p className="ds-note">Topography at each listener&apos;s own peak. The same bilateral auditory pattern appears in every head, though its strength and exact location differ: the cross-subject problem in one picture.</p>
      </div>
    </div>
  );
}
