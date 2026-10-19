import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

const timeline = [
  { phase: 'Soft Launch – Resources & Tutorials Open', dates: 'July 2026', status: 'complete' },
  { phase: 'Submissions Open', dates: '15 Jul 2026', status: 'complete' },
  { phase: 'Competition Phase – Word Classification', dates: '15 Jul – 15 Oct 2026 (AoE)', status: 'complete' },
  { phase: 'Submission Deadline', dates: '15 Oct 2026 (AoE)', status: 'complete' },
  { phase: 'Verification – Contact Us and Send Checkpoints & Code', dates: 'By 30 Oct 2026', status: 'upcoming' },
  { phase: 'Final Standings, Winners & Prizes Announced', dates: 'By 1 Dec 2026', status: 'upcoming' },
  { phase: 'Workshop Write-ups Due', dates: '1 Dec 2026', status: 'upcoming' },
];

export default function TimelinePage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Timeline" subtitle="Key dates for the 2026 PNPL Competition">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p style={{ marginBottom: '2rem' }}>
              The competition ran for three months, from <strong>15 July</strong> to{' '}
              <strong>15 October 2026 (Anywhere on Earth)</strong>. Submissions are now closed and we are
              verifying top-performing teams before confirming the final standings.{' '}
              <Link href="/blog/competition-closed-verification-and-write-ups/" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Read the announcement &rarr;</Link>
            </p>

            <div style={{ margin: '0 0 2rem 0' }}>
              {timeline.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  position: 'relative',
                  paddingLeft: '2rem',
                  paddingBottom: i < timeline.length - 1 ? '2rem' : '0',
                  borderLeft: i < timeline.length - 1 ? '2px solid #e5e5e5' : '2px solid transparent',
                  marginLeft: '0.5rem'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '-7px',
                    top: '4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: item.status === 'complete' ? '#7c3aed' : '#e5e5e5',
                    border: '2px solid #fff',
                    boxShadow: '0 0 0 2px ' + (item.status === 'complete' ? '#7c3aed' : '#e5e5e5')
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '16px', color: '#0a0a0a', marginBottom: '0.2rem' }}>
                      {item.phase}
                    </div>
                    <div style={{ fontSize: '14px', color: '#888' }}>
                      {item.dates}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#faf8ff',
              border: '1px solid rgba(124,58,237,0.12)',
              borderRadius: '6px',
              padding: '1rem 1.5rem',
              fontSize: '15px',
              color: '#555'
            }}>
              If you need more time for verification materials or your write-up, email{' '}
              <a href="mailto:libribrain@robots.ox.ac.uk" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>libribrain@robots.ox.ac.uk</a>.
              Reminders and any changes are announced on our{' '}
              <a href="https://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Discord</a>.
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
