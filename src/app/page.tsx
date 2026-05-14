import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HeroBackground from './components/HeroBackground';
import Link from 'next/link';
import wordart from './wordart';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* ═══ HERO ═══ */}
        <section style={{
          minHeight: 'min(78vh, 720px)',
          background: '#fff',
          color: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* Animated MEG waveforms */}
          <HeroBackground />

          <div style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: 'clamp(5rem, 10vw, 7rem) clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vw, 4.5rem)',
            position: 'relative',
            zIndex: 1,
            width: '100%'
          }}>
            {/* Brain wordart + right-side content column */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'clamp(1.5rem, 4vw, 3rem)',
              flexWrap: 'wrap'
            }}>
              <div
                aria-label="PNPL"
                style={{
                  flexShrink: 0,
                  width: 'clamp(160px, 22vw, 240px)',
                  height: 'clamp(180px, 26vw, 280px)',
                  overflow: 'hidden',
                  marginTop: '-0.25rem'
                }}
              >
                <pre
                  style={{
                    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                    fontSize: '9px',
                    fontWeight: 700,
                    lineHeight: 1,
                    margin: 0,
                    color: '#4c1d95',
                    whiteSpace: 'pre',
                    userSelect: 'none',
                    transform: 'scale(0.6)',
                    transformOrigin: 'top left'
                  }}
                >
                  {wordart}
                </pre>
              </div>

              <div style={{ flex: '1 1 360px', minWidth: 0 }}>
                <h1 style={{
                  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                  fontSize: 'clamp(40px, 6.5vw, 68px)',
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  lineHeight: 1,
                  margin: '0 0 1.25rem 0',
                  color: '#0a0a0a'
                }}>
                  PNPL<br />
                  <span style={{ color: '#7c3aed' }}>Competition</span>
                </h1>

                <p style={{
                  fontSize: 'clamp(16px, 2.2vw, 20px)',
                  lineHeight: 1.6,
                  color: '#666',
                  maxWidth: '460px',
                  margin: '0 0 2rem 0',
                  fontWeight: 300
                }}>
                  Decoding language from the brain. An annual challenge pushing the limits of non-invasive neural speech decoding.
                </p>

                {/* CTA buttons */}
                <div style={{
                  display: 'flex',
                  gap: '0.8rem',
                  flexWrap: 'wrap',
                  marginBottom: '2.5rem'
                }}>
                  <Link href="/editions/2026/" className="btn-hero-light-primary">
                    2026 Edition &rarr;
                  </Link>
                  <Link href="/editions/2025/" className="btn-hero-light-secondary">
                    2025 Results
                  </Link>
                  <a href="https://github.com/neural-processing-lab/pnpl" target="_blank" rel="noopener noreferrer" className="btn-hero-light-secondary" style={{ borderColor: '#ddd', color: '#999' }}>
                    pip install pnpl
                  </a>
                </div>
              </div>
            </div>

            {/* Organized by line */}
            <p style={{
              fontSize: '13px',
              color: '#bbb',
              fontWeight: 400,
              margin: 0
            }}>
              Organized by the{' '}
              <a href="https://pnpl.robots.ox.ac.uk/" target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none', fontWeight: 500 }}>
                Parker Jones Neural Processing Lab
              </a>{' '}at Oxford (and our friends)
            </p>
          </div>
        </section>

        {/* ═══ EDITIONS ═══ */}
        <section style={{
          padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 4vw, 3rem)',
          background: '#fff'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#776885',
                fontWeight: 600
              }}>
                Past & Present
              </span>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                margin: '0.5rem 0 0.8rem 0',
                letterSpacing: '-0.03em',
                color: '#0a0a0a'
              }}>
                Competition Editions
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#777',
                maxWidth: '550px',
                lineHeight: 1.6
              }}>
                The PNPL Competition is an annual challenge. Each year brings new tasks, datasets, and frontiers for the research community.
              </p>
            </div>

            {/* 2026 Edition Card — CURRENT */}
            <Link href="/editions/2026/" style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '1.5rem' }}>
              <div className="edition-card" style={{ borderColor: '#7c3aed', borderWidth: '1.5px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span className="edition-year" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>2026</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#16a34a',
                      background: 'rgba(22,163,74,0.08)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}>
                      Coming Soon
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 'clamp(22px, 3.5vw, 30px)',
                    fontWeight: 600,
                    margin: '0 0 0.6rem 0',
                    letterSpacing: '-0.02em'
                  }}>
                    Word Classification
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#888',
                    margin: '0 0 1.5rem 0',
                    lineHeight: 1.6,
                    maxWidth: '500px'
                  }}>
                    Decode words from MEG brain recordings using LibriBrain100 &mdash; over 100 hours from 33 subjects. Opening June 2026.
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    fontSize: '13px',
                    color: '#aaa',
                    fontWeight: 500
                  }}>
                    <span>Word Classification</span>
                    <span>LibriBrain100</span>
                    <span>33 Subjects</span>
                  </div>
                </div>
                <div className="edition-card-arrow">&rarr;</div>
              </div>
            </Link>

            {/* 2025 Edition Card — ARCHIVED */}
            <Link href="/editions/2025/" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="edition-card" style={{ opacity: 0.75 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span className="edition-year">2025</span>
                    <span className="edition-status">Complete</span>
                  </div>
                  <h3 style={{
                    fontSize: 'clamp(18px, 3vw, 24px)',
                    fontWeight: 600,
                    margin: '0 0 0.4rem 0',
                    letterSpacing: '-0.02em'
                  }}>
                    Speech Detection &amp; Phoneme Classification
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#999',
                    margin: '0 0 1rem 0',
                    lineHeight: 1.6,
                    maxWidth: '500px'
                  }}>
                    NeurIPS 2025 Competition Track. 2 tasks, 4 tracks, $10K prizes, 11 workshop papers.
                  </p>
                </div>
                <div className="edition-card-arrow">&rarr;</div>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══ ABOUT / MISSION ═══ */}
        <section style={{
          padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 4vw, 3rem)',
          background: '#f8f7fa',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'center'
            }}>
              {/* Left: text */}
              <div>
                <span style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#776885',
                  fontWeight: 600
                }}>
                  Our Mission
                </span>
                <h2 style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 700,
                  margin: '0.5rem 0 1.2rem 0',
                  letterSpacing: '-0.02em',
                  color: '#0a0a0a'
                }}>
                  An &ldquo;ImageNet Moment&rdquo; for Brain-Computer Interfaces
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#555', margin: '0 0 1rem 0' }}>
                  The societal impact of functioning brain-computer interface systems will be substantial &mdash; first for people with speech-related disabilities, and eventually as a new paradigm for interaction with computers.
                </p>
                <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#555', margin: 0 }}>
                  We believe the way forward is through standardization and easy accessibility. LibriBrain lowers the barrier of entry for the broader research community to contribute to this exciting field.
                </p>
              </div>

              {/* Right: feature cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                {[
                  { num: '50x', title: 'Deeper', desc: 'Than most existing MEG datasets' },
                  { num: '< 1h', title: 'To Start', desc: 'First model trained in under an hour' },
                  { num: 'pip', title: 'install pnpl', desc: 'Plug-and-play Python package', mono: true },
                  { num: '24/7', title: 'Community', desc: 'Discord, leaderboards, and support' },
                ].map(item => (
                  <div key={item.title} className="feature-card">
                    <div style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#776885',
                      marginBottom: '0.3rem',
                      fontFamily: item.mono ? 'var(--font-geist-mono), monospace' : undefined
                    }}>
                      {item.num}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', marginBottom: '0.2rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#999', lineHeight: 1.4 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ORGANIZED BY ═══ */}
        <section style={{
          padding: 'clamp(3rem, 6vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
          background: '#fff',
          borderTop: '1px solid #eee'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 1.2rem 0', fontWeight: 600 }}>
              Organized by
            </p>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, margin: 0 }}>
              <a href="https://pnpl.robots.ox.ac.uk/" target="_blank" rel="noopener noreferrer" style={{ color: '#776885', textDecoration: 'none', fontWeight: 600 }}>
                Parker Jones Neural Processing Lab
              </a>{' '}at Oxford, with collaborators from OHBA, WIN, Mila, EPFL, Google DeepMind, and Meta AI.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
