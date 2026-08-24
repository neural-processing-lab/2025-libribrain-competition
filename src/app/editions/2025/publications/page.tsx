'use client';

import { useState } from 'react';
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
  {
    title: 'The 2025 PNPL Competition: Speech Detection and Phoneme Classification in the LibriBrain Dataset',
    authors: 'Gilad Landau, Miran \u00d6zdogan, Gereon Elvers, Francesco Mantegna, Pratik Somaiya, Dulhan Jayalath, Luisa Kurth, Teyun Kwon, Brendan Shillingford, Greg Farquhar, Minqi Jiang, Karim Jerbi, Hamza Abdelhedi, Yorguin Mantilla Ramos, Caglar Gulcehre, Mark Woolrich, Natalie Voets, Oiwi Parker Jones',
    venue: 'NeurIPS 2025 Competition Track',
    abstract: 'The advance of speech decoding from non-invasive brain data holds the potential for profound societal impact. Among its most promising applications is the restoration of communication to paralysed individuals affected by speech deficits such as dysarthria, without the need for high-risk surgical interventions. The ultimate aim of the 2025 PNPL competition is to produce the conditions for an "ImageNet moment" or breakthrough in non-invasive neural decoding, by harnessing the collective power of the machine learning community.',
    arxiv: 'https://arxiv.org/abs/2506.10165v1',
    pdf: 'https://arxiv.org/pdf/2506.10165v1.pdf',
    bibtex: `@article{landau2025pnpl,
  title={The 2025 PNPL Competition: Speech Detection and Phoneme Classification in the LibriBrain Dataset},
  author={Landau, Gilad and \\"Ozdogan, Miran and Elvers, Gereon and Mantegna, Francesco and Somaiya, Pratik and Jayalath, Dulhan and Kurth, Luisa and Kwon, Teyun and Shillingford, Brendan and Farquhar, Greg and Jiang, Minqi and Jerbi, Karim and Abdelhedi, Hamza and Mantilla Ramos, Yorguin and Gulcehre, Caglar and Woolrich, Mark and Voets, Natalie and Parker Jones, Oiwi},
  journal={NeurIPS Competition Track},
  year={2025}
}`,
    label: 'Competition Paper',
  },
  {
    title: 'LibriBrain: Over 50 Hours of Within-Subject MEG to Improve Speech Decoding Methods at Scale',
    authors: 'Miran \u00d6zdogan, Gilad Landau, Gereon Elvers, Dulhan Jayalath, Pratik Somaiya, Francesco Mantegna, Mark Woolrich, Oiwi Parker Jones',
    venue: 'arXiv preprint',
    abstract: 'LibriBrain represents the largest single-subject MEG dataset to date for speech decoding, with over 50 hours of recordings -- 5\u00d7 larger than the next comparable dataset and 50\u00d7 larger than most. This unprecedented "depth" of within-subject data enables exploration of neural representations at a scale previously unavailable with non-invasive methods.',
    arxiv: 'https://arxiv.org/abs/2506.02098',
    pdf: 'https://arxiv.org/pdf/2506.02098.pdf',
    bibtex: `@article{ozdogan2025libribrain,
  title={LibriBrain: Over 50 Hours of Within-Subject MEG to Improve Speech Decoding Methods at Scale},
  author={\\"Ozdogan, Miran and Landau, Gilad and Elvers, Gereon and Jayalath, Dulhan and Somaiya, Pratik and Mantegna, Francesco and Woolrich, Mark and Parker Jones, Oiwi},
  journal={arXiv preprint arXiv:2506.02098},
  year={2025}
}`,
    label: 'Dataset Paper',
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

export default function PublicationsPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Publications" subtitle="Research papers">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444', marginBottom: '2rem' }}>
            <p>The 2025 PNPL Competition, its outcomes, and the LibriBrain dataset are documented in the following publications:</p>
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
