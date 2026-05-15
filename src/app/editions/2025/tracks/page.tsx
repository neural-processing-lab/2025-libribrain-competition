import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function TracksPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Tasks & Tracks" subtitle="Two tasks, two tracks per task">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p>
              The <strong>2025 PNPL Competition</strong> features two core tasks in decoding language from MEG recordings of brain activity:
            </p>

            <div style={{
              display: 'grid',
              gap: '1.5rem',
              margin: '2rem 0'
            }}>
              <div className="card" style={{
                padding: '2rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                background: '#fff'
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                  Speech Detection
                </h3>
                <p style={{ margin: '0 0 1rem 0', color: '#555' }}>
                  Train a model to distinguish <em>speech</em> vs. <em>silence</em> based on brain activity measured by MEG during a listening session.
                </p>
                <img src="/images/sherlock3.gif" alt="Speech detection visualization" style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }} />
              </div>

              <div className="card" style={{
                padding: '2rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                background: '#fff'
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                  Phoneme Classification
                </h3>
                <p style={{ margin: '0 0 1rem 0', color: '#555' }}>
                  Build a classifier that maps MEG data to the specific <strong>phonemes</strong> being heard.
                </p>
                <img src="/images/sherlock4.gif" alt="Phoneme classification visualization" style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }} />
              </div>
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 600, margin: '2.5rem 0 1rem 0', color: '#0a0a0a' }}>
              Tracks
            </h2>
            <p>
              We offer two tracks per task to balance resource constraints with open exploration:
            </p>

            <div style={{
              overflowX: 'auto',
              margin: '1.5rem 0',
              border: '1px solid #eee',
              borderRadius: '8px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, borderBottom: '1px solid #eee' }}>Track</th>
                    <th style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, borderBottom: '1px solid #eee' }}>Training Data Allowed</th>
                    <th style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, borderBottom: '1px solid #eee' }}>Motivation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>Standard</td>
                    <td style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>LibriBrain only</td>
                    <td style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0', color: '#666' }}>Level playing field &mdash; innovate on methods/efficiency</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.9rem 1.2rem', fontWeight: 600 }}>Extended</td>
                    <td style={{ padding: '0.9rem 1.2rem' }}>Any data</td>
                    <td style={{ padding: '0.9rem 1.2rem', color: '#666' }}>Embrace scale &mdash; see how far teams with resources can go</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Regardless of training data, all tracks are evaluated on a shared competition holdout set to best compare approaches and measure progress.
            </p>

            <blockquote style={{
              margin: '1.5rem 0',
              padding: '1.1rem 1.5rem',
              border: '1px solid rgba(119, 104, 133, 0.22)',
              borderRadius: '10px',
              background: '#f8f5fb',
              fontStyle: 'italic',
              color: '#555',
              fontSize: '15px',
              lineHeight: 1.7
            }}>
              You&apos;re welcome to enter any and all tracks. To encourage participation, prize money will be awarded to each team <strong>only once</strong>: if you place in multiple tasks/tracks, then the lower prize you would win rolls down to the next eligible team.
            </blockquote>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2.5rem 0' }} />

            <p>
              We believe these tasks will spark new breakthroughs in language decoding from brain activity. Ready to get started? Check out the{' '}
              <Link href="/editions/2025/participate/" style={{ color: '#776885', textDecoration: 'underline' }}>participation guide</Link>!
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
