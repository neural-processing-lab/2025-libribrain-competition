'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { makeTopoGrid, paintTopo, type LUT, type TopoGrid } from '../_lib/meg';

const gridCache = new WeakMap<object, TopoGrid>();

export function useTopoGrid(xy: [number, number][] | undefined, res = 84) {
  return useMemo(() => {
    if (!xy) return null;
    const hit = gridCache.get(xy);
    if (hit && hit.res === res) return hit;
    const g = makeTopoGrid(xy, res);
    gridCache.set(xy, g);
    return g;
  }, [xy, res]);
}

interface Props {
  xy: [number, number][];
  values: ArrayLike<number> | null;
  lo: number;
  hi: number;
  lut: LUT;
  size?: number | string;
  dark?: boolean;
  sensors?: boolean;
  highlight?: number[];
  highlightColors?: string[];
  res?: number;
  label?: React.ReactNode;
}

/** Interpolated sensor-space map with a head outline (nose up, as seen from above). */
export default function Topomap({ xy, values, lo, hi, lut, size = 220, dark = true, sensors = true, highlight = [], highlightColors = [], res = 84, label }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const grid = useTopoGrid(xy, res);
  const img = useRef<ImageData | null>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !grid || !values) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    if (!img.current || img.current.width !== grid.res) img.current = ctx.createImageData(grid.res, grid.res);
    paintTopo(img.current, grid, values, lo, hi, lut);
    ctx.putImageData(img.current, 0, 0);
  }, [grid, values, lo, hi, lut]);

  const stroke = dark ? 'rgba(255,255,255,0.55)' : 'rgba(11,10,26,0.55)';
  const R = 1.06;
  const toPx = (v: number) => ((v + 1.25) / 2.5) * 100;
  return (
    <div style={{ position: 'relative', width: size, aspectRatio: '1 / 1', maxWidth: '100%' }}>
      <canvas
        ref={canvas}
        width={res}
        height={res}
        style={{
          position: 'absolute',
          left: `${toPx(-1)}%`, top: `${toPx(-1)}%`, width: `${(2 / 2.5) * 100}%`, height: `${(2 / 2.5) * 100}%`,
          borderRadius: '50%', imageRendering: 'auto', filter: 'blur(0.4px)',
        }}
      />
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} aria-hidden>
        <circle cx="50" cy="50" r={(R / 2.5) * 100} fill="none" stroke={stroke} strokeWidth="0.8" />
        {/* nose */}
        <path d={`M ${50 - 4} ${toPx(-R) + 0.6} L 50 ${toPx(-R) - 5.5} L ${50 + 4} ${toPx(-R) + 0.6}`} fill="none" stroke={stroke} strokeWidth="0.8" />
        {/* ears */}
        <path d={`M ${toPx(-R)} 45 q -4 5 0 10`} fill="none" stroke={stroke} strokeWidth="0.8" />
        <path d={`M ${toPx(R)} 45 q 4 5 0 10`} fill="none" stroke={stroke} strokeWidth="0.8" />
        {sensors && xy.map(([x, y], i) => (
          <circle key={i} cx={toPx(x * 0.98)} cy={toPx(-y * 0.98)} r={0.55} fill={dark ? 'rgba(255,255,255,0.45)' : 'rgba(11,10,26,0.35)'} />
        ))}
        {highlight.map((s, i) => (
          <circle key={`h${i}`} cx={toPx(xy[s][0] * 0.98)} cy={toPx(-xy[s][1] * 0.98)} r={2.2} fill={highlightColors[i] ?? '#fff'} stroke={dark ? '#0b0a1a' : '#fff'} strokeWidth="0.7" />
        ))}
      </svg>
      {label && <div style={{ position: 'absolute', left: 0, right: 0, bottom: '-0.2rem', textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

export function ColorBar({ lut, lo, hi, unit, dark = true, width = 140 }: { lut: LUT; lo: string; hi: string; unit?: string; dark?: boolean; width?: number }) {
  const stops: string[] = [];
  for (let i = 0; i <= 10; i++) {
    const c = Math.round((i / 10) * 255) * 4;
    stops.push(`rgb(${lut[c]},${lut[c + 1]},${lut[c + 2]}) ${i * 10}%`);
  }
  const col = dark ? '#8a85a0' : '#77738a';
  return (
    <div style={{ width, fontFamily: 'var(--ds-mono)', fontSize: 10.5, color: col }}>
      <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${stops.join(',')})` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span>{lo}</span>{unit && <span>{unit}</span>}<span>{hi}</span>
      </div>
    </div>
  );
}
