import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function ParticipatePage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Participate" subtitle="How to join the 2026 competition">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <div style={{
              background: '#faf8ff',
              border: '1px solid rgba(124,58,237,0.12)',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              margin: '1rem 0'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 0.5rem', color: '#0a0a0a' }}>
                Opening June 2026
              </h3>
              <p style={{ color: '#888', margin: 0, maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
                Detailed participation instructions, tutorials, and the <code style={{ background: '#f1f1f1', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '15px' }}>pnpl</code> starter kit will be available when the dataset is released.
              </p>
            </div>

            <p style={{ marginTop: '2rem' }}>
              In the meantime, you can prepare by familiarizing yourself with the{' '}
              <a href="https://github.com/neural-processing-lab/pnpl" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline' }}>pnpl Python package</a>{' '}
              and exploring the 2025 competition tutorials and blog posts.
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
