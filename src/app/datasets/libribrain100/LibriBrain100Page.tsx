'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MultiPlayer from '../_components/MultiPlayer';
import SubjectEvoked from '../_components/SubjectEvoked';
import Landscape from '../_components/Landscape';
import Bookshelf from '../_components/Bookshelf';
import { BubblePack, SessionTreemap, CORPUS_COLOR } from '../_components/Composition';
import { CorpusNumbers, CorpusPhonemes, LoaderPlayground, VocabBuilder } from '../_components/LB100Widgets';
import { GroupedBars } from '../_components/charts';
import { CodeBlock, Figure, Icon, PageToc, Reveal, SectionHead, Seg, Stat } from '../_components/ui';
import { EcosystemTimeline, Downloads } from '../_components/Ecosystem';

const DIR = '/datasets/libribrain100';

const TOC = [
  { id: 'listen', label: 'Listen' },
  { id: 'design', label: 'Broad & deep' },
  { id: 'composition', label: 'Composition' },
  { id: 'corpora', label: 'Corpora' },
  { id: 'listeners', label: 'Listeners' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'results', label: 'Results' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'start', label: 'Get started' },
];

const MOTH: [string, string, string][] = [
  ['Alternate Ithaca Tom', 'Tom Weiser', '11:47'], ['Thumbs Up!', 'Nathan Englander', '14:09'], ['Goldie, the Goldfish', 'Becca Stevens', '10:54'],
  ['Under the Influence', 'Jeffery Rudell', '10:28'], ['Treasure Island', 'Boots Riley', '13:30'], ['That Thing on My Arm', 'Padma Lakshmi', '14:49'],
  ['Breaking Up in the Age of Google', 'Jessi Klein', '17:43'], ['The Triangle Shirtwaist Connection', 'Michelle Fecteau', '7:06'], ['Stage Fright', 'Suzanne Vega', '10:07'],
  ['Not on the Usual Tour', 'Jon Lovett', '8:31'], ['Life Reimagined', 'Raymond Christian', '11:15'], ['Only One Way To Find Out', 'Sarah Gray', '13:04'],
  ['The Postman Always Calls', 'Elizabeth Browning', '15:29'], ['Blue Hope', 'Sylvia Earle', '14:00'], ['The Curse', 'Dame Wilburn', '13:56'],
  ['Beneath the Mushroom Cloud', 'Clifton Truman Daniel', '11:46'], ['Going the Liberty Way', 'Kevin Roose', '13:28'], ['Caution: Eating', 'Evan Kleiman', '9:40'],
  ['Birth of a Nation', 'Petina Gappah', '9:09'], ['Life and Death on the Oregon Trail', 'Micaela Blei', '12:24'], ['Fire Test For Love', 'Lauren Slater', '10:58'],
  ['Leaving Baghdad', 'Abbas Mousa', '11:15'], ['Coming of Age on Death Row', 'Gautam Narula', '11:58'], ['How To Draw A Nekkid Man', 'Tricia Rose Burt', '12:08'],
  ['The Mayor of the Freaks', 'David Crabb', '16:11'], ['Swimming with Astronauts', 'Michael J. Massimino', '13:11'], ['Wild Womxn and Dancing Queens', 'Lex Jade', '6:40'],
  ['Vixen and the USSR', 'Sue Steinacher', '13:24'], ['From Boyhood to Fatherhood', 'Jonathan Ames', '11:57'], ["Where There's Smoke", 'Jenifer Hixson', '10:02'],
];

const BIBTEX = `@article{mantegna2026libribrain100,
  title   = {{LibriBrain100}: One Hundred Hours of Broad and Deep {MEG} Data for Neural Speech Decoding at Scale},
  author  = {Mantegna, Francesco and Jayalath, Dulhan and Elvers, Gereon and Kim, Tasha and Ballyk, Benjamin and Fung, Alex and Cho, SungJun and Kwon, Teyun and Kurth, Luisa and \\"Ozdogan, Miran and Landau, Gilad and Somaiya, Pratik and Voets, Natalie and Woolrich, Mark and Parker Jones, Oiwi},
  journal = {arXiv preprint arXiv:2608.25204},
  year    = {2026},
}`;

const EFF = [
  { pct: '100%', min: '≈40 min', w: 0.492, wo: 0.334 },
  { pct: '50%', min: '≈20 min', w: 0.488, wo: 0.337 },
  { pct: '25%', min: '≈10 min', w: 0.482, wo: 0.332 },
];

export default function LibriBrain100Page() {
  const [eff, setEff] = useState(0);
  const [cmp, setCmp] = useState<'model' | 'ovmi'>('model');

  return (
    <>
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="ds-hero">
        <div className="hero-blob" style={{ width: 520, height: 520, background: '#bfdbfe', top: -160, right: '10%', opacity: 0.5, animation: 'blobFloat1 14s ease-in-out infinite' }} />
        <div className="hero-blob" style={{ width: 420, height: 420, background: '#e9d5ff', bottom: -120, left: '-6%', opacity: 0.5, animation: 'blobFloat2 16s ease-in-out infinite' }} />
        <div className="hero-blob" style={{ width: 280, height: 280, background: '#bbf7d0', top: '35%', left: '45%', opacity: 0.35, animation: 'blobFloat3 12s ease-in-out infinite' }} />
        <div className="ds-wrap">
          <div className="ds-hero-grid">
            <Reveal>
              <span className="ds-kicker">Dataset · 2026 · Successor to LibriBrain</span>
              <h1 className="ds-title">Libri<em>Brain</em><span style={{ color: 'var(--ds-violet)' }}>100</span></h1>
              <p className="ds-lede">
                <strong>One hundred hours of broad and deep MEG.</strong> Eighty hours from a single listener across the complete Sherlock Holmes canon, phonetically balanced
                sentences and real-life stories, plus forty minutes each from 32 new people. Built to ask how far one brain can take us, and how quickly that knowledge transfers to the next.
              </p>
              <div className="ds-btns">
                <a className="ds-btn ds-btn-primary" href="https://huggingface.co/datasets/pnpl/LibriBrain2" target="_blank" rel="noopener noreferrer">{Icon.hf}LibriBrain2 on HF</a>
                <a className="ds-btn" href="https://arxiv.org/abs/2608.25204" target="_blank" rel="noopener noreferrer">{Icon.paper}Paper</a>
                <a className="ds-btn" href="https://github.com/neural-processing-lab/pnpl" target="_blank" rel="noopener noreferrer">{Icon.code}pnpl library</a>
                <Link className="ds-btn" href="/">{Icon.trophy}2026 Competition</Link>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <BubblePack />
              <p className="ds-note" style={{ textAlign: 'center', marginTop: 0 }}>Circle area ∝ hours of MEG. Hover a circle.</p>
            </Reveal>
          </div>
          <div className="ds-stats">
            <Stat value={104.2} digits={1} unit="h" label="of MEG, standard splits included" />
            <Stat value={33} label="listeners" />
            <Stat value={80.5} digits={1} unit="h" label="from sub-0: 8× the next deepest dataset" />
            <Stat value={44} unit="min" label="from each of 32 new subjects" />
            <Stat value={10} suffix="K+" label="LibriBrain2 downloads" />
          </div>
        </div>
      </section>

      <PageToc items={TOC} />

      {/* ── 01 LISTEN ─────────────────────────────────── */}
      <section id="listen" className="ds-section ds-section-dark" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="01" kicker="Listen" title={<>One story, <em>many brains</em></>}>
            <p className="ds-p">
              Chapters 11 and 12 of <i>A Study in Scarlet</i> are the only audiobook sessions every LibriBrain100 participant heard. Here is the same 20 seconds, John Ferrier riding into
              Salt Lake City, through the sensors of sub-0 and the broad-cohort subjects whose recordings are already public. Each brain is different, yet the rhythm of the speech is
              visible in all of them.
            </p>
          </SectionHead>
          <Reveal><MultiPlayer dir={DIR} /></Reveal>
          <p className="ds-note">
            Real data from the public LibriBrain2 release (sub-1…12; the remaining broad subjects are partly embargoed until after the 2026 competition). Signals are filtered to 0.5–20 Hz,
            z-scored per sensor and aligned to the audio using each subject&apos;s own event file.
          </p>
        </div>
      </section>

      {/* ── 02 DESIGN ─────────────────────────────────── */}
      <section id="design" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <div className="ds-cols-2">
            <SectionHead num="02" kicker="Broad & deep" title={<>Depth first, <em>then breadth</em></>}>
              <p className="ds-p">
                Hours per subject drive decoding performance more than total hours across subjects, so LibriBrain100 keeps going deeper: sub-0 grows from 52 to <b>80 hours</b>,
                about 8× the next non-LibriBrain dataset and 80× most others.
              </p>
              <p className="ds-p">
                Nobody will record 80 hours from every patient, though. So LibriBrain100 adds <b>32 new listeners with ~44 minutes each</b>, a realistic budget for a new user. The result
                spans 0.6–80 h per subject and is the only dataset in the landscape that is broad and deep at once.
              </p>
            </SectionHead>
            <Reveal delay={100}>
              <Landscape initialStep={2} maxStep={2} />
              <p className="ds-note">Toggle through time. Values from Table 1 of each paper. LibriBrain100&apos;s dotted line spans its deep subject and its broad cohort.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 03 COMPOSITION ────────────────────────────── */}
      <section id="composition" className="ds-section ds-section-tint" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="03" kicker="Composition" title={<>Every session, <em>to scale</em></>}>
            <p className="ds-p">
              Every rectangle is one recording session, sized by its duration. Most of the data is sub-0 listening to Sherlock Holmes, joined by 14 TIMIT sessions, 4 MOCHA-TIMIT
              sessions, 30 Moth stories, and two chapters for each of the 32 broad subjects.
            </p>
          </SectionHead>
          <Reveal><SessionTreemap /></Reveal>
          <div className="ds-cols-2" style={{ marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <Reveal>
              <h3 className="ds-h3">Standard splits</h3>
              <div className="ds-table-wrap">
                <table className="ds-table">
                  <thead><tr><th>Component</th><th>Source</th><th className="num">All</th><th className="num">Train</th><th className="num">Val</th><th className="num">Test</th></tr></thead>
                  <tbody>
                    {[
                      ['Deep · sub-0', 'Sherlock (all books)', '68.1', '67.3', '0.4', '0.4', CORPUS_COLOR.sherlock],
                      ['', 'TIMIT', '5.3', '4.9', '0.2', '0.2', CORPUS_COLOR.timit],
                      ['', 'MOCHA-TIMIT', '1.1', '0.8', '0.2', '0.2', CORPUS_COLOR.mocha],
                      ['', 'The Moth (30 stories)', '6.0', '5.7', '0.2', '0.2', CORPUS_COLOR.moth],
                      ['Broad · sub-1…32', 'Sherlock (2 chapters)', '23.7', '–', '11.5', '12.2', CORPUS_COLOR.broad],
                    ].map((r, i) => (
                      <tr key={i}><td>{r[0]}</td><td><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: r[6], marginRight: 7 }} />{r[1]}</td>
                        {r.slice(2, 6).map((v, k) => <td key={k} className="num">{v}</td>)}</tr>
                    ))}
                    <tr className="hl"><td>Total</td><td>33 subjects</td><td className="num">104.2</td><td className="num">78.6</td><td className="num">12.5</td><td className="num">13.1</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="ds-note">Hours, Table 2 of the paper. The broad subjects have no training split by design: fine-tune on chapter 11, evaluate on chapter 12.</p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="ds-h3">How the splits avoid leakage</h3>
              <ul className="ds-p-sm" style={{ paddingLeft: '1.1rem', margin: 0 }}>
                <li><b>Sherlock:</b> book 1, chapter 11 is validation and chapter 12 is test, exactly as in LibriBrain.</li>
                <li><b>TIMIT:</b> the official 24-speaker core test set (192 utterances) and the 50-speaker Kaldi dev set. Shared <code>SA</code> sentences are excluded, as is any training speaker who shares a sentence with the test set.</li>
                <li><b>MOCHA-TIMIT:</b> no standard split existed. Sets A and D train; B and C are split into unique, non-overlapping validation and test sentences.</li>
                <li><b>The Moth:</b> following Tang et al. (2023), <i>From Boyhood to Fatherhood</i> is validation and <i>Where There&apos;s Smoke</i> is test.</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 04 CORPORA ────────────────────────────────── */}
      <section id="corpora" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="04" kicker="Corpora" title={<>From <em>sound</em> to <em>meaning</em></>}>
            <p className="ds-p">
              LibriBrain was one narrator reading one genre. LibriBrain100 deliberately spans the acoustic–semantic axis, so that you can ask whether a decoder is reading out
              sound, meaning, or both.
            </p>
          </SectionHead>

          <Reveal>
            <div style={{ position: 'relative', margin: '0 0 2.5rem', padding: '2.6rem 0 0' }}>
              <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${CORPUS_COLOR.timit}, ${CORPUS_COLOR.mocha}, ${CORPUS_COLOR.sherlock}, ${CORPUS_COLOR.moth})` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }} className="ds-label">
                <span>← acoustic / phonetic control</span><span>semantic diversity →</span>
              </div>
              {[['TIMIT', 8, CORPUS_COLOR.timit], ['MOCHA-TIMIT', 26, CORPUS_COLOR.mocha], ['Sherlock', 58, CORPUS_COLOR.sherlock], ['The Moth', 90, CORPUS_COLOR.moth]].map(([l, x, c]) => (
                <div key={l as string} style={{ position: 'absolute', left: `${x}%`, top: 0, transform: 'translateX(-50%)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 650, fontSize: 13.5, color: c as string, whiteSpace: 'nowrap' }}>{l}</div>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: c as string, border: '3px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', margin: '4px auto 0' }} />
                </div>
              ))}
            </div>
          </Reveal>

          <div className="ds-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))' }}>
            {[
              { t: 'Sherlock Holmes', h: '68.1 h', c: CORPUS_COLOR.sherlock, d: 'All nine books of the canon, publication order. Books 1–8 read by David Clarke; book 9 by Thomas A. Copeland, chosen for a similar Southern British voice. Narrative and dialogue, controlled delivery.', f: ['9 books · 116 chapters', '2 narrators', 'continuous narrative'] },
              { t: 'TIMIT', h: '5.3 h', c: CORPUS_COLOR.timit, d: 'The cornerstone corpus of speech recognition and of invasive speech-BCI research. 6,300 read sentences engineered for phonetic coverage, from 630 American speakers across 8 dialect regions.', f: ['630 speakers · 8 dialects', '2,342 distinct sentences', 'SA / SX / SI design'] },
              { t: 'MOCHA-TIMIT', h: '1.1 h', c: CORPUS_COLOR.mocha, d: 'TIMIT-like phonetic coverage in Southern British English, from one male and one female speaker. Rich in connected-speech effects such as assimilation, weak forms and vowel reduction.', f: ['2 speakers × 460 utterances', 'British English', 'used in surgical BCI work'] },
              { t: 'The Moth', h: '6.0 h', c: CORPUS_COLOR.moth, d: 'Thirty spontaneous, autobiographical stories, picked from the set used for fMRI semantic decoding by maximising the spread of sentence embeddings. Disfluencies, laughter and applause included.', f: ['30 storytellers', '~12 min each', 'max. semantic dispersion'] },
            ].map((c, k) => (
              <Reveal key={c.t} delay={k * 80}>
                <div className="ds-card" style={{ height: '100%', borderTop: `3px solid ${c.c}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 className="ds-h3" style={{ margin: 0 }}>{c.t}</h3>
                    <span style={{ fontFamily: 'var(--ds-serif)', fontSize: 26, color: c.c }}>{c.h}</span>
                  </div>
                  <p className="ds-p-sm" style={{ margin: '0.6rem 0 0.8rem' }}>{c.d}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{c.f.map(f => <span key={f} className="ds-pill" style={{ background: `${c.c}16`, color: c.c }}>{f}</span>)}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
            <h3 className="ds-h3">The completed canon</h3>
            <p className="ds-p-sm" style={{ maxWidth: 720 }}>Books 8 and 9 are new in LibriBrain100. Click any spine for its case file.</p>
            <Bookshelf upTo={9} highlightNew />
          </Reveal>

          <div className="ds-cols-2" style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
            <Reveal>
              <h3 className="ds-h3">Phonetic balance</h3>
              <p className="ds-p-sm">
                TIMIT was built to over-represent rare sounds. Its rank–frequency slope is flatter (−0.73) than the podcasts&apos; (−0.78) or the audiobooks&apos; (−0.83), and phonemes
                like <code>g</code>, <code>y</code>, <code>sh</code>, <code>oy</code> and <code>zh</code> occur noticeably more often. Hover a phoneme to compare.
              </p>
              <CorpusNumbers />
              <p className="ds-note">Word and phoneme counts computed for this page from sub-0&apos;s event files. Slopes from the paper (Fig. 10).</p>
            </Reveal>
            <Reveal delay={100}>
              <div className="ds-label" style={{ marginBottom: 8 }}>The 30 Moth stories</div>
              <div style={{ maxHeight: 420, overflowY: 'auto', border: '1px solid var(--ds-line)', borderRadius: 12, background: '#fff' }}>
                {MOTH.map(([t, a, d], i) => (
                  <div key={t} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '0.6rem', alignItems: 'baseline', padding: '0.55rem 0.9rem', borderBottom: '1px solid var(--ds-line)', background: i === 28 ? '#fef9c3' : i === 29 ? '#fee2e2' : undefined }}>
                    <span style={{ fontFamily: 'var(--ds-mono)', fontSize: 11, color: 'var(--ds-faint)' }}>{i + 1}</span>
                    <span style={{ fontSize: 14 }}><b style={{ color: 'var(--ds-ink)', fontWeight: 600 }}>{t}</b> <span style={{ color: 'var(--ds-muted)' }}>· {a}</span>{i === 28 && <span className="ds-pill" style={{ marginLeft: 6, background: '#fde68a', color: '#854d0e' }}>val</span>}{i === 29 && <span className="ds-pill" style={{ marginLeft: 6, background: '#fecaca', color: '#9f1239' }}>test</span>}</span>
                    <span style={{ fontFamily: 'var(--ds-mono)', fontSize: 12, color: 'var(--ds-muted)' }}>{d}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal style={{ marginTop: '2rem' }}><CorpusPhonemes /></Reveal>

          <div className="ds-cols-2" style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
            <Reveal><Figure src="/datasets/figures/lb100-speakers.webp" alt="t-SNE of speaker embeddings coloured by corpus" caption={<><b>Voices.</b> ECAPA-TDNN speaker embeddings (t-SNE). TIMIT&apos;s 630 speakers cover the space of voices, split mainly by sex, far more widely than the audiobook narrators.</>} /></Reveal>
            <Reveal delay={100}><Figure src="/datasets/figures/lb100-keywords.webp" alt="t-SNE of keyword embeddings for three corpora" caption={<><b>Meanings.</b> Word2Vec keyword embeddings: the audiobooks cluster tightly, TIMIT spreads wider, and the podcasts span the most semantic ground.</>} /></Reveal>
          </div>
        </div>
      </section>

      {/* ── 05 LISTENERS ──────────────────────────────── */}
      <section id="listeners" className="ds-section ds-section-tint" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="05" kicker="Listeners" title={<>Thirty-three <em>different heads</em></>}>
            <p className="ds-p">
              33 healthy volunteers aged 19–50 (median 28): 10 women and 23 men. 16 are native English speakers and 17 use English daily as a second language. Everyone was recorded
              on the same MEGIN TRIUX™ neo at OHBA under ethics approval R90053/RE003. Brains differ in anatomy, head position, attention and signal-to-noise, and that variability is the point.
            </p>
          </SectionHead>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { l: 'Sex', a: ['women', 10, '#a855f7'], b: ['men', 23, '#c4b5fd'] },
                { l: 'First language', a: ['native English', 16, '#4a7bd0'], b: ['English L2', 17, '#9cc0ef'] },
              ].map(g => (
                <div key={g.l} className="ds-card">
                  <div className="ds-label" style={{ marginBottom: 10 }}>{g.l}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4 }}>
                    {Array.from({ length: 33 }, (_, k) => <span key={k} style={{ aspectRatio: '1', borderRadius: '50%', background: k < (g.a[1] as number) ? (g.a[2] as string) : (g.b[2] as string) }} />)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13, color: 'var(--ds-muted)' }}>
                    <span><b style={{ color: 'var(--ds-ink)' }}>{g.a[1]}</b> {g.a[0]}</span><span><b style={{ color: 'var(--ds-ink)' }}>{g.b[1]}</b> {g.b[0]}</span>
                  </div>
                </div>
              ))}
              <div className="ds-card">
                <div className="ds-label" style={{ marginBottom: 10 }}>Age</div>
                <div style={{ position: 'relative', height: 40 }}>
                  <div style={{ position: 'absolute', top: 18, left: 0, right: 0, height: 4, background: 'var(--ds-line)', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', top: 12, left: `${((24 - 19) / 31) * 100}%`, width: `${(8 / 31) * 100}%`, height: 16, background: 'var(--ds-violet-l)', borderRadius: 4 }} />
                  <div style={{ position: 'absolute', top: 8, left: `${((28 - 19) / 31) * 100}%`, width: 3, height: 24, background: 'var(--ds-violet)', borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ds-muted)' }}><span>19</span><span><b style={{ color: 'var(--ds-ink)' }}>median 28</b> · IQR 8</span><span>50</span></div>
              </div>
            </div>
          </Reveal>
          <Reveal><SubjectEvoked dir={DIR} /></Reveal>
          <Reveal style={{ marginTop: '2.5rem' }}>
            <Figure src="/datasets/figures/lb100-between-meg.webp" alt="Group-level speech vs non-speech differences: RMS topography, ITC and PSD" caption={<><b>From the paper:</b> averaged over all 33 listeners, speech still yields stronger bilateral temporal responses, more delta–theta phase-locking and more low-frequency power than silence. The shared signal decoders can exploit.</>} />
          </Reveal>
        </div>
      </section>

      {/* ── 06 BENCHMARK ──────────────────────────────── */}
      <section id="benchmark" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="06" kicker="Benchmark" title={<>Fifty words that <em>matter</em></>}>
            <p className="ds-p">
              LibriBrain100&apos;s benchmark is <b>word classification</b>. Given a window of MEG time-locked to a word, predict which of 50 words was heard. It sits between phonemes and full
              brain-to-text and can draw on both sound and meaning. The 50 words are mostly function words, pronouns and auxiliaries, plus a few content words. That is enough for
              useful assistive utterances. Try it.
            </p>
          </SectionHead>
          <Reveal><VocabBuilder /></Reveal>
          <div className="ds-cols-2" style={{ marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <Reveal>
              <h3 className="ds-h3">The metric: top-10 balanced accuracy</h3>
              <p className="ds-p-sm">
                The model ranks all 50 words. A prediction counts if the true word is among its ten best guesses, so chance is 10/50 = <b>20%</b>. Accuracy is computed per word and
                averaged, so rare words like &ldquo;always&rdquo; count as much as &ldquo;the&rdquo; and a model cannot win by just guessing frequent words.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="ds-h3">The baseline: MEG-XL</h3>
              <p className="ds-p-sm">
                Baselines fine-tune <a href="https://huggingface.co/pnpl/MEG-XL" target="_blank" rel="noopener noreferrer" className="ds-link-arrow" style={{ fontSize: 'inherit' }}>MEG-XL</a>,
                a brain foundation model pre-trained on ~300 h from 800 subjects (MOUS, Cam-CAN, SMN4Lang) with a context 5–300× longer than earlier models. It is the strongest published
                approach to cross-subject word decoding.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 07 RESULTS ────────────────────────────────── */}
      <section id="results" className="ds-section ds-section-dark" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="07" kicker="Results" title={<>What depth <em>buys you</em></>}>
            <p className="ds-p">Three experiments: many subjects helping one, one subject helping many, and how little data a new person needs.</p>
          </SectionHead>
          <div className="ds-cols-2">
            <Reveal>
              <div className="ds-label">Task 1 · many-to-one</div>
              <h3 className="ds-h3" style={{ marginTop: 6 }}>Does broad data help the deep subject?</h3>
              <p className="ds-p-sm" style={{ color: '#a29db8' }}>
                Mostly, yes. Adding the 32 broad subjects improves sub-0 on TIMIT, MOCHA-TIMIT and the podcasts. On Sherlock, which dominates training, a Sherlock-only model does best.
              </p>
              <GroupedBars dark yMax={0.8} chance={0.2} groups={[
                { label: 'Audiobook', bars: [{ name: 'sub-0 + sub-1…32', value: 0.492, color: CORPUS_COLOR.sherlock }, { name: 'sub-0 only', value: 0.519, color: CORPUS_COLOR.sherlock, hatch: true }, { name: 'sub-0, Sherlock only', value: 0.585, color: '#2b599f', hatch: true }] },
                { label: 'TIMIT', bars: [{ name: 'sub-0 + sub-1…32', value: 0.431, color: CORPUS_COLOR.timit }, { name: 'sub-0 only', value: 0.393, color: CORPUS_COLOR.timit, hatch: true }] },
                { label: 'MOCHA', bars: [{ name: 'sub-0 + sub-1…32', value: 0.501, color: CORPUS_COLOR.mocha }, { name: 'sub-0 only', value: 0.436, color: CORPUS_COLOR.mocha, hatch: true }] },
                { label: 'Podcast', bars: [{ name: 'sub-0 + sub-1…32', value: 0.464, color: CORPUS_COLOR.moth }, { name: 'sub-0 only', value: 0.399, color: CORPUS_COLOR.moth, hatch: true }] },
              ]} />
            </Reveal>
            <Reveal delay={100}>
              <div className="ds-label">Task 2 · one-to-many</div>
              <h3 className="ds-h3" style={{ marginTop: 6 }}>Does the deep subject help everyone else?</h3>
              <p className="ds-p-sm" style={{ color: '#a29db8' }}>
                By about <b style={{ color: '#fff' }}>15 points</b>. Training alongside sub-0&apos;s 80 hours lifts accuracy on 32 new people with roughly 120× less data each. The gain holds for
                every single subject, not just on average.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                {[['with sub-0', 0.478, '#a855f7'], ['without sub-0', 0.329, '#6b6582']].map(([l, v, c]) => (
                  <div key={l as string} className="ds-card-dark ds-card">
                    <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 52, color: '#fff', lineHeight: 1 }}>{((v as number) * 100).toFixed(1)}<small style={{ fontSize: 20, color: '#8a85a0' }}>%</small></div>
                    <div className="ds-label" style={{ marginTop: 6 }}>{l}</div>
                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', marginTop: 12, position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, width: `${((v as number) / 0.6) * 100}%`, background: c as string, borderRadius: 4 }} />
                      <div style={{ position: 'absolute', top: -4, bottom: -4, left: `${(0.2 / 0.6) * 100}%`, width: 1.5, background: '#fff', opacity: 0.6 }} />
                    </div>
                  </div>
                ))}
              </div>
              <Figure style={{ marginTop: '1.2rem' }} src="/datasets/figures/lb100-cross-subject.webp" alt="Per-subject bars showing improvement for all 32 subjects when trained with subject 0" caption={<span style={{ color: '#8a85a0' }}>Per-subject results (paper Fig. 4): the improvement is consistent across all 32 subjects. Chance = 0.2, p &lt; .001.</span>} />
            </Reveal>
          </div>

          <div className="ds-cols-2" style={{ marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}>
            <Reveal>
              <div className="ds-label">Task 3 · efficiency</div>
              <h3 className="ds-h3" style={{ marginTop: 6 }}>How little data does a new person need?</h3>
              <p className="ds-p-sm" style={{ color: '#a29db8' }}>
                Cut each new subject&apos;s fine-tuning data to half, then a quarter. Accuracy barely moves. Most of the performance comes from transfer, which puts ~10 minutes of recording in
                clinically interesting territory.
              </p>
              <Seg value={String(eff) as '0' | '1' | '2'} onChange={v => setEff(+v)} ariaLabel="Fine-tuning data" options={EFF.map((e, i) => ({ v: String(i) as '0' | '1' | '2', label: `${e.pct} · ${e.min}` }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.2rem' }}>
                {[['with sub-0', EFF[eff].w, '#a855f7'], ['without sub-0', EFF[eff].wo, '#6b6582']].map(([l, v, c]) => (
                  <div key={l as string}>
                    <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 46, color: '#fff', lineHeight: 1, transition: 'all 0.3s' }}>{((v as number) * 100).toFixed(1)}%</div>
                    <div className="ds-label" style={{ marginTop: 4 }}>{l}</div>
                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', marginTop: 10 }}>
                      <div style={{ height: '100%', width: `${((v as number) / 0.6) * 100}%`, background: c as string, borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="ds-note">12 / 10 / 10 subjects at 100 / 50 / 25% of their fine-tuning data (paper Fig. 5). No difference between budgets is significant.</p>
            </Reveal>
            <Reveal delay={100}>
              <div className="ds-label">Supplementary</div>
              <h3 className="ds-h3" style={{ marginTop: 6 }}>Different regimes, different winners</h3>
              <Seg value={cmp} onChange={setCmp} ariaLabel="Comparison" options={[{ v: 'model', label: 'Supervised vs pre-trained' }, { v: 'ovmi', label: 'vs. a surgical BCI' }]} />
              {cmp === 'model' ? (
                <>
                  <p className="ds-p-sm" style={{ color: '#a29db8', marginTop: '0.9rem' }}>
                    With deep data, a supervised model trained from scratch (d&apos;Ascoli et al.) beats pre-trained MEG-XL. With shallow per-subject data, MEG-XL&apos;s pre-trained priors win.
                  </p>
                  <GroupedBars key="m" dark yMax={0.8} chance={0.2} height={260} groups={[
                    { label: 'sub-0 (deep)', bars: [{ name: 'MEG-XL', value: 0.585, color: '#4a7bd0' }, { name: "d'Ascoli (supervised)", value: 0.739, color: '#4a7bd0', hatch: true }] },
                    { label: 'sub-1…32 (broad)', bars: [{ name: 'MEG-XL', value: 0.478, color: '#e8a838' }, { name: "d'Ascoli (supervised)", value: 0.328, color: '#e8a838', hatch: true }] },
                  ]} />
                </>
              ) : (
                <>
                  <p className="ds-p-sm" style={{ color: '#a29db8', marginTop: '0.9rem' }}>
                    Information transfer in bits per word attempt (<Link href="/blog/what-can-speech-brain-computer-interfaces-communicate/" className="ds-link-arrow" style={{ fontSize: 'inherit', color: '#c4b5fd' }}>OVMI</Link>), against the landmark
                    implanted 50-word BCI of Moses et al. (2021). Read with care: this is heard speech, not attempted speech.
                  </p>
                  <GroupedBars key="o" dark yMax={0.4} height={260} yLabel="OVMI (bits / word)" groups={[
                    { label: 'Moses et al. (ECoG)', bars: [{ name: 'Moses et al., V=50', value: 0.259, color: '#e8a838', hatch: true }] },
                    { label: 'MEG-XL, V=50', bars: [{ name: 'MEG-XL', value: 0.075, color: '#4a7bd0' }] },
                    { label: 'MEG-XL, V=32 (optimised)', bars: [{ name: 'MEG-XL', value: 0.147, color: '#4a7bd0' }] },
                  ]} />
                </>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 08 ECOSYSTEM ──────────────────────────────── */}
      <section id="ecosystem" className="ds-section ds-section-tint" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="08" kicker="Ecosystem" title={<>Shared infrastructure, <em>compounding</em></>}>
            <p className="ds-p">
              Like ImageNet, a benchmark&apos;s value compounds as more methods are measured against it. LibriBrain100 shipped with the 2026 PNPL Competition: word classification in a
              <b> Deep</b> track (sub-0) and a <b>Broad</b> track (the 32 new subjects, with fine-tuning data shrinking towards clinical scale), scored by top-10 balanced accuracy on
              holdout data recorded with entirely new stimuli.
            </p>
          </SectionHead>
          <div className="ds-cols-2">
            <Reveal>
              <div className="ds-panel" style={{ padding: '1.6rem' }}>
                <div className="ds-glow" style={{ width: 260, height: 260, background: '#7c3aed', right: -80, top: -80, opacity: 0.35 }} />
                <div className="ds-label" style={{ position: 'relative' }}>The 2026 PNPL Competition</div>
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.2rem 0' }}>
                  {[['Deep', 'One deeply sampled subject. How far can accuracy go?', '/editions/2026/tracks/'], ['Broad', '32 subjects with little data each. How fast can you adapt?', '/editions/2026/tracks/']].map(([t, d, h]) => (
                    <Link key={t} href={h} className="ds-card ds-card-dark" style={{ textDecoration: 'none' }}>
                      <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 34, color: '#fff', lineHeight: 1 }}>{t}</div>
                      <div style={{ fontSize: 13.5, color: '#a29db8', marginTop: 6, lineHeight: 1.5 }}>{d}</div>
                    </Link>
                  ))}
                </div>
                <div className="ds-btns" style={{ position: 'relative' }}>
                  <Link className="ds-btn ds-btn-dark" href="/">2026 edition {Icon.arrow}</Link>
                  <Link className="ds-btn ds-btn-dark" href="/editions/2026/leaderboard/">Leaderboard</Link>
                  <Link className="ds-btn ds-btn-dark" href="/blog/brain-to-text-decoding-with-meg-xl/">MEG-XL baseline post</Link>
                </div>
              </div>
              <Downloads />
            </Reveal>
            <Reveal delay={100}><EcosystemTimeline highlight="libribrain100" /></Reveal>
          </div>
        </div>
      </section>

      {/* ── 09 GET STARTED ────────────────────────────── */}
      <section id="start" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="09" kicker="Get started" title={<>Download only <em>what you need</em></>}>
            <p className="ds-p">
              At ~104 hours, the full dataset is hundreds of gigabytes even when serialised. The <code>LibriBrain100</code> loader takes <code>subjects=</code>, <code>corpus=</code> and
              <code> partition=</code> selectors, fetches each record from whichever Hugging Face repository holds it, and rejects impossible combinations before downloading anything.
              Build a query:
            </p>
          </SectionHead>
          <Reveal><LoaderPlayground /></Reveal>
          <div className="ds-cols-2" style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
            <Reveal>
              <h3 className="ds-h3">Two formats</h3>
              <p className="ds-p-sm">
                <b>Serialised:</b> minimally preprocessed (head motion, SSS, notch, 0.1–125 Hz, 250 Hz) float32 HDF5 plus event TSVs, ready for ML. <b>Raw BIDS:</b> one BIDS dataset per
                corpus with unprocessed 1 kHz FIF files, for neuroscientists who want their own pipeline. Per-task wrappers (<code>LibriBrain100Speech</code>, <code>LibriBrain100Phoneme</code>,
                <code> LibriBrain100Word</code>) are available too.
              </p>
              <p className="ds-p-sm">
                Note: until the 2026 competition concludes, parts of the broad Sherlock data (sub-13…32) and the Sherlock 1 BIDS files are embargoed to prevent leakage. They will be
                released afterwards.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="ds-h3">Cite LibriBrain100</h3>
              <CodeBlock code={BIBTEX} lang="bibtex" />
              <p className="ds-note">Building on LibriBrain? Please cite <Link href="/datasets/libribrain/#start" className="ds-link-arrow" style={{ fontSize: 12.5 }}>the original paper</Link> too.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
