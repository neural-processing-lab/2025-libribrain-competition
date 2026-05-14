import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import EditionLayout from '../../components/EditionLayout';
import Link from 'next/link';

export default function Edition2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="PNPL Competition 2026" subtitle="Word Classification from MEG Brain Recordings">

          {/* Coming soon banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
            borderRadius: '10px',
            padding: '2rem 2.5rem',
            marginBottom: '2.5rem',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '20px 20px',
              pointerEvents: 'none'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  background: '#4ade80',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Competition opening June 2026
                </span>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '16px', opacity: 0.85, lineHeight: 1.6 }}>
                Registration and dataset details will be announced soon. In the meantime, check out the task description and timeline below.
              </p>
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                <Link href="/editions/2026/tracks/" style={{
                  fontSize: '13px',
                  color: '#1e1b4b',
                  textDecoration: 'none',
                  background: '#c4b5fd',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '6px',
                  fontWeight: 600
                }}>
                  View Task &rarr;
                </Link>
                <Link href="/editions/2026/timeline/" style={{
                  fontSize: '13px',
                  color: '#fff',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '6px',
                  fontWeight: 500
                }}>
                  Timeline
                </Link>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p>
              The <strong>2026 PNPL Competition</strong> builds on the success of our inaugural year with a more ambitious task and a significantly expanded dataset. This year, participants will tackle <strong>Word Classification</strong> &mdash; predicting which word a subject is hearing from MEG brain recordings.
            </p>

            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '2.5rem 0 1rem', color: '#0a0a0a' }}>
              What&apos;s New
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              margin: '1.5rem 0 2rem'
            }}>
              {[
                { title: 'Word Classification', desc: 'Decode the specific word being heard from MEG data — a major step up from phoneme-level decoding.', accent: '#7c3aed' },
                { title: 'LibriBrain100', desc: 'Expanded dataset: ~80 hours from the original subject plus ~40 minutes from each of 32 new subjects.', accent: '#2563eb' },
                { title: '33 Subjects', desc: 'Cross-subject generalization — over 100 hours of MEG recordings from 33 individuals listening to Sherlock Holmes.', accent: '#059669' },
                { title: 'Single Phase', desc: 'One extended competition phase running June through September 2026.', accent: '#d97706' },
              ].map(item => (
                <div key={item.title} style={{
                  padding: '1.5rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  borderTop: `3px solid ${item.accent}`,
                  background: '#fff'
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 0.4rem', color: '#0a0a0a' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '2.5rem 0 1rem', color: '#0a0a0a' }}>
              The Dataset: LibriBrain100
            </h2>
            <p>
              LibriBrain100 is a major expansion of the original LibriBrain dataset, bringing the total to <strong>over 100 hours of MEG data</strong>. It combines <strong>~80 hours</strong> from the original LibriBrain subject with <strong>~40 minutes of recordings from each of 32 new subjects</strong>, all listening to naturalistic spoken English from the Sherlock Holmes canon.
            </p>
            <p>
              This multi-subject dataset opens the door to cross-subject generalization &mdash; a critical challenge for practical brain-computer interfaces. Can models trained on many subjects outperform those trained deeply on one?
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              margin: '2rem 0'
            }}>
              <Link href="/editions/2026/tracks/" style={{
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                background: '#7c3aed',
                padding: '0.8rem 1.8rem',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                Task Details &rarr;
              </Link>
              <Link href="/editions/2025/" style={{
                fontSize: '14px',
                color: '#555',
                textDecoration: 'none',
                background: 'transparent',
                border: '1px solid #ddd',
                padding: '0.8rem 1.8rem',
                borderRadius: '6px',
                fontWeight: 500
              }}>
                View 2025 Results
              </Link>
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
