import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import EditionLayout from '../../components/EditionLayout';
import Link from 'next/link';
import { assetPath } from '../../../lib/assetPath';

export default function Edition2025() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="PNPL Competition 2025" subtitle="NeurIPS 2025 Competition Track &mdash; Speech Detection & Phoneme Classification">
          {/* Competition Complete Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #002147 0%, #776885 100%)',
            borderRadius: '8px',
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
            color: '#fff'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '16px' }}>
              Competition Complete
            </p>
            <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>
              Thank you to everyone who participated. Congratulations to all our winners!{' '}
              <Link href="/editions/2025/prizes/" style={{ color: '#FFD700', textDecoration: 'underline', fontWeight: 600 }}>View winners &rarr;</Link>
              {' | '}
              <Link href="/editions/2025/workshop-papers/" style={{ color: '#fff', textDecoration: 'underline' }}>Accepted papers &rarr;</Link>
            </p>
          </div>

          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p>
              The <strong>2025 PNPL Competition</strong>, presented at NeurIPS 2025, invited AI researchers and students to take part in the challenge of non-invasively decoding language from the brain, built around the original LibriBrain dataset. The societal impact of functioning brain-computer interface systems will be substantial &mdash; first for people with speech-related disabilities, and eventually as a new paradigm for interaction with computers.
            </p>
            <p>
              We believe that the way forward for advancing this impactful technology is through standardisation and easy accessibility for the broader research community. Our goal is to spark an &ldquo;ImageNet moment&rdquo; for BCI, lowering the barrier of entry for researchers to contribute to this exciting new field.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              margin: '2rem 0'
            }}>
              {[
                { icon: '🧠', title: 'Deepest MEG Dataset', desc: '25-50x deeper than most existing datasets' },
                { icon: '📦', title: 'Plug-and-Play', desc: 'pip install pnpl' },
                { icon: '📚', title: 'Hands-on Tutorials', desc: 'Train your first model in under an hour' },
                { icon: '🏆', title: 'Community & Competition', desc: 'Prizes, leaderboards, Discord' },
              ].map(item => (
                <div key={item.title} style={{
                  padding: '1.5rem',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #eee'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 0.3rem 0' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              margin: '2rem 0'
            }}>
              <Link href="/editions/2025/tracks/" style={{
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                background: '#776885',
                padding: '0.8rem 1.8rem',
                borderRadius: '4px',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Learn more...
              </Link>
              <Link href="/editions/2025/participate/" style={{
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                background: '#002147',
                padding: '0.8rem 1.8rem',
                borderRadius: '4px',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Participate now!
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              margin: '2rem 0'
            }}>
              <video
                src={assetPath('/images/Sherlock2.mp4')}
                autoPlay
                loop
                muted
                playsInline
                aria-label="MEG visualization"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
              <video
                src={assetPath('/images/Sherlock1.mp4')}
                autoPlay
                loop
                muted
                playsInline
                aria-label="MEG visualization"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
