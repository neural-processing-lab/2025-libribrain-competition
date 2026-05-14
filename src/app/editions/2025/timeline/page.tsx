import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

const timeline = [
  { phase: 'Dataset Release', dates: '1 Jun 2025', status: 'complete' },
  { phase: 'Phase 1 \u2013 Speech Detection Tracks live', dates: '1 Jun \u2013 31 Jul 2025', status: 'complete' },
  { phase: 'Phase 2 \u2013 Phoneme Classification Tracks live', dates: '1 Aug \u2013 30 Sep 2025', status: 'complete' },
  { phase: 'Winners Announced', dates: '10 Oct 2025', status: 'complete' },
  { phase: 'NeurIPS Early Registration Deadline', dates: '11 Oct 2025', status: 'complete' },
  { phase: 'Visa Application Deadline*', dates: '16 Oct 2025', status: 'complete' },
  { phase: 'NeurIPS Contest Session & Final Awards', dates: '2 \u2013 7 Dec 2025', status: 'complete' },
];

export default function TimelinePage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Timeline" subtitle="Competition schedule and key dates">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <div style={{ margin: '0 0 2rem 0' }}>
              {timeline.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  position: 'relative',
                  paddingLeft: '2rem',
                  paddingBottom: i < timeline.length - 1 ? '2rem' : '0',
                  borderLeft: i < timeline.length - 1 ? '2px solid #eee' : '2px solid transparent',
                  marginLeft: '0.5rem'
                }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-7px',
                    top: '4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: item.status === 'complete' ? '#776885' : '#ddd',
                    border: '2px solid #fff',
                    boxShadow: '0 0 0 2px ' + (item.status === 'complete' ? '#776885' : '#ddd')
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

            <p style={{ fontSize: '14px', color: '#999', marginTop: '2rem' }}>
              *Based on{' '}
              <a href="https://neurips.cc/FAQ/CancellationPolicy" target="_blank" rel="noopener noreferrer" style={{ color: '#776885' }}>
                NeurIPS Registration Cancellation Policy
              </a>
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
