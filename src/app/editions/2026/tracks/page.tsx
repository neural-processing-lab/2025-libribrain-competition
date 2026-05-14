import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function TracksPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Task: Word Classification" subtitle="Decode words from MEG brain recordings">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p>
              The <strong>2026 PNPL Competition</strong> focuses on a single, ambitious task: <strong>Word Classification</strong>. Given a segment of MEG brain data recorded while a subject listens to spoken English, predict the specific word being heard.
            </p>

            <div className="card" style={{
              padding: '2rem',
              border: '1px solid #eee',
              borderRadius: '8px',
              borderLeft: '4px solid #7c3aed',
              background: '#faf8ff',
              margin: '2rem 0'
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 0.5rem', color: '#0a0a0a' }}>
                Word Classification
              </h3>
              <p style={{ margin: '0 0 1rem', color: '#555' }}>
                Build a model that maps MEG recordings to the specific <strong>word</strong> being heard by the participant. This is a significant step up from last year&apos;s phoneme-level classification, requiring models to capture richer temporal and semantic information from brain signals.
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>
                Evaluation metric and vocabulary details will be announced with the dataset release.
              </p>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '2.5rem 0 1rem', color: '#0a0a0a' }}>
              The Dataset: LibriBrain100
            </h2>
            <p>
              This year&apos;s competition uses <strong>LibriBrain100</strong>, a major expansion of the original LibriBrain dataset to over 100 hours total:
            </p>

            <div style={{
              display: 'grid',
              gap: '1rem',
              margin: '1.5rem 0'
            }}>
              <div style={{
                padding: '1.5rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                background: '#fff'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 0.3rem', color: '#0a0a0a' }}>
                  Deep single-subject data
                </h4>
                <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
                  ~80 hours of recordings from the original LibriBrain subject, expanded from last year&apos;s ~50 hours.
                </p>
              </div>
              <div style={{
                padding: '1.5rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                background: '#fff'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 0.3rem', color: '#0a0a0a' }}>
                  32 new subjects &times; ~40 minutes each
                </h4>
                <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
                  MEG data from 32 additional subjects, each contributing ~40 minutes of Sherlock Holmes audiobook listening. Enables research on cross-subject generalization.
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '2.5rem 0 1rem', color: '#0a0a0a' }}>
              Tracks
            </h2>
            <p>
              As in 2025, we offer two tracks to balance resource constraints with open exploration:
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
                    <th style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, borderBottom: '1px solid #eee' }}>Training Data</th>
                    <th style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, borderBottom: '1px solid #eee' }}>Motivation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>Standard</td>
                    <td style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>LibriBrain100 only</td>
                    <td style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid #f0f0f0', color: '#666' }}>Level playing field &mdash; innovate on methods</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.9rem 1.2rem', fontWeight: 600 }}>Extended</td>
                    <td style={{ padding: '0.9rem 1.2rem' }}>Any data</td>
                    <td style={{ padding: '0.9rem 1.2rem', color: '#666' }}>Embrace scale &mdash; push the frontier</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <blockquote style={{
              margin: '1.5rem 0',
              padding: '1rem 1.5rem',
              borderLeft: '4px solid #7c3aed',
              background: '#faf8ff',
              fontStyle: 'italic',
              color: '#555',
              fontSize: '15px',
              lineHeight: 1.7
            }}>
              Full task specification, evaluation metrics, and baseline models will be released alongside the dataset on June 1, 2026.
            </blockquote>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
