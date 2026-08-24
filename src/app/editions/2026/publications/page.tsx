'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import { assetPath } from '../../../../lib/assetPath';

interface Publication {
  title: string;
  authors: string;
  venue: string;
  abstract: string;
  pdf: string;
  arxiv?: string;
  bibtex: string;
  label: string;
}

const publications: Publication[] = [
  {
    title: 'LibriBrain100: One Hundred Hours of Broad and Deep MEG Data for Neural Speech Decoding at Scale',
    authors: 'Francesco Mantegna, Dulhan Jayalath, Gereon Elvers, Tasha Kim, Benjamin Ballyk, Alex Fung, SungJun Cho, Teyun Kwon, Luisa Kurth, Miran Özdogan, Gilad Landau, Pratik Somaiya, Natalie Voets, Mark Woolrich, Oiwi Parker Jones',
    venue: 'Preprint',
    abstract: 'We introduce LibriBrain100, a large-scale MEG dataset for speech decoding designed from the ground up for reproducible, standardised evaluation. LibriBrain100 more than doubles the size of the original LibriBrain release, resulting in over 100 hours of high-quality MEG acquired while subjects listened to naturalistic continuous speech. With ~80 hours from a single subject, LibriBrain100 sets a new record for deep, within-subject neural data (8× more than the next comparable dataset and roughly 80× more than other datasets). To demonstrate the payoff of this depth-first design, we evaluate on a word-classification benchmark—an increasingly well-established stepping stone towards the open challenge of non-invasive brain-to-text decoding. Using an existing decoding model, we achieve state-of-the-art performance—validating both the quality of the recordings and the value of within-subject data at scale. Because collecting 80 hours of data per user is impractical for real-world applications, we also collected ~40 minutes of additional data from each of 32 subjects. Using the same word-classification benchmark, we demonstrate the value of broad multi-subject data: supervised fine-tuning of a pre-trained model can substantially compensate for limited per-subject data. We provide standard train, validation, and test splits, all reproducible through an open-sourced Python library that supports easy downloading, optional preprocessing, and data loading for common deep learning frameworks. In addition, the dataset and evaluation infrastructure are being released alongside an open machine-learning competition with a public leaderboard for standardised benchmarking. Ultimately, our hope is that LibriBrain100 will accelerate progress towards practical non-invasive brain-computer interfaces, capable of restoring communication to people living with severe paralysis.',
    pdf: '/publications/LibriBrain100-dataset.pdf',
    bibtex: `@article{mantegna2025libribrain100,
  title={LibriBrain100: One Hundred Hours of Broad and Deep MEG Data for Neural Speech Decoding at Scale},
  author={Mantegna, Francesco and Jayalath, Dulhan and Elvers, Gereon and Kim, Tasha and Ballyk, Benjamin and Fung, Alex and Cho, SungJun and Kwon, Teyun and Kurth, Luisa and \\"Ozdogan, Miran and Landau, Gilad and Somaiya, Pratik and Voets, Natalie and Woolrich, Mark and Parker Jones, Oiwi},
  year={2025}
}`,
    label: 'Dataset Paper',
  },
  {
    title: 'Benchmarking Non-Invasive Speech BCIs: Lessons Learned from the 2025 PNPL Competition',
    authors: 'Gereon Elvers, Gilad Landau, Francesco Mantegna, Miran \u00d6zdogan, Tasha Kim, Teyun Kwon, SungJun Cho, Benjamin Ballyk, Luisa Kurth, Dulhan Jayalath, Pratik Somaiya, Chetan Gohil, Brendan Shillingford, Greg Farquhar, Minqi Jiang, Caglar Gulcehre, Xabier de Zuazo, Hamza Abdelhedi, Yorguin Mantilla Ramos, Karim Jerbi, Mark Woolrich, Natalie Voets, Oiwi Parker Jones',
    venue: 'Proceedings of Machine Learning Research (NeurIPS 2025 Competition Track), 2026',
    abstract: 'We present a retrospective on the 2025 PNPL Competition, an open machine-learning benchmark for decoding speech from non-invasive brain recordings, which ran from June to September 2025 and culminated in a workshop at NeurIPS that December. The competition used the LibriBrain dataset \u2014 over 50 hours of within-subject MEG with standard data splits \u2014 and challenged participants to tackle two tasks: Speech Detection (binary frame-level classification) and Phoneme Classification (39-class ARPAbet prediction). Across 155 registered teams and 6,041 submissions, top F1-macro scores reached 95.6% for Speech Detection and 73.6% for Phoneme Classification, exceeding prior baselines of 68% and 44%, respectively, by wide margins. High-performing submissions converged on a common architectural template \u2014 temporal CNN or TCN backbones with task-specific recurrent or attention-based heads \u2014 whilst task-specific strategies such as temporal smoothing and ensemble voting proved critical for competitive performance. Hidden track evaluations suggest that main-track Speech Detection models generalised poorly to balanced class distributions. This could imply a reliance on class priors rather than robust neural decoding, highlighting a useful lesson: evaluation distributions should reflect intended deployment conditions. We further reflect on design choices, organisational lessons, and plans for future competitions in this series.',
    pdf: '/publications/2025-pnpl-competition-reflections.pdf',
    bibtex: `@inproceedings{elvers2026benchmarking,
  title={Benchmarking Non-Invasive Speech BCIs: Lessons Learned from the 2025 PNPL Competition},
  author={Elvers, Gereon and Landau, Gilad and Mantegna, Francesco and \\"Ozdogan, Miran and Kim, Tasha and Kwon, Teyun and Cho, SungJun and Ballyk, Benjamin and Kurth, Luisa and Jayalath, Dulhan and Somaiya, Pratik and Gohil, Chetan and Shillingford, Brendan and Farquhar, Greg and Jiang, Minqi and Gulcehre, Caglar and de Zuazo, Xabier and Abdelhedi, Hamza and Mantilla Ramos, Yorguin and Jerbi, Karim and Woolrich, Mark and Voets, Natalie and Parker Jones, Oiwi},
  booktitle={Proceedings of the NeurIPS 2025 Competition Track},
  series={Proceedings of Machine Learning Research},
  publisher={PMLR},
  year={2026}
}`,
    label: 'Competition Retrospective',
  },
];

function PublicationCard({ pub }: { pub: Publication }) {
  const [showBibtex, setShowBibtex] = useState(false);
  const [showAbstract, setShowAbstract] = useState(false);

  return (
    <div className="card" style={{
      border: '1px solid #eee',
      borderRadius: '8px',
      padding: '2rem',
      background: '#fff',
      marginBottom: '1.5rem'
    }}>
      <span style={{
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#776885',
        fontWeight: 600,
        background: 'rgba(119,104,133,0.08)',
        padding: '0.25rem 0.6rem',
        borderRadius: '10px',
        display: 'inline-block',
        marginBottom: '0.8rem'
      }}>
        {pub.label}
      </span>

      <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 0.8rem 0', lineHeight: 1.3 }}>
        {pub.title}
      </h3>
      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 0.3rem 0', lineHeight: 1.5 }}>
        {pub.authors}
      </p>
      <p style={{ fontSize: '13px', color: '#999', margin: '0 0 1.2rem 0', fontStyle: 'italic' }}>
        {pub.venue}
      </p>

      {showAbstract && (
        <p style={{
          fontSize: '14px',
          color: '#555',
          lineHeight: 1.7,
          margin: '0 0 1.2rem 0',
          padding: '1rem',
          background: '#f9f9f9',
          borderRadius: '6px'
        }}>
          {pub.abstract}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {pub.arxiv && (
          <a href={pub.arxiv} target="_blank" rel="noopener noreferrer" style={{
            fontSize: '13px', color: '#776885', textDecoration: 'none', padding: '0.4rem 0.8rem',
            border: '1px solid #776885', borderRadius: '4px', transition: 'all 0.2s ease'
          }}>
            ArXiv
          </a>
        )}
        <a href={assetPath(pub.pdf)} target="_blank" rel="noopener noreferrer" style={{
          fontSize: '13px', color: '#776885', textDecoration: 'none', padding: '0.4rem 0.8rem',
          border: '1px solid #776885', borderRadius: '4px', transition: 'all 0.2s ease'
        }}>
          PDF
        </a>
        <button onClick={() => setShowAbstract(!showAbstract)} style={{
          fontSize: '13px', color: '#888', background: 'none', border: '1px solid #ddd',
          padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s ease'
        }}>
          {showAbstract ? 'Hide' : 'Show'} Abstract
        </button>
        <button onClick={() => setShowBibtex(!showBibtex)} style={{
          fontSize: '13px', color: '#888', background: 'none', border: '1px solid #ddd',
          padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s ease'
        }}>
          {showBibtex ? 'Hide' : 'Show'} BibTeX
        </button>
      </div>

      {showBibtex && (
        <pre style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#0a0a0a',
          color: '#e0e0e0',
          borderRadius: '6px',
          fontSize: '12px',
          overflow: 'auto',
          lineHeight: 1.5
        }}>
          {pub.bibtex}
        </pre>
      )}
    </div>
  );
}

export default function PublicationsPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Publications" subtitle="Research papers">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444', marginBottom: '2rem' }}>
            <p>The 2026 PNPL Competition and the LibriBrain100 dataset are documented in the following publications, together with our retrospective on the 2025 edition, whose lessons informed this year’s design. See also the <Link href="/editions/2025/publications/">2025 publications</Link> for the original LibriBrain dataset and 2025 competition papers.</p>
          </div>
          {publications.map((pub) => (
            <PublicationCard key={pub.title} pub={pub} />
          ))}
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
