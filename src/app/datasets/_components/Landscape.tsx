'use client';

import React, { useState } from 'react';
import { useInView } from './ui';

interface DS {
  key: string; name: string; cite: string; modality: 'MEG' | 'EEG'; lang: string; subj: number; hps: number; total: number; stimulus: string;
  /** hours/subject range (LibriBrain100 spans a deep subject and a broad cohort) */
  range?: [number, number]; era: 0 | 1 | 2;
  /** label placement relative to the bubble */
  lab?: 'l' | 'r' | 't' | 'b' | 'tl' | 'tr' | 'br' | 'bl';
}

// Breadth/depth figures from Table 1 of Özdogan et al. (2025) and Table 3 of Mantegna et al. (2026).
const DATA: DS[] = [
  { key: 'mous', lab: 'b', name: 'MOUS (listening)', cite: 'Schoffelen et al. 2019', modality: 'MEG', lang: 'Dutch', subj: 96, hps: 0.8, total: 81, stimulus: 'Spoken sentences', era: 0 },
  { key: 'masc', lab: 'b', name: 'MEG-MASC', cite: 'Gwilliams et al. 2023', modality: 'MEG', lang: 'English', subj: 27, hps: 1.0, total: 49, stimulus: 'MASC stories (synthetic voice)', era: 0 },
  { key: 'armeni', lab: 'r', name: 'Armeni et al.', cite: 'Armeni et al. 2022', modality: 'MEG', lang: 'English', subj: 3, hps: 10, total: 30, stimulus: 'LibriVox, Sherlock Book 3', era: 0 },
  { key: 'lpp', lab: 'tr', name: 'Le Petit Prince', cite: "d'Ascoli et al. 2025", modality: 'MEG', lang: 'French', subj: 58, hps: 1.6, total: 93, stimulus: 'Le Petit Prince', era: 0 },
  { key: 'brennan', lab: 'r', name: 'Brennan et al.', cite: 'Brennan 2023', modality: 'EEG', lang: 'English', subj: 49, hps: 0.2, total: 10.1, stimulus: 'Alice in Wonderland', era: 0 },
  { key: 'accou', lab: 'r', name: 'Accou et al.', cite: 'Accou et al. 2023', modality: 'EEG', lang: '', subj: 85, hps: 1.8, total: 150, stimulus: '', era: 0 },
  { key: 'nieuwland', lab: 'b', name: 'Nieuwland et al.', cite: 'Nieuwland et al. 2018', modality: 'EEG', lang: 'English', subj: 334, hps: 0.5, total: 171, stimulus: 'Hemingway short story', era: 0 },
  { key: 'broderick', lab: 'l', name: 'Broderick et al.', cite: 'Broderick et al. 2019', modality: 'EEG', lang: 'English', subj: 19, hps: 1.1, total: 20, stimulus: 'Subset of Nieuwland et al.', era: 0 },
  { key: 'lb', lab: 'r', name: 'LibriBrain', cite: 'Özdogan et al. 2025', modality: 'MEG', lang: 'English', subj: 1, hps: 52.3, total: 52.3, stimulus: 'LibriVox, Sherlock Books 1–7', era: 1 },
  { key: 'lb100', lab: 'r', name: 'LibriBrain100', cite: 'Mantegna et al. 2026', modality: 'MEG', lang: 'English', subj: 33, hps: 80.5, total: 104.2, stimulus: 'Sherlock 1–9, TIMIT, MOCHA-TIMIT, The Moth', range: [0.6, 80.5], era: 2 },
];

const r2 = (v: number) => Math.round(v * 100) / 100;

const STEPS = ['Before LibriBrain', '+ LibriBrain (2025)', '+ LibriBrain100 (2026)'];

/**
 * Breadth (subjects) vs depth (hours per subject) of public M/EEG speech-comprehension datasets.
 * Bubble area ∝ total hours.
 */
export default function Landscape({ initialStep = 2, maxStep = 2 }: { initialStep?: number; maxStep?: number }) {
  const [step, setStep] = useState(initialStep);
  const [hover, setHover] = useState<string | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>();
  const W = 640, H = 400, L = 56, R = 24, T = 20, B = 46;
  const X = (s: number) => r2(L + (Math.log10(s) / Math.log10(500)) * (W - L - R));
  const Y = (h: number) => r2(T + (1 - (Math.log10(h) + 1) / 3) * (H - T - B)); // 0.1 .. 100
  const rad = (tot: number) => r2(4 + Math.sqrt(tot) * 1.6);
  const shown = DATA.filter(d => d.era <= step);
  const hv = DATA.find(d => d.key === hover);
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div className="ds-seg" role="group" aria-label="Timeline">
          {STEPS.slice(0, maxStep + 1).map((s, i) => <button key={s} aria-pressed={step === i} onClick={() => setStep(i)}>{s}</button>)}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: 12.5, color: 'var(--ds-muted)' }}>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#c4b5fd' }} />MEG</span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #a9a5b8' }} />EEG</span>
          <span>bubble area ∝ total hours</span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="ds-chart" style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="img" aria-label="Scatter of datasets by number of subjects and hours per subject">
          <defs>
            <radialGradient id="lbglow"><stop offset="0" stopColor="#7c3aed" stopOpacity="0.35" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0" /></radialGradient>
          </defs>
          {[0.1, 1, 10, 100].map(h => <g key={h}><line className="grid" x1={L} x2={W - R} y1={Y(h)} y2={Y(h)} /><text className="ax" x={L - 8} y={Y(h) + 4} textAnchor="end">{h}</text></g>)}
          {[1, 3, 10, 30, 100, 300].map(s => <g key={s}><line className="grid" x1={X(s)} x2={X(s)} y1={T} y2={H - B} /><text className="ax" x={X(s)} y={H - B + 18} textAnchor="middle">{s}</text></g>)}
          <text className="ax-title" x={(L + W - R) / 2} y={H - 6} textAnchor="middle">BREADTH · NUMBER OF SUBJECTS</text>
          <text className="ax-title" x={14} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>DEPTH · HOURS PER SUBJECT</text>
          <text x={W - R - 4} y={T + 14} textAnchor="end" fontSize="11" fill="#a9a5b8" fontFamily="var(--ds-mono)">broad &amp; deep →</text>
          {shown.map(d => {
            const isLB = d.era > 0;
            const cx = X(d.subj), cy = Y(d.hps), r = rad(d.total);
            const dim = hover && hover !== d.key ? 0.35 : 1;
            return (
              <g key={d.key} onPointerEnter={() => setHover(d.key)} onPointerLeave={() => setHover(null)} style={{ cursor: 'pointer', opacity: inView ? dim : 0, transition: 'opacity 0.6s ease' }}>
                {isLB && <circle cx={cx} cy={cy} r={r * 2.4} fill="url(#lbglow)" />}
                {d.range && (
                  <g>
                    <line x1={cx} x2={cx} y1={Y(d.range[0])} y2={Y(d.range[1])} stroke="#7c3aed" strokeWidth={3} strokeLinecap="round" strokeDasharray="2 5" />
                    <circle cx={cx} cy={Y(0.74)} r={7} fill="#a855f7" stroke="#fff" strokeWidth={2} />
                    <text x={cx + 12} y={Y(0.74) + 4} fontSize="11" fill="#7c3aed" fontFamily="var(--ds-mono)">32 × ~44 min</text>
                  </g>
                )}
                <circle cx={cx} cy={cy} r={r}
                  fill={d.modality === 'MEG' ? (isLB ? '#7c3aed' : '#c4b5fd') : '#fff'}
                  fillOpacity={isLB ? 0.92 : d.modality === 'MEG' ? 0.75 : 0.6}
                  stroke={isLB ? '#5b21b6' : d.modality === 'MEG' ? '#8b5cf6' : '#a9a5b8'} strokeWidth={1.5}
                  style={{ transformOrigin: `${cx}px ${cy}px`, animation: isLB ? 'dsPulse 3.2s ease-in-out infinite' : undefined }} />
                {(() => {
                  const p = d.lab ?? 'r';
                  const dx = p.includes('l') ? -r - 5 : p.includes('r') ? r + 6 : 0;
                  const dy = p.includes('t') ? -r - 6 : p.includes('b') ? r + 13 : 4;
                  const anchor = p.includes('l') ? 'end' : p.includes('r') ? 'start' : 'middle';
                  return <text x={cx + dx} y={cy + dy} textAnchor={anchor} fontSize={isLB ? 13 : 11} fontWeight={isLB ? 700 : 500} fill={isLB ? '#0b0a1a' : '#77738a'}>{d.name}</text>;
                })()}
              </g>
            );
          })}
        </svg>
        {hv && (
          <div className="ds-tip" style={{ left: `${(X(hv.subj) / W) * 100}%`, top: `${(Y(hv.hps) / H) * 100 - 3}%`, whiteSpace: 'normal', width: 240 }}>
            <b>{hv.name}</b> <span className="m">{hv.cite}</span><br />
            <span className="m">{[hv.modality, hv.lang, hv.stimulus].filter(Boolean).join(' · ')}</span><br />
            {hv.subj} subjects · {hv.range ? `${hv.range[0]}–${hv.range[1]}` : hv.hps} h/subject · {hv.total} h total
          </div>
        )}
      </div>
    </div>
  );
}
