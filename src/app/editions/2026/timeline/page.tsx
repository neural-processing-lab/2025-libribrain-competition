import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

const timeline = [
  { phase: 'Competition Launch', dates: '1 Jul 2026', status: 'upcoming' },
  { phase: 'Competition Phase \u2013 Word Classification', dates: '1 Jul \u2013 30 Sep 2026', status: 'upcoming' },
  { phase: 'Winners Announced', dates: '1 Nov 2026', status: 'upcoming' },
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
              This year features a <strong>single extended competition phase</strong> running from July through September, giving participants three full months to develop their word classification models.
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
              Dates are tentative and subject to change. Final dates will be confirmed closer to the competition launch.
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
