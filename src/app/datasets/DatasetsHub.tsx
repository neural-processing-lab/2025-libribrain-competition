'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SensorHelmet from './_components/SensorHelmet';
import { CodeBlock, Icon, Reveal, SectionHead, Stat } from './_components/ui';
import { Downloads, EcosystemTimeline } from './_components/Ecosystem';

const ACCENT = [196, 181, 253];
const HOT = [251, 113, 133];

// Hours from Table 1 of Mantegna et al. (2026); LibriBrain2 = LibriBrain100 − LibriBrain.
const PARTS = [
  { k: 'LibriBrain', repo: 'pnpl/LibriBrain', h: 52.3, color: '#7c3aed', items: ['Sherlock books 1–7 · sub-0'] },
  { k: 'LibriBrain2', repo: 'pnpl/LibriBrain2', h: 51.9, color: '#e0314b', items: ['Sherlock books 8–9 · sub-0', 'TIMIT · MOCHA-TIMIT · The Moth · sub-0', 'Book 1 ch. 11–12 · sub-1 … sub-32'] },
];

const USES: { q: string; a: React.ReactNode; code: string }[] = [
  {
    q: 'Push decoding accuracy as far as it goes',
    a: <>Use the deep component: ~80 h from <code>sub-0</code>. That is the regime where in-domain supervised models shine, and the 2026 Deep track.</>,
    code: `ds = LibriBrain100(data_path="./data", task=WordClassification(),\n                   partition="train", subjects="deep")`,
  },
  {
    q: 'Generalise to new people',
    a: <>Train on <code>sub-0</code>, then adapt to the 32 broad subjects (~44 min each), who ship as validation (ch. 11) and test (ch. 12) by design. Including sub-0 lifts accuracy on new subjects by ~15 points.</>,
    code: `deep  = LibriBrain100(data_path="./data", task=WordClassification(),\n                      partition="train", subjects="deep")\nbroad = LibriBrain100(data_path="./data", task=WordClassification(),\n                      partition="validation", subjects="broad")  # adapt here`,
  },
  {
    q: 'Study phonetics',
    a: <>TIMIT and MOCHA-TIMIT are phonetically balanced, use 630+ speakers and many dialects, and are the corpora of the invasive-BCI literature.</>,
    code: `ds = LibriBrain100(data_path="./data", task=PhonemeClassification(),\n                   subjects="deep", corpus=["timit", "mocha"])`,
  },
  {
    q: 'Study meaning',
    a: <>Thirty Moth stories, chosen for maximal semantic spread from the set used for fMRI semantic decoding (Tang et al. 2023).</>,
    code: `ds = LibriBrain100(data_path="./data", task=WordClassification(),\n                   subjects="deep", corpus="podcasts")`,
  },
  {
    q: 'Reproduce the 2025 competition',
    a: <>The original LibriBrain splits and the speech-detection and phoneme-classification tasks are exactly as in 2025.</>,
    code: `from pnpl.datasets import LibriBrainSpeech, LibriBrainPhoneme\nds = LibriBrainPhoneme(data_path="./data", partition="train")`,
  },
];

export default function DatasetsHub() {
  const [use, setUse] = useState(0);
  return (
    <>
      <section className="ds-hero">
        <div className="hero-blob" style={{ width: 520, height: 520, background: '#c4b5fd', top: -180, right: '5%', opacity: 0.35, animation: 'blobFloat1 14s ease-in-out infinite' }} />
        <div className="hero-blob" style={{ width: 420, height: 420, background: '#bfdbfe', bottom: -120, left: '-4%', opacity: 0.45, animation: 'blobFloat2 16s ease-in-out infinite' }} />
        <div className="ds-wrap">
          <div className="ds-hero-grid">
            <Reveal>
              <span className="ds-kicker">Open data · Parker Jones Neural Processing Lab, Oxford</span>
              <h1 className="ds-title">The Libri<em>Brain</em> family</h1>
              <p className="ds-lede">
                Open MEG datasets for decoding speech from the brain, built around <strong>one listener recorded for more than 80 hours</strong> and a growing cohort of new ones.
                Every recording comes with time-aligned words and phonemes, standard splits and a one-line Python loader.
              </p>
              <div className="ds-btns">
                <Link className="ds-btn ds-btn-primary" href="/datasets/libribrain/">LibriBrain {Icon.arrow}</Link>
                <Link className="ds-btn ds-btn-primary" href="/datasets/libribrain100/" style={{ background: 'var(--ds-violet)', borderColor: 'var(--ds-violet)' }}>LibriBrain100 {Icon.arrow}</Link>
                <a className="ds-btn" href="https://github.com/neural-processing-lab/pnpl" target="_blank" rel="noopener noreferrer">{Icon.code}pnpl library</a>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="ds-panel" style={{ padding: '0.4rem 0 1rem' }}>
                <div className="ds-glow" style={{ width: 300, height: 300, background: '#6d28d9', top: '20%', left: '25%', opacity: 0.35 }} />
                <SensorHelmet dir="/datasets/libribrain" height={360} accent={ACCENT} hot={HOT} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1.2rem', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
                  <span className="ds-label">sub-0 · listening to A Study in Scarlet</span>
                  <span className="ds-label" style={{ color: '#fb7185' }}>drag to rotate</span>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="ds-stats">
            <Stat value={104.2} digits={1} unit="h" label="of MEG in LibriBrain100" />
            <Stat value={80.5} digits={1} unit="h" label="from a single listener, sub-0" />
            <Stat value={33} label="participants" />
            <Stat value={4} label="corpora: Sherlock, TIMIT, MOCHA-TIMIT, The Moth" />
            <Stat value={60} suffix="K+" label="Hugging Face downloads" />
          </div>
        </div>
      </section>

      {/* the family */}
      <section className="ds-section">
        <div className="ds-wrap">
          <SectionHead kicker="Two releases, one dataset" title={<>LibriBrain ∪ LibriBrain2 = <em>LibriBrain100</em></>}>
            <p className="ds-p">
              LibriBrain (2025) went deep on a single listener. LibriBrain2 (2026) completes the Sherlock Holmes canon, adds phonetic and semantic corpora, and brings in 32 new people.
              <b> LibriBrain100</b> is not a third repository: it is the union of the two, just as the University of Oxford is not a building alongside its colleges but the collection of them all.
            </p>
          </SectionHead>
          <Reveal>
            <div style={{ display: 'flex', borderRadius: 14, overflow: 'hidden', height: 18, marginBottom: '1.2rem' }} aria-hidden>
              {PARTS.map(p => <div key={p.k} style={{ flex: p.h, background: p.color }} />)}
            </div>
            <div className="ds-cols">
              {PARTS.map(p => (
                <div key={p.k} className="ds-card" style={{ borderTop: `3px solid ${p.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--ds-serif)', fontWeight: 400, fontSize: 32, margin: 0, color: 'var(--ds-ink)' }}>{p.k}</h3>
                    <span style={{ fontFamily: 'var(--ds-serif)', fontSize: 32, color: p.color }}>≈{p.h} h</span>
                  </div>
                  <a href={`https://huggingface.co/datasets/${p.repo}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--ds-mono)', fontSize: 12.5, color: 'var(--ds-muted)' }}>huggingface.co/datasets/{p.repo} ↗</a>
                  <ul style={{ margin: '0.9rem 0 0', paddingLeft: '1.1rem', fontSize: 14.5, lineHeight: 1.8 }}>
                    {p.items.map(it => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
              <div className="ds-card" style={{ background: 'var(--ds-ink)', color: '#c9c5d8', borderColor: 'var(--ds-ink)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--ds-serif)', fontWeight: 400, fontSize: 32, margin: 0, color: '#fff' }}>LibriBrain<i style={{ color: '#c4b5fd' }}>100</i></h3>
                  <span style={{ fontFamily: 'var(--ds-serif)', fontSize: 32, color: '#c4b5fd' }}>104.2 h</span>
                </div>
                <div style={{ fontFamily: 'var(--ds-mono)', fontSize: 12.5, color: '#8a85a0' }}>from pnpl.datasets import LibriBrain100</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: '0.9rem 0 0' }}>
                  One loader fetches each record from whichever repository holds it. The <code style={{ background: 'rgba(196,181,253,0.15)', color: '#e9e5f7' }}>subjects=</code> and <code style={{ background: 'rgba(196,181,253,0.15)', color: '#e9e5f7' }}>corpus=</code> selectors download only what you need.
                </p>
              </div>
            </div>
          </Reveal>

          {/* comparison */}
          <Reveal style={{ marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}>
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead><tr><th></th><th>LibriBrain</th><th>LibriBrain100</th></tr></thead>
                <tbody>
                  {[
                    ['Released', 'June 2025 · NeurIPS 2025 D&B', 'August 2026'],
                    ['Total MEG', '52.3 h', '104.2 h'],
                    ['Participants', '1 (sub-0)', '33: sub-0 (80.5 h) + sub-1…32 (~44 min each)'],
                    ['Stimuli', 'Sherlock Holmes, books 1–7 (LibriVox)', 'All 9 Sherlock books, TIMIT, MOCHA-TIMIT, 30 Moth stories'],
                    ['Scanner', 'MEGIN TRIUX™ neo, 306 channels, OHBA Oxford', 'same'],
                    ['Formats', 'Serialised HDF5 (250 Hz) + events TSV, raw FIF', 'Serialised HDF5 + events TSV, raw BIDS (FIF)'],
                    ['Benchmarks', 'Speech detection, phoneme & word classification', 'Word classification: within-subject, cross-subject, data efficiency'],
                    ['Competition', '2025 PNPL Competition (155 teams)', '2026 PNPL Competition, Deep & Broad tracks'],
                    ['Licence', 'CC BY-NC 4.0', 'CC BY-NC 4.0'],
                  ].map(([k, a, b]) => (
                    <tr key={k}><td className="ds-label" style={{ whiteSpace: 'nowrap' }}>{k}</td><td>{a}</td><td style={{ color: 'var(--ds-ink)' }}>{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* which one */}
      <section className="ds-section ds-section-tint">
        <div className="ds-wrap">
          <SectionHead kicker="Which data should I use?" title={<>I want to <em>…</em></>} />
          <Reveal>
            <div className="ds-cols-2">
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {USES.map((u, i) => (
                  <button key={u.q} onClick={() => setUse(i)} aria-pressed={use === i}
                    style={{
                      textAlign: 'left', border: '1px solid', borderColor: use === i ? 'var(--ds-violet)' : 'var(--ds-line)', background: use === i ? '#fff' : 'transparent',
                      borderRadius: 12, padding: '0.95rem 1.1rem', cursor: 'pointer', font: '500 16px var(--ds-sans)', color: use === i ? 'var(--ds-ink)' : 'var(--ds-muted)',
                      boxShadow: use === i ? '0 10px 30px -14px rgba(124,58,237,0.45)' : 'none', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                    {u.q}<span style={{ width: 16, height: 16, display: 'block', opacity: use === i ? 1 : 0.3, color: 'var(--ds-violet)' }}>{Icon.arrow}</span>
                  </button>
                ))}
              </div>
              <div>
                <p className="ds-p" style={{ minHeight: 84 }}>{USES[use].a}</p>
                <CodeBlock code={`# pip install pnpl\nfrom pnpl.datasets import LibriBrain100\nfrom pnpl.tasks import WordClassification, PhonemeClassification\n\n${USES[use].code}`} />
                <p className="ds-note">The full selector syntax is on the <Link href="/datasets/libribrain100/#start" className="ds-link-arrow" style={{ fontSize: 12.5 }}>LibriBrain100 page</Link>.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ecosystem */}
      <section className="ds-section">
        <div className="ds-wrap">
          <SectionHead kicker="Ecosystem" title={<>Data, tools, competitions, <em>community</em></>}>
            <p className="ds-p">
              The datasets are one part of a larger loop. The <code>pnpl</code> library makes them easy to load, open competitions turn them into shared benchmarks, and the
              results come back as papers, models and blog posts that set the next round&apos;s baselines.
            </p>
          </SectionHead>
          <div className="ds-cols-2">
            <Reveal>
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                {[
                  { t: 'pnpl', d: 'The Python library: download, preprocess and load as PyTorch datasets.', href: 'https://github.com/neural-processing-lab/pnpl', ext: true },
                  { t: '2026 PNPL Competition', d: 'Word classification on LibriBrain100, in Deep and Broad tracks.', href: '/', ext: false },
                  { t: '2025 PNPL Competition', d: 'Speech detection and phoneme classification on LibriBrain. 155 teams.', href: '/editions/2025/', ext: false },
                  { t: 'Blog', d: 'Reference models, neuroscience-inspired approaches, and how to measure progress.', href: '/blog/', ext: false },
                  { t: 'MEG-XL', d: 'Pre-trained MEG foundation model and the LibriBrain100 baseline backbone.', href: 'https://huggingface.co/pnpl/MEG-XL', ext: true },
                ].map(c => {
                  const inner = (
                    <div className="ds-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', transition: 'border-color 0.2s' }}>
                      <div>
                        <div style={{ fontWeight: 650, color: 'var(--ds-ink)', fontSize: 16 }}>{c.t}</div>
                        <div style={{ fontSize: 14, color: 'var(--ds-muted)', marginTop: 2 }}>{c.d}</div>
                      </div>
                      <span style={{ width: 18, height: 18, display: 'block', color: 'var(--ds-violet)', flexShrink: 0 }}>{Icon.arrow}</span>
                    </div>
                  );
                  return c.ext
                    ? <a key={c.t} href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
                    : <Link key={c.t} href={c.href} style={{ textDecoration: 'none' }}>{inner}</Link>;
                })}
              </div>
              <Downloads />
            </Reveal>
            <Reveal delay={100}><EcosystemTimeline /></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
