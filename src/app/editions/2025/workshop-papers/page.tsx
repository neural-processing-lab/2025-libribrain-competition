import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

const papers = [
  { team: 'BrainWatson', file: 'BrainWatson/libribrain-brainwatson-2025.pdf', track: null },
  { team: 'I_love_silksong', file: 'I_love_silksong/libribrain-ilovesilksong-speech-2025.pdf', track: 'Speech Track' },
  { team: 'I_love_silksong', file: 'I_love_silksong/libribrain-ilovesilksong-phoneme-2025.pdf', track: 'Phoneme Track' },
  { team: 'neural2speech', file: 'neural2speech/libribrain-neural2speech-2025.pdf', track: null },
  { team: 'NTHU HMI LAB', file: 'NTHU%20HMI%20LAB/libribrain-nthuhmilab-2025.pdf', track: null },
  { team: 'Null-1', file: 'Null-1/libribrain-null1-2025.pdf', track: null },
  { team: 'QuantumFiremen', file: 'QuantumFiremen/libribrain-quantumfiremen-2025.pdf', track: null },
  { team: 'Saidnesh', file: 'Saidnesh/libribrain-saidnesh-2025.pdf', track: null },
  { team: 'September Labs', file: 'September%20Labs/libribrain-septemberlabs-2025.pdf', track: null },
  { team: 'Sherlock Holmes', file: 'Sherlock%20Holmes/libribrain-sherlockholmes-2025.pdf', track: null },
  { team: 'SHINE', file: 'SHINE/libribrain-shine-2025.pdf', track: null },
];

export default function WorkshopPapersPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Workshop Papers" subtitle="Accepted submissions from competition teams">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444', marginBottom: '2rem' }}>
            <p style={{ margin: '0 0 1rem 0' }}>
              We extend a warm thank you to all authors and teams for their excellent submissions! Below is the list of all accepted workshop papers from the 2025 PNPL Competition.
            </p>

            <div style={{
              background: '#f8f5fb',
              border: '1px solid rgba(119,104,133,0.15)',
              borderRadius: '6px',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              fontSize: '15px'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#776885' }}>Workshop Template</p>
              <p style={{ margin: 0, color: '#666' }}>
                Download the updated LaTeX template:{' '}
                <a href="https://libribrain.com/competition-workshop-template.zip" style={{ color: '#776885' }}>Download</a>{' | '}
                <a href="https://www.overleaf.com/read/nvvxfndvqzzc#eb252d" target="_blank" rel="noopener noreferrer" style={{ color: '#776885' }}>Open in Overleaf</a>
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gap: '0.75rem'
          }}>
            {papers.map((paper, i) => (
              <a
                key={i}
                href={`/workshop-papers/${paper.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#fff',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: '#f0edf5',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#776885',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    PDF
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '15px' }}>{paper.team}</div>
                    {paper.track && (
                      <span style={{
                        fontSize: '12px',
                        color: '#888',
                        background: '#f5f5f5',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '8px'
                      }}>
                        {paper.track}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: '#999' }}>&darr; Download</span>
              </a>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '6px', fontSize: '15px', color: '#666' }}>
            If you have any questions, please contact us on Discord or at{' '}
            <a href="mailto:libribrain@robots.ox.ac.uk" style={{ color: '#776885' }}>libribrain@robots.ox.ac.uk</a>.
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
