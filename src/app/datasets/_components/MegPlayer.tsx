'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assetPath } from '../../../lib/assetPath';
import {
  loadClip, nearestSensor, phonClass, PHON_COLORS, ARPABET, sampleAt,
  LUT_DIVERGING_DARK, LUT_POWER_DARK, type Clip,
} from '../_lib/meg';
import Topomap, { ColorBar } from './Topomap';
import { Icon, Seg } from './ui';

const TRACE_SITES: { name: string; x: number; y: number; color: string }[] = [
  { name: 'L temporal', x: -0.9, y: 0.05, color: '#fb7185' },
  { name: 'R temporal', x: 0.9, y: 0.05, color: '#f472b6' },
  { name: 'L frontal', x: -0.4, y: 0.7, color: '#a78bfa' },
  { name: 'R frontal', x: 0.4, y: 0.7, color: '#818cf8' },
  { name: 'Vertex', x: 0, y: 0.05, color: '#67e8f9' },
  { name: 'L parietal', x: -0.5, y: -0.5, color: '#4ade80' },
  { name: 'R parietal', x: 0.5, y: -0.5, color: '#a3e635' },
  { name: 'Occipital', x: 0, y: -0.9, color: '#facc15' },
];

const WINDOW = 5; // seconds visible in the scope
const LEAD = 0.32; // playhead position as a fraction of the window

export default function MegPlayer({ dir, title }: { dir: string; title?: string }) {
  const [clip, setClip] = useState<Clip | null>(null);
  const [err, setErr] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<'mag' | 'grad'>('grad');
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const audio = useRef<HTMLAudioElement>(null);
  const scope = useRef<HTMLCanvasElement>(null);
  const spec = useRef<HTMLImageElement | null>(null);
  const [specReady, setSpecReady] = useState(false);

  useEffect(() => {
    loadClip(dir).then(setClip).catch(() => setErr(true));
    const img = new Image();
    img.onload = () => { spec.current = img; setSpecReady(true); };
    img.src = assetPath(`${dir}/clip-spec.png`);
  }, [dir]);

  const dur = clip ? clip.n / clip.fs : 40;
  const sites = useMemo(() => clip ? TRACE_SITES.map(s => nearestSensor(clip.layout.xy, s.x, s.y)) : [], [clip]);

  // clock: audio when playing, otherwise the scrubbed time
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const a = audio.current;
      if (a && !a.paused) {
        tRef.current = a.currentTime;
        setT(a.currentTime);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const seek = useCallback((time: number) => {
    const v = Math.max(0, Math.min(dur - 0.05, time));
    tRef.current = v; setT(v);
    if (audio.current) audio.current.currentTime = v;
  }, [dur]);

  const toggle = () => {
    const a = audio.current; if (!a) return;
    if (a.paused) { a.play().then(() => setPlaying(true)).catch(() => {}); }
    else { a.pause(); setPlaying(false); }
  };

  // keyboard: space toggles when the player is focused
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'ArrowRight') seek(tRef.current + 2);
    if (e.key === 'ArrowLeft') seek(tRef.current - 2);
  };

  // draw the scope
  useEffect(() => {
    const c = scope.current;
    if (!c || !clip) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = c.getBoundingClientRect();
    if (c.width !== Math.round(rect.width * dpr)) { c.width = Math.round(rect.width * dpr); c.height = Math.round(rect.height * dpr); }
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    const t0 = t - WINDOW * LEAD;
    const X = (time: number) => ((time - t0) / WINDOW) * W;
    const specH = H * 0.24, phonY = specH + 4 * dpr, phonH = 16 * dpr, wordY = phonY + phonH + 4 * dpr, wordH = 18 * dpr;
    const traceTop = wordY + wordH + 10 * dpr, traceH = H - traceTop - 6 * dpr;

    // silences
    ctx.fillStyle = 'rgba(255,255,255,0.035)';
    for (const [st, d] of clip.silences) {
      if (st + d < t0 || st > t0 + WINDOW) continue;
      ctx.fillRect(X(st), 0, X(st + d) - X(st), H);
    }
    // spectrogram slice
    const img = spec.current;
    if (img) {
      const pxPerSec = img.width / dur;
      const sx = t0 * pxPerSec, sw = WINDOW * pxPerSec;
      const clipL = Math.max(0, sx), clipR = Math.min(img.width, sx + sw);
      if (clipR > clipL) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, clipL, 0, clipR - clipL, img.height, ((clipL - sx) / sw) * W, 0, ((clipR - clipL) / sw) * W, specH);
      }
    }
    // phonemes
    ctx.font = `${10.5 * dpr}px ui-monospace, monospace`;
    ctx.textBaseline = 'middle';
    for (const [p, st, d] of clip.phonemes) {
      if (st + d < t0 || st > t0 + WINDOW) continue;
      const x0 = X(st), x1 = X(st + d);
      const col = PHON_COLORS[phonClass(p)];
      const active = t >= st && t < st + d;
      ctx.fillStyle = col + (active ? 'ff' : '55');
      ctx.fillRect(x0 + 0.5 * dpr, phonY, Math.max(1, x1 - x0 - dpr), phonH);
      if (x1 - x0 > 14 * dpr) {
        ctx.fillStyle = active ? '#0b0a1a' : '#e9e5f7';
        ctx.textAlign = 'center';
        ctx.fillText(p, (x0 + x1) / 2, phonY + phonH / 2 + 0.5);
      }
    }
    // words
    ctx.font = `500 ${12 * dpr}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    for (const [w, st, d] of clip.words) {
      if (st + d < t0 || st > t0 + WINDOW) continue;
      const active = t >= st && t < st + d;
      ctx.fillStyle = active ? '#ffffff' : 'rgba(233,229,247,0.55)';
      ctx.fillText(w, X(st) + 2 * dpr, wordY + wordH / 2);
      ctx.strokeStyle = active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = dpr;
      ctx.beginPath(); ctx.moveTo(X(st), phonY); ctx.lineTo(X(st), H); ctx.stroke();
    }
    // traces
    const rowH = traceH / sites.length;
    sites.forEach((s, k) => {
      const yMid = traceTop + rowH * (k + 0.5);
      ctx.strokeStyle = TRACE_SITES[k].color;
      ctx.globalAlpha = 0.95;
      ctx.lineWidth = 1.3 * dpr;
      ctx.beginPath();
      const i0 = Math.max(0, Math.floor(t0 * clip.fs)), i1 = Math.min(clip.n - 1, Math.ceil((t0 + WINDOW) * clip.fs));
      for (let i = i0; i <= i1; i++) {
        const x = X(i / clip.fs);
        const v = clip.mag[s * clip.n + i];
        const y = yMid - v * rowH * 0.32;
        if (i === i0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(201,197,216,0.55)';
      ctx.font = `${9.5 * dpr}px ui-monospace, monospace`;
      ctx.fillText(TRACE_SITES[k].name, 6 * dpr, yMid - rowH * 0.3);
    });
    // playhead
    const px = X(t);
    const grd = ctx.createLinearGradient(px - 40 * dpr, 0, px, 0);
    grd.addColorStop(0, 'rgba(196,181,253,0)'); grd.addColorStop(1, 'rgba(196,181,253,0.12)');
    ctx.fillStyle = grd; ctx.fillRect(px - 40 * dpr, 0, 40 * dpr, H);
    ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
  }, [clip, t, sites, specReady, dur]);

  // sensor values at t for the topomap
  const topoValues = useMemo(() => {
    if (!clip) return null;
    const arr = mode === 'mag' ? clip.mag : clip.grad;
    const out = new Float32Array(clip.nsens);
    // average over ±60 ms to steady the map
    const idx = t * clip.fs;
    for (let s = 0; s < clip.nsens; s++) {
      out[s] = (sampleAt(arr, clip.n, s, idx - 3) + sampleAt(arr, clip.n, s, idx) + sampleAt(arr, clip.n, s, idx + 3)) / 3;
    }
    return out;
  }, [clip, t, mode]);

  const wi = clip ? clip.words.findIndex(([, st, d]) => t >= st && t < st + d + 0.12) : -1;
  const lastWord = clip ? clip.words.reduce((acc, w, i) => (w[1] <= t ? i : acc), -1) : -1;
  const curW = wi >= 0 ? wi : lastWord;
  const curPh = clip && curW >= 0 ? clip.phonemes.filter(([, st]) => st >= clip.words[curW][1] - 1e-3 && st < clip.words[curW][1] + clip.words[curW][2] - 1e-3) : [];
  const phonNow = clip?.phonemes.find(([, st, d]) => t >= st && t < st + d);

  // scrolling sentence: show ~14 words around the current one
  const lineWords = clip ? clip.words.slice(Math.max(0, curW - 7), Math.max(0, curW - 7) + 15) : [];
  const lineStart = Math.max(0, curW - 7);

  if (err) return <div className="ds-panel" style={{ padding: '2rem' }}>Could not load the recording excerpt.</div>;

  return (
    <div className="ds-panel" tabIndex={0} onKeyDown={onKey} style={{ outline: 'none' }} aria-label="Interactive MEG player">
      <audio ref={audio} src={assetPath(`${dir}/clip.m4a`)} preload="auto" onEnded={() => { setPlaying(false); seek(0); }} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
      <div className="ds-glow" style={{ width: 380, height: 380, background: '#5b21b6', top: -160, right: -80, opacity: 0.35 }} />
      <div className="ds-glow" style={{ width: 300, height: 300, background: '#9f1239', bottom: -160, left: -60, opacity: 0.22 }} />

      {/* header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.3rem', borderBottom: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          style={{
            width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center',
            background: playing ? 'rgba(196,181,253,0.16)' : '#c4b5fd', color: playing ? '#fff' : '#0b0a1a',
            boxShadow: playing ? 'none' : '0 0 0 6px rgba(196,181,253,0.15)', transition: 'all 0.2s ease', flexShrink: 0,
          }}
        >
          <span style={{ width: 18, height: 18, display: 'block', marginLeft: playing ? 0 : 2 }}>{playing ? Icon.pause : Icon.play}</span>
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{title ?? 'Watch the brain listen'}</div>
          <div className="ds-label" style={{ marginTop: 3 }}>{clip?.session ?? 'loading…'} · {t.toFixed(1)}s / {dur.toFixed(1)}s</div>
        </div>
        <Seg value={mode} onChange={setMode} ariaLabel="Map type" options={[{ v: 'grad', label: 'Power (gradiometers)' }, { v: 'mag', label: 'Field (magnetometers)' }]} />
      </div>

      {/* transcript */}
      <div style={{ position: 'relative', padding: '1.4rem 1.3rem 0.4rem', minHeight: 112 }}>
        <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 'clamp(22px, 3.2vw, 32px)', lineHeight: 1.3, color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
          {lineWords.map(([w], i) => {
            const gi = lineStart + i;
            const on = gi === wi;
            const past = gi < curW || (gi === curW && wi < 0);
            return (
              <span key={gi} onClick={() => seek(clip!.words[gi][1])} style={{ cursor: 'pointer', color: on ? '#fff' : past ? 'rgba(255,255,255,0.62)' : undefined, transition: 'color 0.15s ease', textShadow: on ? '0 0 24px rgba(196,181,253,0.8)' : 'none' }}>
                {w}{' '}
              </span>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.6rem', minHeight: 28, flexWrap: 'wrap' }}>
          {curPh.map(([p, st, d], i) => {
            const active = phonNow && phonNow[1] === st;
            const col = PHON_COLORS[phonClass(p)];
            return (
              <span key={i} title={ARPABET[p] ? `/${ARPABET[p][0]}/ as in “${ARPABET[p][1]}”` : p} className="ds-chip" style={{ background: active ? col : 'transparent', color: active ? '#0b0a1a' : col, border: `1px solid ${col}66`, transition: 'all 0.1s ease' }}>
                {p}{d > 0 ? '' : ''}
              </span>
            );
          })}
        </div>
      </div>

      {/* scope + map */}
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '1rem', padding: '0.4rem 1.3rem 1.2rem' }} className="ds-player-grid">
        <canvas
          ref={scope}
          style={{ width: '100%', height: 360, display: 'block', cursor: 'ew-resize' }}
          onPointerDown={e => {
            const r = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();
            const x0 = e.clientX, tStart = tRef.current;
            const move = (ev: PointerEvent) => seek(tStart - ((ev.clientX - x0) / r.width) * WINDOW);
            const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
            window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
          }}
          aria-label="Scrolling view of the audio spectrogram, phonemes, words and eight MEG sensor traces"
          role="img"
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', width: 230 }} className="ds-player-map">
          {clip && (
            <Topomap
              xy={clip.layout.xy}
              values={topoValues}
              lo={mode === 'mag' ? -2.6 : 0.6}
              hi={mode === 'mag' ? 2.6 : 3.2}
              lut={mode === 'mag' ? LUT_DIVERGING_DARK : LUT_POWER_DARK}
              size={220}
              highlight={sites}
              highlightColors={TRACE_SITES.map(s => s.color)}
            />
          )}
          <ColorBar lut={mode === 'mag' ? LUT_DIVERGING_DARK : LUT_POWER_DARK} lo={mode === 'mag' ? '−' : 'low'} hi={mode === 'mag' ? '+' : 'high'} unit={mode === 'mag' ? 'field (z)' : '|∇B| (z)'} />
          <div className="ds-label" style={{ textAlign: 'center', lineHeight: 1.5, textTransform: 'none', letterSpacing: 0 }}>
            Top-down view, nose up.<br />Coloured dots = traces on the left.
          </div>
        </div>
      </div>

      {/* overview / seek bar */}
      <div style={{ position: 'relative', padding: '0 1.3rem 1.3rem' }}>
        <div
          style={{ position: 'relative', height: 34, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', background: '#12102a' }}
          onPointerDown={e => {
            const r = e.currentTarget.getBoundingClientRect();
            const set = (x: number) => seek(((x - r.left) / r.width) * dur);
            set(e.clientX);
            const move = (ev: PointerEvent) => set(ev.clientX);
            const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
            window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
          }}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(dur)}
          aria-valuenow={Math.round(t)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(`${dir}/clip-spec.png`)} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill', opacity: 0.8 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(t / dur) * 100}%`, background: 'rgba(196,181,253,0.18)', borderRight: '2px solid #c4b5fd' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {(['vowel', 'plosive', 'nasal', 'fricative', 'affricate', 'approximant'] as const).map(c => (
              <span key={c} className="ds-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textTransform: 'none', letterSpacing: 0 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: PHON_COLORS[c] }} />{c}
              </span>
            ))}
          </div>
          <span className="ds-label" style={{ textTransform: 'none', letterSpacing: 0 }}>Drag the scope to scrub · <span className="ds-kbd">space</span> play/pause</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .ds-player-grid { grid-template-columns: 1fr !important; }
          .ds-player-map { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
