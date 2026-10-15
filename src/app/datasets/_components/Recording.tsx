'use client';

import React, { useState } from 'react';
import { assetPath } from '../../../lib/assetPath';

const STEPS = [
  { k: 'Acquire', t: 'Raw recording', d: 'A MEGIN TRIUX™ neo samples 306 SQUID sensors at 1 kHz with an online 0.01–330 Hz band-pass, inside a magnetically shielded room. Five head-position coils are tracked continuously.', img: 0, spec: '306 ch × 1000 Hz' },
  { k: 'Clean', t: 'Bad channels + head motion + SSS', d: 'Bad channels are detected and interpolated from their neighbours. Head position is extracted from the HPI coils and corrected for. Signal Space Separation (Maxwell filtering) suppresses magnetic interference from outside the helmet.', img: 0, spec: 'interpolated · motion-corrected' },
  { k: 'Notch', t: 'Mains removal', d: 'Notch filters at 50 Hz and its 100 Hz harmonic remove UK mains noise. That is the spike visible in the raw spectrum.', img: 1, spec: '−50 Hz, −100 Hz' },
  { k: 'Band-pass', t: '0.1–125 Hz', d: 'A zero-phase, two-pass Butterworth filter removes slow drifts and anti-aliases for downsampling. The 125 Hz edge keeps high-gamma activity (70–125 Hz), at least in principle.', img: 2, spec: '0.1–125 Hz, zero-phase' },
  { k: 'Downsample', t: '250 Hz tensors', d: 'Data are downsampled to 250 Hz (one sample every 4 ms) and serialised as float32 HDF5, one file per session. The result is a 306 × T matrix that drops straight into PyTorch.', img: 3, spec: '306 ch × 250 Hz · HDF5' },
];

/** Step through the minimal preprocessing pipeline, with the PSD after each stage (Fig. 5 of Özdogan et al. 2025). */
export function PipelineStepper() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  return (
    <div className="ds-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, borderBottom: '1px solid var(--ds-line)' }}>
        {STEPS.map((st, k) => (
          <button key={st.k} onClick={() => setI(k)} aria-pressed={i === k}
            style={{
              border: 'none', background: i === k ? 'var(--ds-violet-ll)' : '#fff', cursor: 'pointer', padding: '0.85rem 0.3rem',
              borderRight: k < STEPS.length - 1 ? '1px solid var(--ds-line)' : 'none', position: 'relative',
              fontFamily: 'var(--ds-sans)', fontSize: 12.5, fontWeight: i === k ? 650 : 500, color: i === k ? 'var(--ds-violet-d)' : 'var(--ds-muted)',
            }}>
            <span style={{ fontFamily: 'var(--ds-mono)', fontSize: 10, display: 'block', opacity: 0.7 }}>{k + 1}</span>{st.k}
            {k <= i && <span style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: '100%', background: 'var(--ds-violet)' }} />}
          </button>
        ))}
      </div>
      <div style={{ padding: '1.3rem 1.4rem 1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
          <h3 className="ds-h3" style={{ margin: 0 }}>{s.t}</h3>
          <span className="ds-pill">{s.spec}</span>
        </div>
        <p className="ds-p-sm" style={{ margin: '0.6rem 0 1rem', minHeight: 72 }}>{s.d}</p>
        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--ds-line)', background: '#fff' }}>
          {[0, 1, 2, 3].map(k => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={k} src={assetPath(`/datasets/figures/lb-psd-${k}.webp`)} alt={k === s.img ? `Power spectral density of all channels after: ${s.t}` : ''}
              style={{ width: '100%', display: 'block', position: k === 0 ? 'relative' : 'absolute', inset: 0, opacity: k === s.img ? 1 : 0, transition: 'opacity 0.45s ease' }} />
          ))}
        </div>
        <div className="ds-note">Power spectral density of every channel (dB, x-axis in Hz) after each stage, from the paper&apos;s quality-control figure. Panel labels are the paper&apos;s.</div>
      </div>
    </div>
  );
}

/** Book 1 chapters and how the standard splits are drawn from them. */
export function SplitStrip({ variant = 'libribrain' }: { variant?: 'libribrain' | 'libribrain100' }) {
  const chapters = Array.from({ length: 14 }, (_, k) => k + 1);
  const role = (c: number) => {
    if (c === 11) return 'val';
    if (c === 12) return 'test';
    if (c >= 13) return variant === 'libribrain' ? 'holdout' : 'train';
    return 'train';
  };
  const col: Record<string, string> = { train: '#ede9fe', val: '#fde68a', test: '#fecaca', holdout: '#0b0a1a' };
  const txt: Record<string, string> = { train: '#5b21b6', val: '#854d0e', test: '#9f1239', holdout: '#fff' };
  const label: Record<string, string> = { train: 'train', val: 'validation', test: 'test', holdout: '2025 competition holdout' };
  return (
    <div>
      <div className="ds-label" style={{ marginBottom: 8 }}>A Study in Scarlet · chapters (sessions)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(0,1fr))', gap: 4 }}>
        {chapters.map(c => {
          const r = role(c);
          return (
            <div key={c} title={`Chapter ${c}: ${label[r]}`} style={{ background: col[r], color: txt[r], borderRadius: 6, padding: '0.7rem 0', textAlign: 'center', fontFamily: 'var(--ds-mono)', fontSize: 12, fontWeight: 600 }}>
              {c}
            </div>
          );
        })}
      </div>
      {variant === 'libribrain' && <div style={{ position: 'relative', height: 30, marginTop: 6 }}>
        <div style={{ position: 'absolute', left: `${(10 / 14) * 100}%`, right: 0, top: 4, height: 10, borderLeft: '1.5px solid var(--ds-ink)', borderRight: '1.5px solid var(--ds-ink)', borderBottom: '1.5px solid var(--ds-ink)', borderRadius: '0 0 4px 4px' }} />
        <div style={{ position: 'absolute', left: `${(10 / 14) * 100}%`, right: 0, top: 16, textAlign: 'center', fontSize: 11.5, color: 'var(--ds-ink)', fontWeight: 600 }}>recorded on a separate day</div>
      </div>}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
        {(variant === 'libribrain' ? ['train', 'val', 'test', 'holdout'] : ['train', 'val', 'test']).map(r => (
          <span key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ds-muted)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: col[r], border: '1px solid rgba(0,0,0,0.06)' }} />{label[r]}
          </span>
        ))}
      </div>
    </div>
  );
}
