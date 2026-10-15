'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchJSON, loadClip, LUT_POWER_DARK, type Clip, type Evoked } from '../_lib/meg';
import Topomap, { ColorBar } from './Topomap';
import { Icon, Seg, useInView } from './ui';

type Tab = 'word' | 'track';

/**
 * Two analyses computed for this page from one 18-minute session (sub-0, A Study in Scarlet ch. 1):
 *  - the average response to ~2,700 word onsets, and
 *  - the lagged correlation between the speech envelope and every sensor.
 */
export default function EvokedExplorer({ dir }: { dir: string }) {
  const [ev, setEv] = useState<Evoked | null>(null);
  const [clip, setClip] = useState<Clip | null>(null);
  const [tab, setTab] = useState<Tab>('word');
  const [i, setI] = useState(40); // sample index
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });

  useEffect(() => { fetchJSON<Evoked>(`${dir}/evoked.json`).then(setEv); loadClip(dir).then(setClip); }, [dir]);

  const series = useMemo(() => {
    if (!ev) return null;
    if (tab === 'word') {
      return {
        n: ev.gfp.length, t0: ev.t0, fs: ev.fs,
        curve: ev.gfp.map(v => v / 1000), a: ev.gfp_h1.map(v => v / 1000), b: ev.gfp_h2.map(v => v / 1000),
        maps: ev.grad.map(r => r.map(v => v / 1000)),
      };
    }
    return {
      n: ev.xcorr_mean.length, t0: ev.lag0, fs: ev.fs,
      curve: ev.xcorr_mean.map(v => v / 10000), a: null, b: null,
      maps: ev.xcorr.map(r => r.map(v => v / 10000)),
    };
  }, [ev, tab]);

  // animate the cursor while visible
  const last = useRef(0);
  useEffect(() => {
    if (!auto || !inView || !series) return;
    let raf = 0;
    const loop = (now: number) => {
      if (now - last.current > 45) {
        last.current = now;
        setI(v => (v + 1) % series.n);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [auto, inView, series]);

  const peak = useMemo(() => {
    if (!series) return 0;
    const start = Math.round((0.05 - series.t0) * series.fs);
    let best = start;
    for (let k = start; k < series.n; k++) if (series.curve[k] > series.curve[best]) best = k;
    return best;
  }, [series]);

  if (!series || !clip || !ev) return <div ref={ref} className="ds-panel" style={{ minHeight: 420 }} />;

  const ms = Math.round((series.t0 + i / series.fs) * 1000);
  const peakMs = Math.round((series.t0 + peak / series.fs) * 1000);
  const vals = series.maps.map(r => r[Math.min(i, r.length - 1)]);
  const maxMap = Math.max(...series.maps.flat());

  // chart geometry
  const W = 560, H = 220, L = 44, R = 12, T = 14, B = 34;
  const ymax = Math.max(...series.curve, ...(series.a ?? []), ...(series.b ?? [])) * 1.12;
  const ymin = tab === 'word' ? Math.min(...series.curve) * 0.9 : 0;
  const x = (k: number) => L + (k / (series.n - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - ymin) / (ymax - ymin)) * (H - T - B);
  const path = (arr: number[]) => arr.map((v, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const ticks = tab === 'word' ? [-200, 0, 200, 400, 600, 800] : [-200, 0, 200, 400, 600];
  const xAt = (msv: number) => x((msv / 1000 - series.t0) * series.fs);

  return (
    <div ref={ref} className="ds-panel" style={{ padding: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}>
      <div className="ds-glow" style={{ width: 340, height: 340, background: '#6d28d9', top: -140, left: '30%', opacity: 0.3 }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.2rem' }}>
        <Seg value={tab} onChange={v => { setTab(v); setI(v === 'word' ? 40 : 30); }} ariaLabel="Analysis" options={[{ v: 'word', label: 'Response to a word' }, { v: 'track', label: 'Tracking the speech envelope' }]} />
        <button className="ds-btn ds-btn-dark" onClick={() => setAuto(a => !a)} style={{ padding: '0.45rem 0.9rem' }}>
          <span style={{ width: 13, height: 13, display: 'block' }}>{auto ? Icon.pause : Icon.play}</span>{auto ? 'Pause' : 'Animate'}
        </button>
      </div>

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', gap: 'clamp(1rem, 3vw, 2.2rem)', alignItems: 'center' }} className="ds-evk-grid">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 44, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {ms > 0 ? '+' : ''}{ms}<span style={{ fontSize: 18, color: '#8a85a0', marginLeft: 4 }}>ms</span>
          </div>
          <div className="ds-label">{tab === 'word' ? 'after word onset' : 'brain lags audio by'}</div>
          <Topomap xy={clip.layout.xy} values={vals} lo={0} hi={maxMap * 0.92} lut={LUT_POWER_DARK} size={250} />
          <ColorBar lut={LUT_POWER_DARK} lo="0" hi={tab === 'word' ? 'max' : `r=${(maxMap).toFixed(2)}`} unit={tab === 'word' ? 'evoked |∇B|' : '|corr|'} />
        </div>
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="ds-chart" style={{ width: '100%', height: 'auto', touchAction: 'none', cursor: 'ew-resize' }}
            onPointerDown={e => {
              setAuto(false);
              const svg = e.currentTarget; const r = svg.getBoundingClientRect();
              const set = (cx: number) => {
                const px = ((cx - r.left) / r.width) * W;
                setI(Math.max(0, Math.min(series.n - 1, Math.round(((px - L) / (W - L - R)) * (series.n - 1)))));
              };
              set(e.clientX);
              const mv = (ev2: PointerEvent) => set(ev2.clientX);
              const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
              window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
            }}
            role="img" aria-label={tab === 'word' ? 'Global field power of the word-onset response over time' : 'Mean correlation between speech envelope and MEG over lag'}
          >
            {ticks.map(tk => (
              <g key={tk}>
                <line className="grid" x1={xAt(tk)} x2={xAt(tk)} y1={T} y2={H - B} />
                <text className="ax" x={xAt(tk)} y={H - B + 16} textAnchor="middle">{tk}</text>
              </g>
            ))}
            <text className="ax-title" x={(L + W - R) / 2} y={H - 2} textAnchor="middle">{tab === 'word' ? 'Time from word onset (ms)' : 'Lag of brain relative to audio (ms)'}</text>
            <text className="ax-title" x={12} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(T + H - B) / 2})`}>{tab === 'word' ? 'Mean |∇B|' : 'Mean |r|'}</text>
            <line x1={xAt(0)} x2={xAt(0)} y1={T} y2={H - B} stroke="rgba(255,255,255,0.35)" strokeDasharray="3 3" />
            {series.a && <path d={path(series.a)} fill="none" stroke="#f472b6" strokeOpacity={0.45} strokeWidth={1.2} />}
            {series.b && <path d={path(series.b)} fill="none" stroke="#67e8f9" strokeOpacity={0.45} strokeWidth={1.2} />}
            <path d={`${path(series.curve)}L${x(series.n - 1)},${H - B}L${x(0)},${H - B}Z`} fill="url(#evkfill)" />
            <path d={path(series.curve)} fill="none" stroke="#c4b5fd" strokeWidth={2.2} />
            <defs>
              <linearGradient id="evkfill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7c3aed" stopOpacity="0.45" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0" /></linearGradient>
            </defs>
            <circle cx={x(peak)} cy={y(series.curve[peak])} r={4} fill="#fb7185" />
            <text x={x(peak) + 8} y={y(series.curve[peak]) - 6} fill="#fb7185" fontSize="11.5" fontFamily="var(--ds-mono)">peak {peakMs} ms</text>
            <line x1={x(i)} x2={x(i)} y1={T} y2={H - B} stroke="#fff" strokeWidth={1.5} />
            <circle cx={x(i)} cy={y(series.curve[i])} r={5} fill="#fff" stroke="#7c3aed" strokeWidth={2} />
          </svg>
          {tab === 'word' ? (
            <p className="ds-p-sm" style={{ color: '#a29db8', marginTop: '0.8rem' }}>
              Average gradiometer response to <b style={{ color: '#fff' }}>{ev.n_epochs.toLocaleString('en-GB')} word onsets</b> in a single 18-minute chapter.
              The response builds over bilateral temporal cortex (left and right edges of the map) and peaks about <b style={{ color: '#fff' }}>{peakMs} ms</b> after
              the word begins. The <span style={{ color: '#f472b6' }}>pink</span> and <span style={{ color: '#67e8f9' }}>cyan</span> lines are the same analysis on two random halves of the words.
              Both halves show the same peak, so it is signal, not noise.
            </p>
          ) : (
            <p className="ds-p-sm" style={{ color: '#a29db8', marginTop: '0.8rem' }}>
              Correlation between the loudness envelope of the narration and each sensor, as a function of lag. The brain follows the rhythm of speech, but
              late: the correlation peaks around <b style={{ color: '#fff' }}>{peakMs} ms</b>, again over auditory cortex. This conduction delay is why LibriBrain&apos;s
              event files keep the <i>original</i> audio timings, so models can learn the lag rather than having a fixed offset imposed on them.
            </p>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 760px) { .ds-evk-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
