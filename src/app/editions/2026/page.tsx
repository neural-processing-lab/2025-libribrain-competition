import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import EditionLayout from '../../components/EditionLayout';
import Link from 'next/link';
import { assetPath } from '../../../lib/assetPath';

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
              <div style={{ marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Competition opening July 2026
                </span>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '16px', opacity: 0.85, lineHeight: 1.6 }}>
                We&apos;re happy to announce the PNPL Competition is returning this year. Keep in mind this page is still work-in-progress as we finalise all details.
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
                { title: 'New Task', desc: 'Work Classification — decode the specific word heard from MEG data' },
                { title: 'New Dataset', desc: 'Introducing the new LibriBrain100 dataset, now with over 100 hours of MEG data' },
                { title: 'Go broad & deep', desc: 'Maximise within-subject performance or tackle cross-subject generalisation' },
                { title: 'Four Months', desc: 'The competition will run between July 1st and September 30th, 2026.' },
              ].map(item => (
                <div key={item.title} style={{
                  padding: '1.5rem',
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  background: '#fff'
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 0.4rem', color: '#7c3aed' }}>
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
              This multi-subject dataset opens the door to cross-subject generalisation &mdash; a critical challenge for practical brain-computer interfaces. How much data does it take to reach useful performance on a new subject?
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '1.5rem',
              margin: '2rem 0'
            }}>
              <figure style={{ margin: 0, textAlign: 'center' }}>
                <video
                  src={assetPath('/images/Libribrain100pt1.mp4')}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="LibriBrain100 MEG visualization"
                  style={{
                    height: '320px',
                    width: 'auto',
                    maxWidth: '100%',
                    borderRadius: '8px',
                    display: 'block'
                  }}
                />
                <figcaption style={{ fontSize: '13px', color: '#888', marginTop: '0.6rem', lineHeight: 1.5, maxWidth: '460px' }}>
                  Overview over the LibriBrain100 dataset.
                </figcaption>
              </figure>

              <figure style={{ margin: 0, textAlign: 'center' }}>
                <img
                  src={assetPath('/images/libribrain100-chart.png')}
                  alt="Scatter plot comparing LibriBrain100 with other MEG datasets on number of subjects and maximum hours per subject. LibriBrain100 sits in the upper-right quadrant — many subjects and many hours per subject — while datasets like MEG-MASC, MOUS, and Le Petit Prince have more subjects but far fewer hours each."
                  style={{
                    height: '320px',
                    width: 'auto',
                    maxWidth: '100%',
                    borderRadius: '8px',
                    display: 'block'
                  }}
                />
                <figcaption style={{ fontSize: '13px', color: '#888', marginTop: '0.6rem', lineHeight: 1.5, maxWidth: '460px' }}>
                  LibriBrain100 compared with other public MEG datasets. The original LibriBrain went deep on a single subject; LibriBrain100 keeps that depth while adding breadth across 33 subjects.
                </figcaption>
              </figure>
            </div>

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
