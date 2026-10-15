'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadClip, type Clip } from '../_lib/meg';

/**
 * Hero visual: real MEG from the page's excerpt, one line per magnetometer (ordered front to
 * back across the head), drawn as an occluding ridgeline that scrolls in real time. The bottom
 * line is the loudness envelope of the narration, with the words underneath.
 */
export default function Ridgeline({ dir, height = 460, rows = 40, windowSec = 9 }: { dir: string; height?: number; rows?: number; windowSec?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [clip, setClip] = useState<Clip | null>(null);
  useEffect(() => { loadClip(dir).then(setClip).catch(() => {}); }, [dir]);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !clip) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // pick `rows` magnetometers evenly along the front-to-back axis
    const order = clip.layout.xy.map((p, i) => [p[1], i] as [number, number]).sort((a, b) => b[0] - a[0]).map(p => p[1]);
    const pick = Array.from({ length: rows }, (_, k) => order[Math.round((k / (rows - 1)) * (order.length - 1))]);
    const dur = clip.n / clip.fs;
    const env = clip.env ?? [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { const r = c.getBoundingClientRect(); c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); };
    resize();
    window.addEventListener('resize', resize);

    const val = (s: number, i: number) => {
      // light 7-tap smoothing so the ridges read as shapes, not noise
      let v = 0;
      for (let k = -3; k <= 3; k++) v += clip.mag[s * clip.n + Math.min(clip.n - 1, Math.max(0, i + k))];
      return v / 7;
    };

    let raf = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      const W = c.width, H = c.height;
      const tNow = reduce ? 12 : 4 + ((Math.max(0, now - t0) / 1000) % (dur - windowSec - 4));
      const tStart = tNow - windowSec * 0.5;
      ctx.clearRect(0, 0, W, H);
      const padX = 0, top = 18 * dpr, wordsH = 30 * dpr, envH = 54 * dpr;
      const usable = H - top - wordsH - envH;
      const step = usable / rows;
      const amp = step * 2.4;
      const N = Math.ceil(windowSec * clip.fs);
      const X = (k: number) => padX + (k / N) * (W - 2 * padX);
      const i0 = Math.floor(tStart * clip.fs);

      const cur = clip.words.find(([, s, d]) => tNow >= s && tNow < s + d);
      // MEG ridges, back (top) to front (bottom)
      for (let r = 0; r < rows; r++) {
        const base = top + step * (r + 1);
        ctx.beginPath();
        ctx.moveTo(X(0), base);
        for (let k = 0; k <= N; k++) {
          const v = Math.max(-1.5, Math.min(3.5, val(pick[r], i0 + k)));
          ctx.lineTo(X(k), base - v * amp * 0.4);
        }
        ctx.lineTo(X(N), H); ctx.lineTo(X(0), H); ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        for (let k = 0; k <= N; k++) {
          const v = Math.max(-1.5, Math.min(3.5, val(pick[r], i0 + k)));
          const y = base - v * amp * 0.4;
          if (k === 0) ctx.moveTo(X(k), y); else ctx.lineTo(X(k), y);
        }
        ctx.strokeStyle = `rgba(11,10,26,${0.35 + 0.5 * (r / rows)})`;
        ctx.lineWidth = 1.1 * dpr;
        ctx.stroke();
      }
      // speech envelope (the stimulus) as the front ridge
      const eBase = H - wordsH;
      ctx.beginPath();
      ctx.moveTo(X(0), eBase);
      for (let k = 0; k <= N; k++) ctx.lineTo(X(k), eBase - (env[i0 + k] ?? 0) * envH);
      ctx.lineTo(X(N), eBase); ctx.closePath();
      ctx.fillStyle = 'rgba(124,58,237,0.16)';
      ctx.fill();
      ctx.beginPath();
      for (let k = 0; k <= N; k++) { const y = eBase - (env[i0 + k] ?? 0) * envH; if (k === 0) ctx.moveTo(X(k), y); else ctx.lineTo(X(k), y); }
      ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.8 * dpr; ctx.stroke();
      // words
      ctx.font = `${13 * dpr}px var(--font-geist-sans), system-ui, sans-serif`;
      ctx.textBaseline = 'middle';
      let lastEnd = -Infinity;
      for (const [w, s, d] of clip.words) {
        if (s + d < tStart || s > tStart + windowSec) continue;
        const x = X((s - tStart) * clip.fs);
        if (x < lastEnd + 6 * dpr) continue;
        lastEnd = x + ctx.measureText(w).width;
        const on = cur && cur[1] === s;
        ctx.fillStyle = on ? '#0b0a1a' : 'rgba(11,10,26,0.42)';
        ctx.font = `${on ? 600 : 400} ${13 * dpr}px var(--font-geist-sans), system-ui, sans-serif`;
        ctx.fillText(w, x, H - wordsH / 2);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [clip, rows, windowSec]);

  return (
    <canvas
      ref={canvas}
      style={{ width: '100%', height, display: 'block', maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' }}
      role="img"
      aria-label="Real MEG traces from 40 sensors, stacked front to back, scrolling in time with the narration's loudness envelope and words"
    />
  );
}
