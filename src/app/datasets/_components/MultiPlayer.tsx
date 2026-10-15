'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assetPath } from '../../../lib/assetPath';
import { fetchJSON, phonClass, PHON_COLORS, LUT_POWER_DARK, type ClipMeta } from '../_lib/meg';
import Topomap from './Topomap';
import { Icon } from './ui';

export interface MultiSubject { id: string; site: number; n_epochs: number; gfp: number[]; peak_ms: number; topo: number[] }
export interface MultiMeta extends ClipMeta { map_fs: number; map_n: number; subjects: MultiSubject[] }
interface Multi extends MultiMeta { maps: Float32Array[]; traces: Float32Array[] }

const cache: { p?: Promise<Multi> } = {};
export function loadMulti(dir: string): Promise<Multi> {
  if (!cache.p) {
    cache.p = (async () => {
      const [meta, buf] = await Promise.all([fetchJSON<MultiMeta>(`${dir}/multi.json`), fetch(assetPath(`${dir}/multi-meg.bin`)).then(r => r.arrayBuffer())]);
      const maps: Float32Array[] = [], traces: Float32Array[] = [];
      let o = 0;
      const u8 = new Uint8Array(buf), i8 = new Int8Array(buf);
      for (let s = 0; s < meta.subjects.length; s++) {
        const m = new Float32Array(102 * meta.map_n);
        for (let k = 0; k < m.length; k++) m[k] = u8[o + k] / 51;
        o += m.length;
        const t = new Float32Array(meta.n);
        for (let k = 0; k < t.length; k++) t[k] = i8[o + k] / 31.75;
        o += t.length;
        maps.push(m); traces.push(t);
      }
      return { ...meta, maps, traces };
    })();
  }
  return cache.p;
}

export const SUBJ_COLORS = ['#c4b5fd', '#4ade80', '#fb7185', '#fbbf24', '#38bdf8', '#f472b6', '#a3e635', '#fb923c', '#67e8f9', '#e879f9', '#facc15', '#2dd4bf', '#f87171'];

const WINDOW = 5, LEAD = 0.32;

export default function MultiPlayer({ dir }: { dir: string }) {
  const [d, setD] = useState<Multi | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const audio = useRef<HTMLAudioElement>(null);
  const scope = useRef<HTMLCanvasElement>(null);
  const spec = useRef<HTMLImageElement | null>(null);
  const [specReady, setSpecReady] = useState(false);

  useEffect(() => {
    loadMulti(dir).then(setD);
    const img = new Image(); img.onload = () => { spec.current = img; setSpecReady(true); }; img.src = assetPath(`${dir}/multi-spec.png`);
  }, [dir]);
  useEffect(() => {
    let raf = 0;
    const loop = () => { const a = audio.current; if (a && !a.paused) { tRef.current = a.currentTime; setT(a.currentTime); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const dur = d ? d.n / d.fs : 21;
  const seek = useCallback((x: number) => { const v = Math.max(0, Math.min(dur - 0.05, x)); tRef.current = v; setT(v); if (audio.current) audio.current.currentTime = v; }, [dur]);
  const toggle = () => { const a = audio.current; if (!a) return; if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {}); else { a.pause(); setPlaying(false); } };

  useEffect(() => {
    const c = scope.current; if (!c || !d) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = c.getBoundingClientRect();
    if (c.width !== Math.round(rect.width * dpr)) { c.width = Math.round(rect.width * dpr); c.height = Math.round(rect.height * dpr); }
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    const t0 = t - WINDOW * LEAD;
    const X = (x: number) => ((x - t0) / WINDOW) * W;
    const specH = H * 0.15, phonY = specH + 3 * dpr, phonH = 12 * dpr, wordY = phonY + phonH + 2 * dpr, wordH = 16 * dpr, top = wordY + wordH + 6 * dpr;
    // current word band
    const cw = d.words.find(([, s, du]) => t >= s && t < s + du);
    if (cw) { ctx.fillStyle = 'rgba(196,181,253,0.09)'; ctx.fillRect(X(cw[1]), 0, X(cw[1] + cw[2]) - X(cw[1]), H); }
    const img = spec.current;
    if (img) {
      const pps = img.width / dur, sx = t0 * pps, sw = WINDOW * pps, l = Math.max(0, sx), r = Math.min(img.width, sx + sw);
      if (r > l) ctx.drawImage(img, l, 0, r - l, img.height, ((l - sx) / sw) * W, 0, ((r - l) / sw) * W, specH);
    }
    for (const [p, s, du] of d.phonemes) {
      if (s + du < t0 || s > t0 + WINDOW) continue;
      const on = t >= s && t < s + du;
      ctx.fillStyle = PHON_COLORS[phonClass(p)] + (on ? 'ff' : '50');
      ctx.fillRect(X(s) + 0.5 * dpr, phonY, Math.max(1, X(s + du) - X(s) - dpr), phonH);
    }
    ctx.font = `500 ${11.5 * dpr}px system-ui, sans-serif`; ctx.textBaseline = 'middle';
    for (const [w, s, du] of d.words) {
      if (s + du < t0 || s > t0 + WINDOW) continue;
      const on = t >= s && t < s + du;
      ctx.fillStyle = on ? '#fff' : 'rgba(233,229,247,0.5)';
      ctx.fillText(w, X(s) + 2 * dpr, wordY + wordH / 2);
    }
    const rowH = (H - top) / d.subjects.length;
    d.subjects.forEach((s, k) => {
      const tr = d.traces[k], y0 = top + rowH * (k + 0.5);
      ctx.strokeStyle = SUBJ_COLORS[k % SUBJ_COLORS.length]; ctx.lineWidth = 1.2 * dpr; ctx.globalAlpha = 0.9;
      ctx.beginPath();
      const i0 = Math.max(0, Math.floor(t0 * d.fs)), i1 = Math.min(d.n - 1, Math.ceil((t0 + WINDOW) * d.fs));
      for (let i = i0; i <= i1; i++) { const x = X(i / d.fs), y = y0 - tr[i] * rowH * 0.28; if (i === i0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(201,197,216,0.6)'; ctx.font = `${9.5 * dpr}px ui-monospace, monospace`;
      ctx.fillText(s.id, 4 * dpr, y0 - rowH * 0.25);
    });
    ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 1.5 * dpr; ctx.beginPath(); ctx.moveTo(X(t), 0); ctx.lineTo(X(t), H); ctx.stroke();
  }, [d, t, specReady, dur]);

  const maps = useMemo(() => {
    if (!d) return [];
    const i = Math.min(d.map_n - 1, Math.round(t * d.map_fs));
    return d.subjects.map((_, k) => {
      const out = new Float32Array(102);
      for (let s = 0; s < 102; s++) {
        let v = 0, c = 0;
        for (let j = Math.max(0, i - 1); j <= Math.min(d.map_n - 1, i + 1); j++) { v += d.maps[k][s * d.map_n + j]; c++; }
        out[s] = v / c;
      }
      return out;
    });
  }, [d, t]);

  const cur = d?.words.find(([, s, du]) => t >= s && t < s + du + 0.1);
  return (
    <div className="ds-panel" tabIndex={0} onKeyDown={e => { if (e.key === ' ') { e.preventDefault(); toggle(); } }} style={{ outline: 'none' }}>
      <audio ref={audio} src={assetPath(`${dir}/multi.m4a`)} preload="auto" onEnded={() => { setPlaying(false); seek(0); }} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
      <div className="ds-glow" style={{ width: 360, height: 360, background: '#4a7bd0', top: -160, left: -60, opacity: 0.25 }} />
      <div className="ds-glow" style={{ width: 360, height: 360, background: '#a855f7', bottom: -180, right: -60, opacity: 0.25 }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.3rem', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
        <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} style={{ width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', background: playing ? 'rgba(196,181,253,0.16)' : '#c4b5fd', color: playing ? '#fff' : '#0b0a1a', boxShadow: playing ? 'none' : '0 0 0 6px rgba(196,181,253,0.15)', flexShrink: 0 }}>
          <span style={{ width: 18, height: 18, display: 'block', marginLeft: playing ? 0 : 2 }}>{playing ? Icon.pause : Icon.play}</span>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>One chapter, {d?.subjects.length ?? '…'} brains</div>
          <div className="ds-label" style={{ marginTop: 3 }}>{d?.session ?? 'loading…'} · {t.toFixed(1)}s / {dur.toFixed(1)}s</div>
        </div>
        <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 30, color: '#fff', minWidth: 160, textAlign: 'right' }}>{cur ? cur[0] : <span style={{ color: '#4a4560' }}>…</span>}</div>
      </div>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '1.2rem', padding: '1rem 1.3rem 1.3rem' }} className="ds-multi-grid">
        <canvas ref={scope} style={{ width: '100%', height: 440, display: 'block', cursor: 'ew-resize' }}
          onPointerDown={e => {
            const r = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect(); const x0 = e.clientX, ts = tRef.current;
            const mv = (ev: PointerEvent) => seek(ts - ((ev.clientX - x0) / r.width) * WINDOW);
            const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
            window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
          }} role="img" aria-label="Audio spectrogram, words and one auditory sensor trace per subject" />
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(78px, 1fr))', gap: '0.5rem' }}>
            {d?.subjects.map((s, k) => (
              <div key={s.id} style={{ textAlign: 'center' }}>
                <Topomap xy={d.layout.xy} values={maps[k]} lo={0.6} hi={3.0} lut={LUT_POWER_DARK} size="100%" sensors={false} res={44} highlight={[s.site]} highlightColors={[SUBJ_COLORS[k % SUBJ_COLORS.length]]} />
                <div style={{ fontFamily: 'var(--ds-mono)', fontSize: 10.5, color: SUBJ_COLORS[k % SUBJ_COLORS.length], marginTop: 2 }}>{s.id}</div>
              </div>
            ))}
          </div>
          <p className="ds-p-sm" style={{ color: '#8a85a0', marginTop: '0.9rem', fontSize: 13 }}>
            Gradiometer power for every listener at this instant. The dot marks the sensor whose trace is shown on the left: each subject&apos;s most speech-tracking temporal gradiometer.
          </p>
        </div>
      </div>
      <div style={{ position: 'relative', padding: '0 1.3rem 1.3rem' }}>
        <div style={{ position: 'relative', height: 30, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', background: '#12102a' }}
          onPointerDown={e => {
            const r = e.currentTarget.getBoundingClientRect(); const set = (x: number) => seek(((x - r.left) / r.width) * dur); set(e.clientX);
            const mv = (ev: PointerEvent) => set(ev.clientX); const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
            window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
          }} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(dur)} aria-valuenow={Math.round(t)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(`${dir}/multi-spec.png`)} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill', opacity: 0.8 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(t / dur) * 100}%`, background: 'rgba(196,181,253,0.18)', borderRight: '2px solid #c4b5fd' }} />
        </div>
      </div>
      <style>{`@media (max-width: 860px) { .ds-multi-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
