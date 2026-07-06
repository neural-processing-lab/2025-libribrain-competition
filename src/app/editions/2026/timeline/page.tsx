import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

const timeline = [
  { phase: 'Soft Launch – Resources & Tutorials Open', dates: 'July 2026', status: 'complete' },
  { phase: 'Submissions Open', dates: '15 Jul 2026', status: 'upcoming' },
  { phase: 'Competition Phase – Word Classification', dates: '15 Jul – 15 Oct 2026 (AoE)', status: 'upcoming' },
  { phase: 'Submission Deadline', dates: '15 Oct 2026 (AoE)', status: 'upcoming' },
  { phase: 'Verification & Winners Announced', dates: 'After the deadline (TBA)', status: 'upcoming' },
  { phase: 'Workshop & Final Awards', dates: 'TBA', status: 'upcoming' },
];

export default function TimelinePage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Timeline" subtitle="Key dates for the 2026 PNPL Competition">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p style={{ marginBottom: '2rem' }}>
              Resources and tutorials are <strong>available now</strong> so you can start experimenting.{' '}
              <strong>Submissions open on 15 July 2026</strong> and the competition runs for three months,
              closing on <strong>15 October 2026 (Anywhere on Earth)</strong>.
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
              Post-deadline verification and workshop dates will be confirmed as they are finalised. Deadline
              reminders and any changes are announced on our{' '}
              <a href="http://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Discord</a>.
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
