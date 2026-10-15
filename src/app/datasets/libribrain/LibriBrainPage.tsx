'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MegPlayer from '../_components/MegPlayer';
import SensorHelmet from '../_components/SensorHelmet';
import EvokedExplorer from '../_components/EvokedExplorer';
import Landscape from '../_components/Landscape';
import Bookshelf from '../_components/Bookshelf';
import { PipelineStepper, SplitStrip } from '../_components/Recording';
import { PhonemeInventory, ZipfExplorer } from '../_components/Linguistics';
import { LineChart } from '../_components/charts';
import { CodeBlock, Figure, Icon, PageToc, Reveal, SectionHead, Seg, Stat } from '../_components/ui';
import { EcosystemTimeline, Downloads } from '../_components/Ecosystem';

const DIR = '/datasets/libribrain';

const TOC = [
  { id: 'listen', label: 'Listen' },
  { id: 'depth', label: 'Why depth' },
  { id: 'canon', label: 'The canon' },
  { id: 'recording', label: 'Recording' },
  { id: 'annotations', label: 'Annotations' },
  { id: 'signal', label: 'Inside the signal' },
  { id: 'benchmarks', label: 'Benchmarks' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'start', label: 'Get started' },
];

const HERO_ACCENT = [196, 181, 253];
const HERO_HOT = [251, 113, 133];

const QUICKSTART = `# pip install pnpl
from pnpl.datasets import LibriBrainSpeech, LibriBrainPhoneme

# Speech detection: 1 = someone is speaking, 0 = silence, per 4 ms sample
speech = LibriBrainSpeech(data_path="./data/", partition="train", download=True)

# Phoneme classification: MEG windows time-locked to each of 39 ARPAbet phonemes
phonemes = LibriBrainPhoneme(data_path="./data/", partition="train")

x, y = phonemes[0]
print(x.shape, y)   # (306, T) sensors × time, integer phoneme label`;

const BIBTEX = `@article{ozdogan2025libribrain,
  author  = {Özdogan, Miran and Landau, Gilad and Elvers, Gereon and Jayalath, Dulhan and Somaiya, Pratik and Mantegna, Francesco and Woolrich, Mark and Parker Jones, Oiwi},
  title   = {{LibriBrain}: Over 50 Hours of Within-Subject {MEG} to Improve Speech Decoding Methods at Scale},
  journal = {Advances in Neural Information Processing Systems (NeurIPS), Datasets and Benchmarks Track},
  year    = {2025},
  url     = {https://arxiv.org/abs/2506.02098},
}`;

const EVENTS_SAMPLE: string[][] = [
  ['silence', '', '28.772', '1.188'],
  ['word', 'A', '30.086', '0.100'],
  ['phoneme', 'ah_S', '30.086', '0.100'],
  ['word', 'Study', '30.186', '0.370'],
  ['phoneme', 's_B', '30.186', '0.080'],
  ['phoneme', 't_I', '30.266', '0.080'],
  ['phoneme', 'ah_I', '30.346', '0.080'],
  ['phoneme', 'd_I', '30.426', '0.060'],
  ['phoneme', 'iy_E', '30.486', '0.070'],
  ['word', 'in', '30.556', '0.140'],
  ['word', 'Scarlet', '30.696', '0.590'],
];

/* Scaling curves, digitised from Fig. 3 of Özdogan et al. (2025): values are approximate. */
const SCALING = {
  speech: {
    label: 'Speech detection', y: 'F1', yMin: 0.87, yMax: 0.9, yTicks: [0.87, 0.88, 0.89, 0.9], chance: undefined as number | undefined,
    series: [{ name: 'Baseline CNN', color: '#7c3aed', points: [[2.6, 0.8766], [5.2, 0.8813], [10.4, 0.8849], [20.9, 0.8838], [31.2, 0.888], [41.6, 0.894], [52, 0.8934]] as [number, number][] }],
  },
  phoneme: {
    label: 'Phoneme classification', y: 'Micro-F1', yMin: 0.08, yMax: 0.12, yTicks: [0.08, 0.09, 0.1, 0.11, 0.12], chance: undefined as number | undefined,
    series: [{ name: 'Baseline CNN', color: '#7c3aed', points: [[2.6, 0.0905], [5.2, 0.0962], [10.4, 0.1098], [20.9, 0.1142], [31.2, 0.1147], [41.6, 0.116], [52, 0.1184]] as [number, number][] }],
  },
  word: {
    label: 'Word classification', y: 'Top-10 bal. acc.', yMin: 0, yMax: 0.4, yTicks: [0, 0.1, 0.2, 0.3, 0.4], chance: 0.04,
    series: [
      { name: 'LibriBrain', color: '#7c3aed', points: [[0.5, 0.04], [2.07, 0.054], [5.2, 0.225], [10.5, 0.311], [26, 0.346], [52, 0.367]] as [number, number][] },
      { name: 'Armeni et al.', color: '#e8a838', points: [[0.5, 0.04], [2.07, 0.039], [5.2, 0.057], [10.5, 0.233], [26, 0.312], [52, 0.329]] as [number, number][] },
    ],
  },
};

const AVERAGING: [number, number][] = [[5, 0.181], [10, 0.251], [20, 0.38], [50, 0.529], [100, 0.686], [200, 0.805], [400, 0.881]];

export default function LibriBrainPage() {
  const [task, setTask] = useState<'speech' | 'phoneme' | 'word'>('word');
  const [avgI, setAvgI] = useState(4);
  const sc = SCALING[task];

  return (
    <>
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="ds-hero">
        <div className="hero-blob" style={{ width: 520, height: 520, background: '#c4b5fd', top: -160, right: '8%', opacity: 0.35, animation: 'blobFloat1 14s ease-in-out infinite' }} />
        <div className="hero-blob" style={{ width: 420, height: 420, background: '#fecdd3', bottom: -120, left: '-6%', opacity: 0.4, animation: 'blobFloat2 16s ease-in-out infinite' }} />
        <div className="ds-wrap">
          <div className="ds-hero-grid">
            <Reveal>
              <span className="ds-kicker">Dataset · NeurIPS 2025 Datasets &amp; Benchmarks</span>
              <h1 className="ds-title">Libri<em>Brain</em></h1>
              <p className="ds-lede">
                <strong>Over 50 hours of one person&apos;s brain</strong>, recorded with magnetoencephalography (MEG) while listening to almost the whole Sherlock Holmes canon.
                At release it was the deepest within-subject non-invasive speech dataset ever made public: 5× larger than the next and 50× larger than most.
              </p>
              <div className="ds-btns">
                <a className="ds-btn ds-btn-primary" href="https://huggingface.co/datasets/pnpl/LibriBrain" target="_blank" rel="noopener noreferrer">{Icon.hf}Hugging Face</a>
                <a className="ds-btn" href="https://arxiv.org/abs/2506.02098" target="_blank" rel="noopener noreferrer">{Icon.paper}Paper</a>
                <a className="ds-btn" href="https://github.com/neural-processing-lab/pnpl" target="_blank" rel="noopener noreferrer">{Icon.code}pnpl library</a>
                <Link className="ds-btn" href="/editions/2025/">{Icon.trophy}2025 Competition</Link>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="ds-panel" style={{ padding: '0.4rem 0 1rem' }}>
                <div className="ds-glow" style={{ width: 300, height: 300, background: '#6d28d9', top: '20%', left: '25%', opacity: 0.35 }} />
                <SensorHelmet dir={DIR} height={400} accent={HERO_ACCENT} hot={HERO_HOT} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1.2rem', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
                  <span className="ds-label">102 sensor sites · 306 SQUIDs</span>
                  <span className="ds-label" style={{ color: '#fb7185' }}>● glow = real gradiometer power</span>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="ds-stats">
            <Stat value={52.3} digits={1} unit="h" label="of MEG from a single participant" />
            <Stat value={306} label="sensors: 102 magnetometers, 204 gradiometers" />
            <Stat value={466} suffix="k" label="words heard (train / val / test)" />
            <Stat value={1.5} digits={1} suffix="M" label="time-aligned phonemes" />
            <Stat value={50} suffix="K+" label="downloads on Hugging Face" />
          </div>
        </div>
      </section>

      <PageToc items={TOC} />

      {/* ── 01 LISTEN ─────────────────────────────────── */}
      <section id="listen" className="ds-section ds-section-dark" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="01" kicker="Listen" title={<>Watch the brain <em>listen</em></>}>
            <p className="ds-p">
              Press play. This is real LibriBrain data: the first minute of Chapter 1 of <i>A Study in Scarlet</i>, as heard by our participant inside the scanner.
              You hear the audiobook. Above it, the transcript and its forced-aligned phonemes light up. Below it, eight of the 306 MEG channels and a live top-down
              map of the magnetic field over the head run in sync.
            </p>
          </SectionHead>
          <Reveal><MegPlayer dir={DIR} title="“In the year 1878 I took my degree of Doctor of Medicine…”" /></Reveal>
          <Reveal>
            <div className="ds-cols" style={{ marginTop: '2rem' }}>
              <div>
                <h3 className="ds-h3" style={{ color: '#fff' }}>What you are seeing</h3>
                <p className="ds-p-sm" style={{ color: '#a29db8' }}>
                  <b style={{ color: '#fff' }}>Field</b> maps show the signed magnetometer reading: red where flux leaves the head, blue where it enters.
                  <b style={{ color: '#fff' }}> Power</b> maps combine each pair of planar gradiometers, which peak <i>directly above</i> active cortex.
                  Watch the left and right edges (auditory cortex) during speech.
                </p>
              </div>
              <div>
                <h3 className="ds-h3" style={{ color: '#fff' }}>The data behind it</h3>
                <p className="ds-p-sm" style={{ color: '#a29db8' }}>
                  For this page the 250 Hz release was filtered to 0.5–20 Hz, z-scored per sensor and shown at 50 Hz. The audio is re-timed onto the MEG clock using the event
                  file, because the chapter was presented in short segments with brief gaps between them.
                </p>
              </div>
              <div>
                <h3 className="ds-h3" style={{ color: '#fff' }}>Why it looks noisy</h3>
                <p className="ds-p-sm" style={{ color: '#a29db8' }}>
                  A single word evokes a field roughly a billion times weaker than Earth&apos;s, buried in ongoing activity. Decoding it from one trial is the hard problem.
                  Averaging thousands of trials (section 06) makes it visible. Dozens of hours of data are what let models learn it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 02 DEPTH ──────────────────────────────────── */}
      <section id="depth" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <div className="ds-cols-2">
            <SectionHead num="02" kicker="Why depth" title={<>One brain, <em>fifty hours</em></>}>
              <p className="ds-p">
                Surgically implanted speech BCIs now decode attempted speech from paralysed patients with word error rates below 5%. They get there with dozens of hours of data
                <i> per person</i>. Non-invasive datasets, by contrast, have mostly been <b>broad but shallow</b>: many participants, one or two hours each.
              </p>
              <p className="ds-p">
                Yet when total hours are matched, decoders trained on <i>deep</i> single-subject data tend to beat those trained on broad pools (d&apos;Ascoli et al.). LibriBrain bets on
                depth: one healthy, native English-speaking volunteer recorded across 95 sessions, more than 5× the previous deepest MEG speech dataset.
              </p>
            </SectionHead>
            <Reveal delay={100}>
              <Landscape initialStep={1} maxStep={1} />
              <p className="ds-note">Hover a bubble for details. Values are from Table 1 of the LibriBrain paper; LibriBrain100 extends this picture (see the <Link href="/datasets/libribrain100/" className="ds-link-arrow" style={{ fontSize: 12.5 }}>LibriBrain100 page</Link>).</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 03 CANON ──────────────────────────────────── */}
      <section id="canon" className="ds-section ds-section-tint" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="03" kicker="The canon" title={<>Seven books, <em>one narrator</em></>}>
            <p className="ds-p">
              Inspired by LibriSpeech, every stimulus comes from <a href="https://librivox.org/" target="_blank" rel="noopener noreferrer">LibriVox</a>, so both audio and text are in the public domain.
              Our participant heard the first seven Sherlock Holmes books in publication order, one chapter per run, all read by David Clarke in a General British accent.
              As with a single-speaker ASR corpus, holding the voice fixed minimises acoustic variance so models can focus on the brain.
            </p>
          </SectionHead>
          <Reveal><Bookshelf upTo={7} /></Reveal>

          <div className="ds-cols-2" style={{ marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}>
            <Reveal>
              <h3 className="ds-h3">Splits designed against leakage</h3>
              <p className="ds-p-sm">
                MNIST, CIFAR and ImageNet made progress measurable through shared splits. In neuroimaging, test data drawn from the same session as training data can leak through slow
                drifts, the &ldquo;nonsense correlations&rdquo;. So all held-out data were recorded in a <b>separate scanning session on a different day</b>: Chapter 11 is validation,
                Chapter 12 is test, and Chapters 13–14 were held back for the 2025 competition.
              </p>
              <SplitStrip variant="libribrain" />
            </Reveal>
            <Reveal delay={100}>
              <div className="ds-table-wrap">
                <table className="ds-table">
                  <thead><tr><th>Split</th><th className="num">Words</th><th className="num">Unique</th><th className="num">Phonemes</th><th className="num">Sessions</th><th className="num">Hours</th></tr></thead>
                  <tbody>
                    <tr><td>Train</td><td className="num">459,227</td><td className="num">16,753</td><td className="num">1,488,392</td><td className="num">91</td><td className="num">51.57</td></tr>
                    <tr><td>Validation</td><td className="num">3,427</td><td className="num">1,082</td><td className="num">11,289</td><td className="num">1</td><td className="num">0.36</td></tr>
                    <tr><td>Test</td><td className="num">3,576</td><td className="num">1,145</td><td className="num">12,051</td><td className="num">1</td><td className="num">0.38</td></tr>
                    <tr className="hl"><td>Total</td><td className="num">466,230</td><td className="num">16,892</td><td className="num">1,511,732</td><td className="num">93</td><td className="num">52.32</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="ds-note">Table 3 of the paper. The two competition-holdout sessions (≈41 min) are excluded.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 04 RECORDING ──────────────────────────────── */}
      <section id="recording" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="04" kicker="Recording" title={<>From magnetic whispers <em>to tensors</em></>}>
            <p className="ds-p">
              MEG measures the tiny magnetic fields produced by synchronised currents in cortex, using superconducting sensors (SQUIDs) bathed in liquid helium. It has millisecond
              timing like EEG, but the skull barely distorts magnetic fields, so the spatial picture is sharper. Everything was recorded at the Oxford Centre for Human Brain Activity (OHBA).
            </p>
          </SectionHead>
          <div className="ds-cols-2">
            <Reveal>
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                {[
                  ['Scanner', 'MEGIN TRIUX™ neo, 102 magnetometers + 204 orthogonal planar gradiometers, in a magnetically shielded room.'],
                  ['Head', 'Head shape digitised with a Polhemus Fastrak (fiducials + ~250 scalp points). Five HPI coils track the head continuously, and it is repositioned to within millimetres each session.'],
                  ['Physiology', 'Bipolar EOG (eyes), ECG (heart) and EMG at jaw and lips record eye, heart and articulator activity, so these artefacts can be audited.'],
                  ['Sessions', 'About 3 h each, 3–5 chapters, at least a day apart. After every chapter, a two-alternative comprehension question (“Where is the body of the murder victim found?”) checks that the participant was listening.'],
                  ['Delivery', 'PsychoPy, binaural tube earphones at ~70 dB SPL, parallel-port triggers marking every segment onset with millisecond precision.'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: '1rem', paddingBottom: '0.9rem', borderBottom: '1px solid var(--ds-line)' }}>
                    <span className="ds-label" style={{ paddingTop: 3 }}>{k}</span>
                    <span style={{ fontSize: 15, lineHeight: 1.6 }}>{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <PipelineStepper />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 05 ANNOTATIONS ────────────────────────────── */}
      <section id="annotations" className="ds-section ds-section-tint" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="05" kicker="Annotations" title={<>200 hours of <em>painstaking</em> labelling</>}>
            <p className="ds-p">
              Labels make a dataset. Each chapter was first cut into utterances by voice-activity detection in Praat (59 dB threshold, at least 600 ms), then corrected by hand:
              recovering clipped plosives, reconciling text with what the narrator actually said, and normalising numbers (is “1066” <i>ten sixty-six</i> or <i>one thousand and sixty-six</i>?).
              Short utterance–text pairs were then force-aligned with Gentle and spot-checked against spectrograms. That brought out-of-vocabulary labels down to about 3.5% per chapter.
            </p>
          </SectionHead>
          <div className="ds-cols-2">
            <Reveal>
              <div className="ds-label" style={{ marginBottom: 8 }}>sub-0_ses-1_task-Sherlock1_run-1_events.tsv</div>
              <div className="ds-table-wrap">
                <table className="ds-table" style={{ fontFamily: 'var(--ds-mono)', fontSize: 12.5 }}>
                  <thead><tr><th>kind</th><th>segment</th><th className="num">onset (s)</th><th className="num">duration</th></tr></thead>
                  <tbody>
                    {EVENTS_SAMPLE.map((r, i) => (
                      <tr key={i} style={{ background: r[0] === 'word' ? 'var(--ds-violet-ll)' : r[0] === 'silence' ? '#f4f3f7' : undefined }}>
                        <td style={{ color: r[0] === 'word' ? 'var(--ds-violet-d)' : r[0] === 'phoneme' ? '#c2410c' : 'var(--ds-muted)' }}>{r[0]}</td>
                        <td style={{ fontWeight: r[0] === 'word' ? 700 : 400 }}>{r[1]}</td><td className="num">{r[2]}</td><td className="num">{r[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="ds-note">The first rows of the very first session. Real event files also carry sentence and word indices and timings relative to the chapter.</p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="ds-h3">Reading an event file</h3>
              <p className="ds-p-sm">
                Every session ships with a TSV of time-stamped <b>silences</b>, <b>words</b> and <b>phonemes</b> in 39-symbol ARPAbet. Phoneme suffixes follow Kaldi&apos;s convention for
                position in the word: <code>_B</code>egin, <code>_I</code>nside, <code>_E</code>nd, <code>_S</code>ingleton. So <code>s_B t_I ah_I d_I iy_E</code> spells out <i>Study</i>.
              </p>
              <h3 className="ds-h3" style={{ marginTop: '1.4rem' }}>No fudge factor</h3>
              <p className="ds-p-sm">
                Brain responses lag the sound, as the signal travels from cochlea to brainstem, thalamus and cortex, and the lag differs across regions and processing stages. Rather than
                imposing one offset, the onsets are kept at the true audio times, so you can model the latency or let your network learn it.
              </p>
              <Figure src="/datasets/figures/lb-teaser.webp" alt="Overview figure of the LibriBrain dataset: scanner illustration, aligned annotation of a sentence with MEG time series, word frequency distribution, vowel chart and consonant chart." caption={<><b>Figure 1 of the paper.</b> The annotation of “A Study in Scarlet by Sir Arthur Conan Doyle”, aligned to audio and MEG.</>} style={{ marginTop: '1.2rem' }} />
            </Reveal>
          </div>

          <Reveal style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
            <h3 className="ds-h3">The sounds of Sherlock</h3>
            <p className="ds-p-sm" style={{ maxWidth: 720 }}>All 39 phonemes in the canon, each sized by how often our participant heard it. We computed these counts for this page from the released event files for books 1–7.</p>
            <PhonemeInventory />
          </Reveal>

          <Reveal style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
            <div className="ds-cols-2">
              <div>
                <h3 className="ds-h3">A long-tailed vocabulary</h3>
                <p className="ds-p-sm">
                  Word frequencies follow Zipf&apos;s law: a handful of function words (&ldquo;the&rdquo;, &ldquo;and&rdquo;, &ldquo;I&rdquo;) dominate, while 6,420 of the 17,348
                  distinct words, more than a third of the vocabulary, are heard exactly once. That is why word-classification benchmarks restrict themselves to the most frequent words, and why they
                  report <i>balanced</i> accuracy so that rare classes count.
                </p>
                <p className="ds-p-sm">Slide the cut-off to see how much of the text a fixed vocabulary covers.</p>
              </div>
              <ZipfExplorer />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 06 SIGNAL ─────────────────────────────────── */}
      <section id="signal" className="ds-section ds-section-dark" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="06" kicker="Inside the signal" title={<>Thousands of words, <em>averaged</em></>}>
            <p className="ds-p">
              One word is invisible in the noise, but thousands are not. Here we averaged the MEG time-locked to every word onset in one chapter, and cross-correlated the
              sensors with the loudness envelope of the narration. Both are classic auditory neuroscience, computed for this page from a single 18-minute session of LibriBrain.
            </p>
          </SectionHead>
          <Reveal><EvokedExplorer dir={DIR} /></Reveal>
          <Reveal>
            <div style={{ marginTop: '2.5rem' }}>
              <Figure src="/datasets/figures/lb-signal.webp" alt="Speech versus non-speech: RMS topography, inter-trial phase coherence, and power spectra." caption={<><b>From the LibriBrain paper:</b> speech vs. silence. (A) stronger evoked amplitude over bilateral temporal sensors, (B) more phase-locking at 1–7 Hz, (C) more delta–theta power during speech.</>} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 07 BENCHMARKS ─────────────────────────────── */}
      <section id="benchmarks" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="07" kicker="Benchmarks" title={<>A curriculum of <em>decoding tasks</em></>}>
            <p className="ds-p">
              Full brain-to-text from non-invasive recordings is still mostly out of reach. LibriBrain therefore defines a ladder of tasks, each a building block of a speech BCI,
              with standard splits, baselines and permutation tests. All baselines beat chance with <i>p</i> &lt; 0.01.
            </p>
          </SectionHead>
          <div className="ds-cols">
            {[
              { n: 'I', t: 'Speech detection', d: 'Is the participant hearing speech right now? Binary, per 4 ms sample.', m: [['F1', '0.899', '0.785'], ['AUROC', '0.864', '0.500'], ['Bal. acc.', '0.708', '0.499']] },
              { n: 'II', t: 'Phoneme classification', d: 'Which of 39 ARPAbet phonemes was just heard? A pillar of invasive speech decoders.', m: [['Micro-F1', '0.117', '0.044'], ['Macro AUROC', '0.653', '0.500'], ['Bal. acc.', '0.040', '0.026']] },
              { n: 'III', t: 'Word classification', d: 'Which of the 250 most frequent words was heard? Following d’Ascoli et al. and Jayalath et al.', m: [['Top-10 bal. acc.', '0.362', '0.040'], ['vs. Armeni', '0.326', ''], ['Coverage', '67.9%', '']] },
            ].map((c, k) => (
              <Reveal key={c.t} delay={k * 100}>
                <div className="ds-card" style={{ height: '100%' }}>
                  <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 40, color: 'var(--ds-violet-l)', lineHeight: 1 }}>{c.n}</div>
                  <h3 className="ds-h3" style={{ marginTop: '0.4rem' }}>{c.t}</h3>
                  <p className="ds-p-sm">{c.d}</p>
                  <table className="ds-table" style={{ fontSize: 13 }}>
                    <thead><tr><th>Metric</th><th className="num">Model</th><th className="num">Chance</th></tr></thead>
                    <tbody>{c.m.map(([a, b, d]) => <tr key={a}><td>{a}</td><td className="num" style={{ fontWeight: 650, color: 'var(--ds-ink)' }}>{b}</td><td className="num">{d}</td></tr>)}</tbody>
                  </table>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="ds-note">Speech and phoneme: mean over 10 seeds with a SEANet-inspired CNN. Words: reproduced from Jayalath et al. (2025), where the top-250 vocabulary covers 67.9% of the text.</p>

          <div className="ds-cols-2" style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
            <Reveal>
              <h3 className="ds-h3">No plateau in sight</h3>
              <p className="ds-p-sm">
                Train on random subsets of the training split and every task keeps improving roughly log-linearly with hours of data, the familiar scaling behaviour of other ML domains.
                For word classification, LibriBrain beats the previous deepest dataset (Armeni et al.) at every matched budget.
              </p>
              <Seg value={task} onChange={setTask} ariaLabel="Task" options={[{ v: 'speech', label: 'Speech' }, { v: 'phoneme', label: 'Phoneme' }, { v: 'word', label: 'Word' }]} />
              <div style={{ marginTop: '1rem' }}>
                <LineChart key={task} series={sc.series} logX xLabel="Training hours" yLabel={sc.y} yMin={sc.yMin} yMax={sc.yMax} xTicks={[1, 2, 5, 10, 20, 50]} yTicks={sc.yTicks} chance={sc.chance} yFmt={v => (task === 'word' ? v.toFixed(1) : v.toFixed(2))} />
              </div>
              <p className="ds-note">Read off Fig. 3 of the paper, so values are approximate. Word results from Jayalath et al. (2025).</p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="ds-h3">Repetition as a BCI strategy</h3>
              <p className="ds-p-sm">
                A user of a speech BCI could simply say things more than once. Averaging the MEG of several instances of the same phoneme before classifying them simulates exactly that,
                and accuracy climbs steeply.
              </p>
              <div className="ds-card" style={{ background: 'var(--ds-paper)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div className="ds-label">Averaging</div>
                    <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 52, color: 'var(--ds-ink)', lineHeight: 1 }}>{AVERAGING[avgI][0]}<span style={{ fontSize: 20, color: 'var(--ds-muted)' }}> repetitions</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="ds-label">Phoneme accuracy</div>
                    <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 52, color: 'var(--ds-violet)', lineHeight: 1 }}>{Math.round(AVERAGING[avgI][1] * 100)}%</div>
                  </div>
                </div>
                <input type="range" className="ds-range" min={0} max={AVERAGING.length - 1} value={avgI} onChange={e => setAvgI(+e.target.value)} style={{ marginTop: '1.2rem' }} aria-label="Number of averaged samples" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: 3, marginTop: '1.2rem' }} aria-hidden>
                  {Array.from({ length: 100 }, (_, k) => (
                    <span key={k} style={{ aspectRatio: '1', borderRadius: 2, background: k < Math.round(AVERAGING[avgI][1] * 100) ? 'var(--ds-violet)' : 'var(--ds-line)', transition: `background 0.3s ${k * 4}ms` }} />
                  ))}
                </div>
                <p className="ds-note">Each square is one in a hundred test phonemes, filled when correctly classified (micro-F1). Random baseline ≈ 4–9%. Read off Fig. 4 of the paper.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 08 ECOSYSTEM ──────────────────────────────── */}
      <section id="ecosystem" className="ds-section ds-section-tint" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="08" kicker="Ecosystem" title={<>More than a dataset: <em>shared infrastructure</em></>}>
            <p className="ds-p">
              LibriBrain launched together with an open competition, a Python library and a public leaderboard. A year on, it underpins work on speech detection, phoneme and word decoding,
              keyword spotting and full brain-to-text, and has been downloaded more than fifty thousand times.
            </p>
          </SectionHead>
          <div className="ds-cols-2">
            <Reveal>
              <div className="ds-panel" style={{ padding: '1.6rem' }}>
                <div className="ds-glow" style={{ width: 260, height: 260, background: '#7c3aed', right: -80, top: -80, opacity: 0.35 }} />
                <div className="ds-label" style={{ position: 'relative' }}>The 2025 PNPL Competition · NeurIPS 2025 Competition Track</div>
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', margin: '1.2rem 0' }}>
                  {[['155', 'registered teams'], ['6,041', 'submissions'], ['95.6%', 'top speech-detection F1-macro (baseline 68%)'], ['73.6%', 'top phoneme F1-macro (baseline 44%)']].map(([v, l]) => (
                    <div key={l}>
                      <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 44, color: '#fff', lineHeight: 1 }}>{v}</div>
                      <div style={{ fontSize: 13, color: '#a29db8', marginTop: 4, lineHeight: 1.4 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <p className="ds-p-sm" style={{ color: '#a29db8', position: 'relative' }}>
                  Winning entries converged on temporal CNN/TCN backbones with recurrent or attention heads, plus smoothing and ensembling. A hidden balanced-class track showed that
                  speech detectors leaned on class priors, a lesson about matching evaluation to deployment.
                </p>
                <div className="ds-btns" style={{ position: 'relative' }}>
                  <Link className="ds-btn ds-btn-dark" href="/editions/2025/">2025 edition {Icon.arrow}</Link>
                  <Link className="ds-btn ds-btn-dark" href="/editions/2025/leaderboard/">Leaderboard</Link>
                </div>
              </div>
              <Downloads />
            </Reveal>
            <Reveal delay={100}>
              <EcosystemTimeline highlight="libribrain" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 09 GET STARTED ────────────────────────────── */}
      <section id="start" className="ds-section" style={{ scrollMarginTop: 100 }}>
        <div className="ds-wrap">
          <SectionHead num="09" kicker="Get started" title={<>Your first tensor <em>in two lines</em></>}>
            <p className="ds-p">
              The <code>pnpl</code> library downloads exactly the sessions you ask for from Hugging Face and hands you PyTorch datasets with the standard splits. You need no
              neuroimaging background. The raw FIF recordings in BIDS are there too, for those who want their own preprocessing.
            </p>
          </SectionHead>
          <div className="ds-cols-2">
            <Reveal>
              <CodeBlock code={QUICKSTART} />
              <div className="ds-card" style={{ marginTop: '1.2rem' }}>
                <div className="ds-label" style={{ marginBottom: 8 }}>Repository layout · huggingface.co/datasets/pnpl/LibriBrain</div>
                <pre style={{ margin: 0, fontFamily: 'var(--ds-mono)', fontSize: 12.5, lineHeight: 1.75, color: 'var(--ds-text)', overflowX: 'auto' }}>{`Sherlock{1..7}/
├── derivatives/serialised/*.h5   306 × T float32 @ 250 Hz
├── derivatives/events/*.tsv      words · phonemes · silences
├── stimuli/audio/*.wav           the LibriVox chapters
└── sub-0/ses-*/meg/*.fif         raw BIDS recordings
metadata/
├── channels.tsv                  sensor names & types
└── sensor_xyz.json               (306, 3) positions`}</pre>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="ds-h3">Cite LibriBrain</h3>
              <CodeBlock code={BIBTEX} lang="bibtex" />
              <div className="ds-card" style={{ marginTop: '1.2rem', borderColor: 'rgba(124,58,237,0.25)', background: 'linear-gradient(135deg, #faf8ff, #fff)' }}>
                <div className="ds-label">What came next</div>
                <h3 style={{ fontFamily: 'var(--ds-serif)', fontWeight: 400, fontSize: 30, color: 'var(--ds-ink)', margin: '0.3rem 0 0.5rem', lineHeight: 1.1 }}>LibriBrain<em style={{ color: 'var(--ds-violet)' }}>100</em></h3>
                <p className="ds-p-sm">
                  The paper listed LibriBrain&apos;s limits honestly: a single subject, a single genre, and passive listening. LibriBrain100 tackles the first two. It completes the canon,
                  adds TIMIT, MOCHA-TIMIT and podcasts, deepens subject 0 to ~80 h, and adds 32 new participants, for over 100 hours in total.
                </p>
                <Link href="/datasets/libribrain100/" className="ds-btn ds-btn-primary">Explore LibriBrain100 {Icon.arrow}</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
