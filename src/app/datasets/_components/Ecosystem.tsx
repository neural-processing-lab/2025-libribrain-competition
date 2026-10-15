'use client';

import React from 'react';
import Link from 'next/link';
import { CountUp } from './ui';

type Tag = 'dataset' | 'competition' | 'paper' | 'blog';
interface Item { date: string; title: string; href: string; note: string; tag: Tag; major?: boolean; about: ('libribrain' | 'libribrain100')[] }

export const TIMELINE: Item[] = [
  { date: 'Jun 2025', title: 'LibriBrain released', href: 'https://arxiv.org/abs/2506.02098', note: '50+ h of within-subject MEG, the pnpl library and standard splits. NeurIPS 2025 Datasets & Benchmarks.', tag: 'dataset', major: true, about: ['libribrain', 'libribrain100'] },
  { date: 'Jun 2025', title: 'The 2025 PNPL Competition opens', href: '/editions/2025/', note: 'Phase 1, Speech Detection, goes live on 2 June. Phase 2, Phoneme Classification, follows on 1 August.', tag: 'competition', major: true, about: ['libribrain'] },
  { date: 'Jul 2025', title: 'Brain-inspired approaches to speech detection', href: '/blog/brain-inspired-approaches-speech-detection/', note: 'Using auditory-cortex sensors and neuroscience priors to design better decoders.', tag: 'blog', about: ['libribrain'] },
  { date: 'Sep 2025', title: 'Language-inspired approaches to phoneme classification', href: '/blog/language-inspired-approaches-phoneme-classification/', note: 'Decoding phonetic features from MEG and mapping them back to ARPAbet.', tag: 'blog', about: ['libribrain'] },
  { date: 'Oct 2025', title: 'Elementary, My Dear Watson: neural keyword spotting', href: 'https://arxiv.org/abs/2510.21038', note: 'Spotting keywords in continuous MEG from LibriBrain. NeurIPS 2025 workshop.', tag: 'paper', about: ['libribrain'] },
  { date: 'Dec 2025', title: 'Competition workshop at NeurIPS 2025', href: '/editions/2025/workshop-papers/', note: '155 teams and 6,041 submissions. Winners and workshop papers presented at NeurIPS.', tag: 'competition', about: ['libribrain'] },
  { date: 'Feb 2026', title: 'MEG-XL: data-efficient brain-to-text', href: 'https://arxiv.org/abs/2602.02494', note: 'Long-context pre-training, fine-tuned on LibriBrain. The backbone of the LibriBrain100 baselines. ICML 2026.', tag: 'paper', about: ['libribrain', 'libribrain100'] },
  { date: 'Jul 2026', title: 'The 2026 PNPL Competition', href: '/', note: 'Word classification on LibriBrain100, with a Deep track (sub-0) and a Broad track (32 new subjects).', tag: 'competition', major: true, about: ['libribrain100'] },
  { date: 'Aug 2026', title: 'LibriBrain100 released', href: 'https://arxiv.org/abs/2608.25204', note: '104 h across 33 subjects: the complete canon plus TIMIT, MOCHA-TIMIT and The Moth.', tag: 'dataset', major: true, about: ['libribrain', 'libribrain100'] },
  { date: 'Sep 2026', title: 'What can thought-to-text interfaces communicate?', href: '/blog/what-can-speech-brain-computer-interfaces-communicate/', note: 'OVMI, a common information-theoretic yardstick for speech BCIs.', tag: 'blog', about: ['libribrain100'] },
  { date: 'Sep 2026', title: 'Brain-to-text with minutes of data using MEG-XL', href: '/blog/brain-to-text-decoding-with-meg-xl/', note: 'Why the broad track is winnable: adapting to new subjects from very little data.', tag: 'blog', about: ['libribrain100'] },
  { date: '2026', title: 'Benchmarking non-invasive speech BCIs: lessons learned', href: '/editions/2026/publications/', note: 'The 2025 competition retrospective: what worked, what leaked, what we changed.', tag: 'paper', about: ['libribrain', 'libribrain100'] },
];

const TAG_COLOR: Record<Tag, string> = { dataset: '#7c3aed', competition: '#e0314b', paper: '#0284c7', blog: '#16a34a' };

export function EcosystemTimeline({ highlight }: { highlight?: 'libribrain' | 'libribrain100' }) {
  const items = highlight ? TIMELINE.filter(i => i.about.includes(highlight)) : TIMELINE;
  return (
    <div className="ds-timeline">
      {items.map(it => {
        const ext = it.href.startsWith('http');
        const body = <>{it.title}{ext ? ' ↗' : ''}</>;
        return (
          <div key={it.title} className={`ds-tl-item ${it.major ? 'major' : ''}`}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <span className="ds-tl-date">{it.date}</span>
              <span style={{ fontFamily: 'var(--ds-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: TAG_COLOR[it.tag] }}>{it.tag}</span>
            </div>
            <div className="ds-tl-title">
              {ext ? <a href={it.href} target="_blank" rel="noopener noreferrer">{body}</a> : <Link href={it.href}>{body}</Link>}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ds-muted)', lineHeight: 1.55 }}>{it.note}</div>
          </div>
        );
      })}
    </div>
  );
}

/** All-time Hugging Face downloads (as of October 2026). */
export function Downloads({ compact = false }: { compact?: boolean }) {
  const rows = [
    { name: 'pnpl/LibriBrain', v: 50, note: 'Sherlock 1–7, sub-0', href: 'https://huggingface.co/datasets/pnpl/LibriBrain' },
    { name: 'pnpl/LibriBrain2', v: 10, note: 'Sherlock 1, 8–9, TIMIT, MOCHA, The Moth, sub-0 to sub-32', href: 'https://huggingface.co/datasets/pnpl/LibriBrain2' },
  ];
  return (
    <div className="ds-card" style={{ marginTop: compact ? 0 : '1.2rem' }}>
      <div className="ds-label" style={{ marginBottom: '0.8rem' }}>Hugging Face downloads · all time</div>
      {rows.map(r => (
        <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: '1rem', padding: '0.7rem 0', borderTop: '1px solid var(--ds-line)', textDecoration: 'none' }}>
          <div>
            <div style={{ fontFamily: 'var(--ds-mono)', fontSize: 13.5, color: 'var(--ds-ink)', fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ds-muted)' }}>{r.note}</div>
            <div style={{ height: 6, background: 'var(--ds-violet-ll)', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(r.v / 50) * 100}%`, background: 'linear-gradient(90deg, #a78bfa, #7c3aed)', borderRadius: 3 }} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 38, color: 'var(--ds-ink)', lineHeight: 1 }}><CountUp to={r.v} suffix="K+" /></div>
        </a>
      ))}
    </div>
  );
}
