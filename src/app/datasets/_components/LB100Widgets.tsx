'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ARPABET, fetchJSON, fmt } from '../_lib/meg';
import { CORPUS_COLOR } from './Composition';
import { CodeBlock, useInView } from './ui';

interface CorpusStats { words: number; vocab: number; top: [string, number][]; phon: Record<string, number>; target: Record<string, number> }
interface Stats { corpora: Record<string, CorpusStats>; vocab50: string[] }

const CORPORA: { key: string; label: string; color: string }[] = [
  { key: 'Sherlock', label: 'Audiobooks', color: CORPUS_COLOR.sherlock },
  { key: 'TIMIT', label: 'TIMIT', color: CORPUS_COLOR.timit },
  { key: 'MOCHATIMIT', label: 'MOCHA-TIMIT', color: CORPUS_COLOR.mocha },
  { key: 'TheMoth', label: 'The Moth', color: CORPUS_COLOR.moth },
];

function useStats() {
  const [s, set] = useState<Stats | null>(null);
  useEffect(() => { fetchJSON<Stats>('/datasets/stats.json').then(set); }, []);
  return s;
}

/** Normalised phoneme frequency per corpus, log scale, sorted by TIMIT (cf. Fig. 9 of the paper). */
export function CorpusPhonemes() {
  const s = useStats();
  const [hover, setHover] = useState<string | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>();
  const data = useMemo(() => {
    if (!s) return null;
    const norm: Record<string, Record<string, number>> = {};
    for (const c of CORPORA) {
      const ph = s.corpora[c.key].phon;
      const tot = Object.entries(ph).filter(([p]) => ARPABET[p]).reduce((a, [, v]) => a + v, 0);
      norm[c.key] = Object.fromEntries(Object.entries(ph).filter(([p]) => ARPABET[p]).map(([p, v]) => [p, v / tot]));
    }
    const order = Object.keys(norm.TIMIT).sort((a, b) => norm.TIMIT[b] - norm.TIMIT[a]);
    return { norm, order };
  }, [s]);
  if (!data) return <div ref={ref} style={{ minHeight: 300 }} />;
  const W = 1000, H = 280, L = 40, B = 34, T = 10;
  const lo = Math.log10(0.0005), hi = Math.log10(0.15);
  const Y = (v: number) => T + (1 - (Math.log10(Math.max(v, 0.0005)) - lo) / (hi - lo)) * (H - T - B);
  const step = (W - L) / data.order.length;
  const bw = step / 5;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="ds-chart" style={{ width: '100%', height: 'auto' }} role="img" aria-label="Phoneme frequencies per corpus">
        {[0.001, 0.01, 0.1].map(t => <g key={t}><line className="grid" x1={L} x2={W} y1={Y(t)} y2={Y(t)} /><text className="ax" x={L - 6} y={Y(t) + 4} textAnchor="end">{t * 100}%</text></g>)}
        {data.order.map((p, i) => {
          const x0 = L + i * step + bw * 0.5;
          const on = hover === p;
          return (
            <g key={p} onPointerEnter={() => setHover(p)} onPointerLeave={() => setHover(null)}>
              <rect x={L + i * step} y={T} width={step} height={H - T - B} fill={on ? 'rgba(124,58,237,0.07)' : 'transparent'} />
              {CORPORA.map((c, k) => {
                const v = data.norm[c.key][p] ?? 0;
                return <rect key={c.key} x={x0 + k * bw} y={inView ? Y(v) : H - B} width={bw - 0.6} height={inView ? H - B - Y(v) : 0} fill={c.color} style={{ transition: `all 0.8s ${i * 15}ms cubic-bezier(.3,.7,.2,1)` }} />;
              })}
              <text x={L + i * step + step / 2} y={H - B + 14} textAnchor="middle" fontSize="10.5" fontFamily="var(--ds-mono)" fill={['g', 'y', 'sh', 'oy', 'zh'].includes(p) ? '#0b0a1a' : '#77738a'} fontWeight={['g', 'y', 'sh', 'oy', 'zh'].includes(p) ? 700 : 400}>{p}</text>
            </g>
          );
        })}
      </svg>
      {hover && (
        <div className="ds-card" style={{ position: 'absolute', top: 0, right: 0, padding: '0.7rem 0.9rem', fontSize: 13, pointerEvents: 'none' }}>
          <b style={{ fontFamily: 'var(--ds-mono)' }}>{hover}</b> /{ARPABET[hover]?.[0]}/ as in “{ARPABET[hover]?.[1]}”
          {CORPORA.map(c => <div key={c.key} style={{ color: c.color, fontWeight: 600 }}>{c.label}: {((data.norm[c.key][hover] ?? 0) * 100).toFixed(2)}%</div>)}
        </div>
      )}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
        {CORPORA.map(c => <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ds-muted)' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: c.color }} />{c.label}</span>)}
        <span style={{ fontSize: 12.5, color: 'var(--ds-muted)' }}>· sorted by TIMIT frequency · log scale · <b style={{ color: 'var(--ds-ink)' }}>bold</b> = rare phonemes highlighted in the paper</span>
      </div>
    </div>
  );
}

/** Per-corpus word statistics computed from the event files (sub-0). */
export function CorpusNumbers() {
  const s = useStats();
  if (!s) return null;
  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead><tr><th>Corpus</th><th className="num">Words heard</th><th className="num">Distinct words</th><th className="num">Phonemes</th><th className="num">50-word coverage</th></tr></thead>
        <tbody>
          {CORPORA.map(c => {
            const cs = s.corpora[c.key];
            const ph = Object.entries(cs.phon).filter(([p]) => ARPABET[p]).reduce((a, [, v]) => a + v, 0);
            const cov = Object.values(cs.target).reduce((a, v) => a + v, 0) / cs.words;
            return (
              <tr key={c.key}>
                <td><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: c.color, marginRight: 8 }} />{c.label}</td>
                <td className="num">{fmt(cs.words)}</td><td className="num">{fmt(cs.vocab)}</td><td className="num">{fmt(ph)}</td><td className="num">{(cov * 100).toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const EXAMPLES = ['i am good', 'i am not good', 'i think this is good', 'can i have that', 'do not do that', 'i will be there', 'is it time', 'she was good to me'];

/** The 50-word vocabulary: tiles sized by frequency; click to compose an utterance. */
export function VocabBuilder() {
  const s = useStats();
  const [sentence, setSentence] = useState<string[]>(['i', 'think', 'this', 'is', 'good']);
  const [hover, setHover] = useState<string | null>(null);
  if (!s) return <div style={{ minHeight: 320 }} />;
  const count = (w: string) => CORPORA.reduce((a, c) => a + (s.corpora[c.key].target[w] ?? 0), 0);
  const max = Math.max(...s.vocab50.map(count));
  const total = CORPORA.reduce((a, c) => a + s.corpora[c.key].words, 0);
  const covered = s.vocab50.reduce((a, w) => a + count(w), 0);
  return (
    <div>
      <div className="ds-card" style={{ background: 'var(--ds-ink)', borderColor: 'var(--ds-ink)', minHeight: 92, display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--ds-serif)', fontSize: 'clamp(24px, 3.5vw, 38px)', color: '#fff', flex: 1, minWidth: 200 }}>
          {sentence.length ? <>“{sentence.join(' ')}”</> : <span style={{ color: '#6f6a88' }}>click words to compose…</span>}
          <span style={{ display: 'inline-block', width: 2, height: '0.9em', background: '#c4b5fd', marginLeft: 4, verticalAlign: '-0.1em', animation: 'dsPulse 1s infinite' }} />
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="ds-btn ds-btn-dark" onClick={() => setSentence(x => x.slice(0, -1))}>⌫</button>
          <button className="ds-btn ds-btn-dark" onClick={() => setSentence([])}>clear</button>
          <button className="ds-btn ds-btn-dark" onClick={() => setSentence(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)].split(' '))}>example</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '1rem' }}>
        {s.vocab50.map(w => {
          const c = count(w);
          const f = Math.sqrt(c / max);
          return (
            <button key={w} onClick={() => setSentence(x => [...x, w])} onPointerEnter={() => setHover(w)} onPointerLeave={() => setHover(null)}
              style={{
                border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, cursor: 'pointer',
                padding: `${0.35 + f * 0.35}rem ${0.6 + f * 0.5}rem`, fontSize: 13 + f * 9, fontFamily: 'var(--ds-sans)', fontWeight: 600,
                background: `rgba(124,58,237,${0.06 + f * 0.5})`, color: f > 0.55 ? '#fff' : 'var(--ds-violet-d)', transition: 'transform 0.15s',
                transform: hover === w ? 'translateY(-2px)' : 'none',
              }}>
              {w}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.8rem', fontSize: 13.5, color: 'var(--ds-muted)', minHeight: 22 }}>
        <span>{hover ? <>“<b style={{ color: 'var(--ds-ink)' }}>{hover}</b>” occurs {fmt(count(hover))}× in sub-0&apos;s recordings {CORPORA.map(c => `· ${c.label} ${fmt(s.corpora[c.key].target[hover] ?? 0)}`).join(' ')}</> : 'Tile size ∝ how often the word occurs. Hover for counts.'}</span>
        <span>These 50 words make up <b style={{ color: 'var(--ds-violet)' }}>{((covered / total) * 100).toFixed(0)}%</b> of everything sub-0 heard.</span>
      </div>
    </div>
  );
}

/* ── Loader playground ──────────────────────────────────────────────── */

type Subj = 'deep' | 'broad' | 'all';
type Part = 'train' | 'validation' | 'test' | 'all';
const CORPUS_KEYS = ['sherlock', 'timit', 'mocha', 'podcasts'] as const;
type CK = typeof CORPUS_KEYS[number];
// Table 2 of Mantegna et al. (2026), hours.
const HOURS: Record<'deep' | 'broad', Partial<Record<CK, Record<Exclude<Part, 'all'>, number>>>> = {
  deep: { sherlock: { train: 67.3, validation: 0.4, test: 0.4 }, timit: { train: 4.9, validation: 0.2, test: 0.2 }, mocha: { train: 0.8, validation: 0.2, test: 0.2 }, podcasts: { train: 5.7, validation: 0.2, test: 0.2 } },
  broad: { sherlock: { train: 0, validation: 11.5, test: 12.2 } },
};
const C_LABEL: Record<CK, string> = { sherlock: 'Sherlock', timit: 'TIMIT', mocha: 'MOCHA-TIMIT', podcasts: 'The Moth' };
const C_COLOR: Record<CK, string> = { sherlock: CORPUS_COLOR.sherlock, timit: CORPUS_COLOR.timit, mocha: CORPUS_COLOR.mocha, podcasts: CORPUS_COLOR.moth };

export function LoaderPlayground() {
  const [subj, setSubj] = useState<Subj>('deep');
  const [corp, setCorp] = useState<CK[]>(['sherlock']);
  const [part, setPart] = useState<Part>('train');
  const parts: Exclude<Part, 'all'>[] = part === 'all' ? ['train', 'validation', 'test'] : [part];
  const groups: ('deep' | 'broad')[] = subj === 'all' ? ['deep', 'broad'] : [subj];
  // mirrors pnpl.datasets.libribrain100.selectors.validate_selector_combination
  const error = corp.length === 0 ? 'ValueError: corpus=[] is empty; pass \'all\' or specific names'
    : subj === 'broad' && corp.some(c => c !== 'sherlock')
      ? `ValueError: subjects='broad' only have Sherlock recordings. Requested corpus=${JSON.stringify(corp.filter(c => c !== 'sherlock'))} is not available for these subjects. Either include subject 0 in subjects or restrict to corpus='sherlock'.`
      : subj === 'broad' && part === 'train'
        ? "ValueError: subjects='broad' has no train partition by design: sub-1..32 contribute Sherlock1 ses-11 (validation) and ses-12 (test) only. For supervised fine-tuning, use partition='validation' as the training set and partition='test' for evaluation."
        : null;
  const bars = groups.flatMap(g => corp.map(c => ({ g, c, h: parts.reduce((a, p) => a + (HOURS[g][c]?.[p] ?? 0), 0) }))).filter(b => b.h > 0);
  const total = bars.reduce((a, b) => a + b.h, 0);
  const corpusArg = corp.length === 4 ? '"all"' : corp.length === 1 ? `"${corp[0]}"` : `[${corp.map(c => `"${c}"`).join(', ')}]`;
  const code = `from pnpl.datasets import LibriBrain100
from pnpl.tasks import WordClassification

ds = LibriBrain100(
    data_path="./data/LibriBrain100",
    task=WordClassification(tmin=0.0, tmax=0.5),
    partition=${part === 'all' ? 'None' : `"${part}"`},${part === 'all' ? '  # every split' : ''}
    subjects="${subj}",
    corpus=${corpusArg},
)
x, y = ds[0]   # x: (306, 125) sensors × time, y: word id`;
  const toggle = (c: CK) => setCorp(cs => cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]);
  const chip = (on: boolean, color: string): React.CSSProperties => ({
    border: `1.5px solid ${on ? color : 'var(--ds-line)'}`, background: on ? `${color}18` : '#fff', color: on ? 'var(--ds-ink)' : 'var(--ds-muted)',
    borderRadius: 999, padding: '0.42rem 0.9rem', font: '500 13px var(--ds-sans)', cursor: 'pointer', transition: 'all 0.15s',
  });
  return (
    <div className="ds-cols-2">
      <div>
        <div style={{ display: 'grid', gap: '1.1rem' }}>
          <div>
            <div className="ds-label" style={{ marginBottom: 8 }}>subjects=</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['deep', 'broad', 'all'] as Subj[]).map(s => <button key={s} style={chip(subj === s, '#7c3aed')} onClick={() => setSubj(s)}>{s === 'deep' ? '"deep" · sub-0' : s === 'broad' ? '"broad" · sub-1…32' : '"all"'}</button>)}
            </div>
          </div>
          <div>
            <div className="ds-label" style={{ marginBottom: 8 }}>corpus=</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CORPUS_KEYS.map(c => <button key={c} style={chip(corp.includes(c), C_COLOR[c])} onClick={() => toggle(c)}>{C_LABEL[c]}</button>)}
            </div>
          </div>
          <div>
            <div className="ds-label" style={{ marginBottom: 8 }}>partition=</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['train', 'validation', 'test', 'all'] as Part[]).map(p => <button key={p} style={chip(part === p, '#0b0a1a')} onClick={() => setPart(p)}>{p === 'all' ? 'None (all)' : `"${p}"`}</button>)}
            </div>
          </div>
        </div>
        <div className="ds-card" style={{ marginTop: '1.4rem', minHeight: 132 }}>
          {error ? (
            <div style={{ fontFamily: 'var(--ds-mono)', fontSize: 13, color: '#b91c1c', lineHeight: 1.6 }}>{error}</div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                <span style={{ fontFamily: 'var(--ds-serif)', fontSize: 46, color: 'var(--ds-ink)', lineHeight: 1 }}>{total.toFixed(1)}</span>
                <span style={{ color: 'var(--ds-muted)' }}>hours of MEG selected</span>
              </div>
              <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', margin: '0.9rem 0 0.5rem', background: 'var(--ds-line)' }}>
                {bars.map(b => <div key={`${b.g}${b.c}`} title={`${b.g} · ${C_LABEL[b.c]} · ${b.h.toFixed(1)} h`} style={{ width: `${(b.h / 104.2) * 100}%`, background: b.g === 'broad' ? CORPUS_COLOR.broad : C_COLOR[b.c], transition: 'width 0.4s' }} />)}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-muted)' }}>
                {bars.map(b => `${b.g === 'broad' ? 'broad' : 'sub-0'} ${C_LABEL[b.c]} ${b.h.toFixed(1)} h`).join(' · ')}
                {' '}· bar = share of all 104.2 h
              </div>
            </>
          )}
        </div>
      </div>
      <CodeBlock code={code} />
    </div>
  );
}
