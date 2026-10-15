'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadClip, type Clip } from '../_lib/meg';

/**
 * The 102 sensor sites of the MEGIN TRIUX™ neo helmet in 3D, slowly rotating. Each site glows
 * with the combined planar-gradient power of the real recording (looping the page's clip), so
 * the "helmet" is literally lit by the participant's brain listening to Sherlock Holmes.
 */
export default function SensorHelmet({ dir, height = 420, accent = [196, 181, 253], hot = [251, 113, 133] }: { dir: string; height?: number; accent?: number[]; hot?: number[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [clip, setClip] = useState<Clip | null>(null);
  const drag = useRef({ on: false, x: 0, y: 0, yaw: 0.6, pitch: -0.35, vYaw: 0.0022 });

  useEffect(() => { loadClip(dir).then(setClip).catch(() => {}); }, [dir]);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !clip) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const xyz = clip.layout.xyz;
    const N = xyz.length;
    // neighbour edges for the mesh
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    for (let i = 0; i < N; i++) {
      const d = xyz.map((p, j) => [j, (p[0] - xyz[i][0]) ** 2 + (p[1] - xyz[i][1]) ** 2 + (p[2] - xyz[i][2]) ** 2] as [number, number]).sort((a, b) => a[1] - b[1]);
      for (let k = 1; k <= 4; k++) {
        const j = d[k][0];
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key) && d[k][1] < 0.16) { seen.add(key); edges.push([i, j]); }
      }
    }
    const level = new Float32Array(N);
    let raf = 0;
    const t0 = performance.now();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      const W = c.width, H = c.height;
      ctx.clearRect(0, 0, W, H);
      const st = drag.current;
      if (!st.on && !reduce) st.yaw += st.vYaw;
      const t = (Math.max(0, now - t0) / 1000) % (clip.n / clip.fs);
      const idx = t * clip.fs;
      for (let s = 0; s < N; s++) {
        const a = Math.floor(idx), f = idx - a;
        const v = clip.grad[s * clip.n + a] * (1 - f) + clip.grad[s * clip.n + Math.min(clip.n - 1, a + 1)] * f;
        level[s] += (Math.min(1, Math.max(0, (v - 0.8) / 2.6)) - level[s]) * 0.25;
      }
      const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch);
      const scale = Math.min(W, H) * 0.36;
      const proj = xyz.map(([x, y, z]) => {
        // device frame: x right, y front, z up → screen
        const x1 = x * cy - y * sy, y1 = x * sy + y * cy;
        const z1 = z - 0.25;
        const y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp;
        const persp = 2.6 / (2.6 + y2);
        return [W / 2 + x1 * scale * persp, H / 2 - z2 * scale * persp, y2, persp] as const;
      });
      ctx.lineWidth = 1 * dpr;
      for (const [i, j] of edges) {
        const depth = (proj[i][2] + proj[j][2]) / 2;
        const alpha = 0.06 + 0.16 * (1 - (depth + 1) / 2);
        ctx.strokeStyle = `rgba(${accent.join(',')},${alpha})`;
        ctx.beginPath(); ctx.moveTo(proj[i][0], proj[i][1]); ctx.lineTo(proj[j][0], proj[j][1]); ctx.stroke();
      }
      const order = proj.map((_, i) => i).sort((a, b) => proj[b][2] - proj[a][2]);
      for (const i of order) {
        const [px, py, depth, persp] = proj[i];
        const front = 1 - (depth + 1) / 2;
        const L = level[i];
        const r = (2.2 + 9 * L) * persp * dpr;
        const col = accent.map((a, k) => Math.round(a + (hot[k] - a) * L));
        const g = ctx.createRadialGradient(px, py, 0, px, py, r * 3.2);
        g.addColorStop(0, `rgba(${col.join(',')},${0.25 + 0.6 * L * front + 0.15 * front})`);
        g.addColorStop(1, `rgba(${col.join(',')},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, r * 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.6 * front})`;
        ctx.beginPath(); ctx.arc(px, py, 1.6 * persp * dpr, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [clip, accent, hot]);

  const onDown = (e: React.PointerEvent) => { const s = drag.current; s.on = true; s.x = e.clientX; s.y = e.clientY; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    const s = drag.current; if (!s.on) return;
    s.yaw += (e.clientX - s.x) * 0.008; s.pitch = Math.max(-1.2, Math.min(0.5, s.pitch + (e.clientY - s.y) * 0.006));
    s.vYaw = Math.sign(e.clientX - s.x || 1) * 0.0022; s.x = e.clientX; s.y = e.clientY;
  };
  const onUp = () => { drag.current.on = false; };

  return (
    <canvas
      ref={canvas}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      style={{ width: '100%', height, display: 'block', cursor: 'grab', touchAction: 'pan-y' }}
      aria-label="Rotating 3D view of the 102 MEG sensor sites, glowing with recorded brain activity"
      role="img"
    />
  );
}
