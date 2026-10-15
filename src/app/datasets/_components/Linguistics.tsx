'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ARPABET, fetchJSON, phonClass, PHON_COLORS_LIGHT, fmt } from '../_lib/meg';
import { useInView } from './ui';

interface Stats {
  libribrain: { words: number; vocab: number; top: [string, number][]; zipf: [number, number][]; phon: Record<string, number> };
}

const VOWELS: [string, number, number][] = [
  ['iy', 0.04, 0.04], ['ih', 0.17, 0.18], ['ey', 0.3, 0.32], ['eh', 0.14, 0.6], ['ae', 0.22, 0.84], ['ay', 0.42, 0.84],
  ['er', 0.5, 0.4], ['ah', 0.6, 0.62], ['oy', 0.73, 0.48], ['ow', 0.76, 0.27], ['uh', 0.8, 0.14], ['uw', 0.96, 0.04],
  ['ao', 0.96, 0.6], ['aw', 0.8, 0.84], ['aa', 0.96, 0.98],
];
const PLACES = ['Bilabial', 'Labio-dental', 'Dental', 'Alveolar', 'Post-alveolar', 'Palatal', 'Velar', 'Glottal'];
const MANNERS = ['Plosive', 'Nasal', 'Affricate', 'Fricative', 'Approximant', 'Lateral'];
const CONS: [string, number, number][] = [
  ['p', 0, 0], ['b', 0, 0], ['t', 3, 0], ['d', 3, 0], ['k', 6, 0], ['g', 6, 0],
  ['m', 0, 1], ['n', 3, 1], ['ng', 6, 1],
  ['ch', 4, 2], ['jh', 4, 2],
  ['f', 1, 3], ['v', 1, 3], ['th', 2, 3], ['dh', 2, 3], ['s', 3, 3], ['z', 3, 3], ['sh', 4, 3], ['zh', 4, 3], ['hh', 7, 3],
  ['w', 0, 4], ['r', 3, 4], ['y', 5, 4],
  ['l', 3, 5],
];

/** Vowel trapezoid + consonant table, every phoneme sized by how often it occurs in LibriBrain. */
export function PhonemeInventory() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>();
  useEffect(() => { fetchJSON<Stats>('/datasets/stats.json').then(setStats); }, []);
  const phon = stats?.libribrain.phon ?? {};
  const total = Object.entries(phon).filter(([p]) => ARPABET[p]).reduce((a, [, v]) => a + v, 0) || 1;
  const maxC = Math.max(1, ...Object.entries(phon).filter(([p]) => ARPABET[p]).map(([, v]) => v));
  const size = (p: string) => 16 + 30 * Math.sqrt((phon[p] ?? 0) / maxC);
  const ranked = Object.entries(phon).filter(([p]) => ARPABET[p]).sort((a, b) => b[1] - a[1]);
  const rank = (p: string) => ranked.findIndex(([q]) => q === p) + 1;

  const info = hover && ARPABET[hover] ? (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
        <span style={{ fontFamily: 'var(--ds-mono)', fontSize: 30, fontWeight: 700, color: PHON_COLORS_LIGHT[phonClass(hover)] }}>{hover}</span>
        <span style={{ fontFamily: 'var(--ds-serif)', fontSize: 28, color: 'var(--ds-ink)' }}>/{ARPABET[hover][0]}/</span>
      </div>
      <div className="ds-p-sm" style={{ margin: '0.3rem 0 0' }}>as in “<b style={{ color: 'var(--ds-ink)' }}>{ARPABET[hover][1]}</b>” · {phonClass(hover)}</div>
      <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 34, color: 'var(--ds-ink)', marginTop: '0.6rem', lineHeight: 1 }}>{fmt(phon[hover] ?? 0)}</div>
      <div className="ds-label" style={{ marginTop: 4 }}>tokens · {(((phon[hover] ?? 0) / total) * 100).toFixed(2)}% · rank {rank(hover)} of {ranked.length}</div>
    </div>
  ) : (
    <div>
      <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 34, color: 'var(--ds-ink)', lineHeight: 1 }}>{fmt(total)}</div>
      <div className="ds-label" style={{ marginTop: 6 }}>phoneme tokens across books 1–7</div>
      <p className="ds-p-sm" style={{ marginTop: '0.8rem' }}>Hover over a phoneme. Most frequent: {ranked.slice(0, 4).map(([p]) => p).join(', ')}. Rarest: {ranked.slice(-3).map(([p]) => p).join(', ')}. That long tail is why the 2025 phoneme track was scored with <i>macro</i>-F1.</p>
    </div>
  );

  const bubble = (p: string, cx: number | string, cy: number | string, key: string) => {
    const s = size(p);
    const col = PHON_COLORS_LIGHT[phonClass(p)];
    const on = hover === p;
    return (
      <div key={key} onPointerEnter={() => setHover(p)} onPointerLeave={() => setHover(null)}
        style={{
          position: 'absolute', left: cx, top: cy, width: s, height: s, transform: `translate(-50%,-50%) scale(${inView ? (on ? 1.15 : 1) : 0.2})`,
          borderRadius: '50%', background: on ? col : `${col}22`, border: `1.5px solid ${col}`, color: on ? '#fff' : col,
          display: 'grid', placeItems: 'center', fontFamily: 'var(--ds-mono)', fontWeight: 700, fontSize: Math.max(10, s * 0.32), cursor: 'default',
          transition: 'transform 0.5s cubic-bezier(.3,1.4,.4,1), background 0.15s', opacity: inView ? 1 : 0, zIndex: on ? 2 : 1,
        }}>{p}</div>
    );
  };

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.5fr) minmax(180px, 0.7fr)', gap: '1.5rem', alignItems: 'start' }} className="ds-phon-grid">
      <div>
        <div className="ds-label" style={{ marginBottom: 8 }}>Vowels <span style={{ textTransform: 'none', letterSpacing: 0 }}>· front ← → back</span></div>
        <div style={{ position: 'relative', aspectRatio: '1.15 / 1' }}>
          <svg viewBox="0 0 100 87" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
            <path d="M6 5 L96 5 L96 83 L34 83 Z" fill="var(--ds-paper)" stroke="var(--ds-line)" strokeWidth="0.8" />
          </svg>
          {VOWELS.map(([p, x, y]) => bubble(p, `${8 + x * 86}%`, `${8 + y * 84}%`, p))}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div className="ds-label" style={{ marginBottom: 8 }}>Consonants <span style={{ textTransform: 'none', letterSpacing: 0 }}>· place × manner</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: `76px repeat(${PLACES.length}, minmax(40px, 1fr))`, minWidth: 440 }}>
          <div />
          {PLACES.map(pl => <div key={pl} style={{ fontSize: 9.5, color: 'var(--ds-muted)', textAlign: 'center', padding: '0 0 6px', lineHeight: 1.15 }}>{pl}</div>)}
          {MANNERS.map((mn, mi) => (
            <React.Fragment key={mn}>
              <div style={{ fontSize: 11, color: 'var(--ds-muted)', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--ds-line)', height: 58 }}>{mn}</div>
              {PLACES.map((_, pi) => {
                const cell = CONS.filter(([, x, y]) => x === pi && y === mi);
                return (
                  <div key={pi} style={{ position: 'relative', borderTop: '1px solid var(--ds-line)', borderLeft: '1px solid var(--ds-line)', height: 58 }}>
                    {cell.map(([p], k) => bubble(p, cell.length === 1 ? '50%' : k === 0 ? '30%' : '70%', cell.length === 1 ? '50%' : k === 0 ? '36%' : '64%', p))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="ds-card" style={{ minHeight: 210 }}>{info}</div>
      <style>{`@media (max-width: 980px) { .ds-phon-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

/** Rank–frequency (Zipf) plot of LibriBrain's words with vocabulary-size cut-offs. */
export function ZipfExplorer() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cut, setCut] = useState(250);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => { fetchJSON<Stats>('/datasets/stats.json').then(setStats); }, []);
  const lb = stats?.libribrain;
  const coverage = useMemo(() => {
    if (!lb) return 0;
    return lb.top.slice(0, cut).reduce((a, [, v]) => a + v, 0) / lb.words;
  }, [lb, cut]);
  if (!lb) return <div style={{ minHeight: 320 }} />;
  const W = 560, H = 300, L = 52, R = 14, T = 12, B = 40;
  const maxR = Math.log10(lb.vocab), maxC = Math.log10(lb.zipf[0][1]);
  const X = (r: number) => Math.round((L + (Math.log10(r) / maxR) * (W - L - R)) * 100) / 100;
  const Y = (c: number) => Math.round((T + (1 - Math.log10(c) / maxC) * (H - T - B)) * 100) / 100;
  const d = lb.zipf.map(([r, c], i) => `${i ? 'L' : 'M'}${X(r).toFixed(1)},${Y(c).toFixed(1)}`).join('');
  const hw = hover !== null ? lb.top[hover] : null;
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="ds-chart" style={{ width: '100%', height: 'auto' }}
          onPointerMove={e => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * W;
            const rank = Math.round(Math.pow(10, ((px - L) / (W - L - R)) * maxR));
            setHover(rank >= 1 && rank <= lb.top.length ? rank - 1 : null);
          }}
          onPointerLeave={() => setHover(null)}
          role="img" aria-label="Word rank versus frequency on log-log axes"
        >
          <rect x={X(1)} y={T} width={X(cut) - X(1)} height={H - T - B} fill="#7c3aed" opacity={0.07} />
          <line x1={X(cut)} x2={X(cut)} y1={T} y2={H - B} stroke="#7c3aed" strokeDasharray="3 3" />
          <text x={X(cut) + 5} y={T + 12} fontSize="11" fill="#7c3aed" fontFamily="var(--ds-mono)">top {cut}</text>
          {[1, 10, 100, 1000, 10000].map(r => <g key={r}><line className="grid" x1={X(r)} x2={X(r)} y1={T} y2={H - B} /><text className="ax" x={X(r)} y={H - B + 16} textAnchor="middle">{r.toLocaleString('en-GB')}</text></g>)}
          {[1, 10, 100, 1000, 10000].map(c => <g key={c}><line className="grid" x1={L} x2={W - R} y1={Y(c)} y2={Y(c)} /><text className="ax" x={L - 6} y={Y(c) + 4} textAnchor="end">{c >= 1000 ? `${c / 1000}k` : c}</text></g>)}
          <text className="ax-title" x={(L + W - R) / 2} y={H - 4} textAnchor="middle">WORD RANK</text>
          <text className="ax-title" x={13} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 13 ${(T + H - B) / 2})`}>OCCURRENCES</text>
          <path d={d} fill="none" stroke="#0b0a1a" strokeWidth={2} />
          {hw && hover !== null && (
            <g>
              <circle cx={X(hover + 1)} cy={Y(hw[1])} r={5} fill="#e0314b" />
              <text x={X(hover + 1) + 8} y={Y(hw[1]) - 8} fontSize="13" fontWeight={700} fill="#e0314b">“{hw[0]}” · #{hover + 1} · {fmt(hw[1])}×</text>
            </g>
          )}
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
        <span className="ds-label">Vocabulary</span>
        <input type="range" className="ds-range" min={10} max={300} step={10} value={cut} onChange={e => setCut(+e.target.value)} style={{ flex: 1, minWidth: 160 }} aria-label="Vocabulary size" />
        <span style={{ fontSize: 14, color: 'var(--ds-ink)', minWidth: 230 }}>
          the top <b>{cut}</b> words cover <b style={{ color: 'var(--ds-violet)' }}>{(coverage * 100).toFixed(1)}%</b> of all {fmt(lb.words)} words
        </span>
      </div>
    </div>
  );
}
