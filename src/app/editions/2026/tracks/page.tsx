import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function TracksPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Task: Word Classification" subtitle="Decode words from MEG brain recordings">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p>
              The <strong>2026 PNPL Competition</strong> focuses on a single, ambitious task:{' '}
              <strong>Word Classification</strong>. Given a segment of MEG brain data recorded while a
              subject listens to spoken English, predict the specific word being heard from a fixed{' '}
              <strong>50-word vocabulary</strong> (the task is <em>not</em> open-vocabulary).
            </p>

            <div className="card" style={{
              padding: '2rem',
              border: '1px solid rgba(124, 58, 237, 0.22)',
              borderRadius: '12px',
              background: '#faf8ff',
              margin: '2rem 0'
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 0.5rem', color: '#0a0a0a' }}>
                Evaluation metric
              </h3>
              <p style={{ margin: '0 0 0.75rem', color: '#555' }}>
                Submissions are scored by <strong>top-10 balanced accuracy</strong> (BAcc@10) over the
                50-word vocabulary &mdash; a prediction counts as correct if the true word is among your
                model&apos;s ten most likely candidates, balanced across classes so that rarer words
                matter as much as common ones.
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                Final rankings are determined on independent holdout data, recorded with stimuli entirely
                different from anything released to participants.
              </p>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '2.5rem 0 1rem', color: '#0a0a0a' }}>
              Two tracks: Deep &amp; Broad
            </h2>
            <p>
              Both tracks share the same word-classification task, but ask different questions about how
              neural speech decoders generalise. You may enter <strong>either or both</strong>.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              margin: '1.5rem 0'
            }}>
              <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-deep/" target="_blank" rel="noopener noreferrer" className="card" style={{
                display: 'block',
                padding: '1.75rem',
                border: '1px solid rgba(124, 58, 237, 0.22)',
                borderRadius: '10px',
                background: '#fff',
                textDecoration: 'none',
                color: 'inherit'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7c3aed' }}>
                  Track 1
                </span>
                <h4 style={{ fontSize: '19px', fontWeight: 700, margin: '0.3rem 0 0.6rem', color: '#0a0a0a' }}>
                  Deep
                </h4>
                <p style={{ fontSize: '15px', color: '#555', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                  Word classification on a single, deeply-sampled subject (<code>subj0</code>). How far can
                  you push accuracy when data from one brain is abundant?
                </p>
                <p style={{ fontSize: '14px', color: '#888', margin: '0 0 1rem', lineHeight: 1.6 }}>
                  <strong>Training data:</strong> extensive recordings from <code>subj0</code> spanning
                  audiobooks, phonetically balanced speech corpora (TIMIT, MOCHA-TIMIT), and narrative podcasts.
                </p>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>
                  View on Kaggle &rarr;
                </span>
              </a>

              <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-broad/" target="_blank" rel="noopener noreferrer" className="card" style={{
                display: 'block',
                padding: '1.75rem',
                border: '1px solid rgba(124, 58, 237, 0.22)',
                borderRadius: '10px',
                background: '#fff',
                textDecoration: 'none',
                color: 'inherit'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7c3aed' }}>
                  Track 2
                </span>
                <h4 style={{ fontSize: '19px', fontWeight: 700, margin: '0.3rem 0 0.6rem', color: '#0a0a0a' }}>
                  Broad
                </h4>
                <p style={{ fontSize: '15px', color: '#555', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                  Word classification across 32 held-out subjects (<code>subj1</code>&ndash;<code>subj32</code>).
                  How well can a model generalise to new brains from limited data?
                </p>
                <p style={{ fontSize: '14px', color: '#888', margin: '0 0 1rem', lineHeight: 1.6 }}>
                  <strong>Training data:</strong> varying amounts of labelled data per subject, grouped by
                  how much fine-tuning data is available (see below).
                </p>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>
                  View on Kaggle &rarr;
                </span>
              </a>
            </div>

            <h3 style={{ fontSize: '19px', fontWeight: 700, margin: '2rem 0 0.75rem', color: '#0a0a0a' }}>
              Track 2 data groups
            </h3>
            <p style={{ fontSize: '15px', color: '#666' }}>
              To study how performance scales with the amount of fine-tuning data, the 32 Broad subjects are
              split into three groups:
            </p>
            <div style={{ overflowX: 'auto', margin: '1rem 0 2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem', textAlign: 'left' }}>Group</th>
                    <th style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem', textAlign: 'left' }}>Subjects</th>
                    <th style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem', textAlign: 'left' }}>Labelled data per subject</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>100%</td>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>12</td>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>~40 min of audiobook listening</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>50%</td>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>10</td>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>~20 min of audiobook listening</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>25%</td>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>10</td>
                    <td style={{ border: '1px solid #e5e5e5', padding: '0.7rem 1rem' }}>~10 min of audiobook listening</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '2.5rem 0 1rem', color: '#0a0a0a' }}>
              The Dataset: LibriBrain100
            </h2>
            <p>
              This year&apos;s competition uses <strong>LibriBrain100</strong>, a major expansion of the
              original LibriBrain dataset to <strong>over 100 hours of MEG data</strong>. It pairs the deeply-sampled
              <code>subj0</code> recordings behind Track 1 with data from 32 additional subjects
              (<code>subj1</code>&ndash;<code>subj32</code>) behind Track 2, all listening to naturalistic
              spoken English. Together they keep the depth of the original LibriBrain while adding breadth
              across 33 subjects in total.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              margin: '2rem 0'
            }}>
              <Link href="/editions/2026/rules/" style={{
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                background: '#7c3aed',
                padding: '0.8rem 1.8rem',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                Read the Rules &rarr;
              </Link>
              <Link href="/editions/2026/participate/" style={{
                fontSize: '14px',
                color: '#555',
                textDecoration: 'none',
                background: 'transparent',
                border: '1px solid #ddd',
                padding: '0.8rem 1.8rem',
                borderRadius: '6px',
                fontWeight: 500
              }}>
                How to Participate
              </Link>
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
