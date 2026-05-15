import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function LeaderboardPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Leaderboard" subtitle="Competition rankings">
          <div style={{
            background: '#faf8ff',
            border: '1px solid rgba(124,58,237,0.12)',
            borderRadius: '8px',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 0.5rem', color: '#0a0a0a' }}>
              Leaderboard opens July 2026
            </h3>
            <p style={{ color: '#888', margin: 0, maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto', fontSize: '16px' }}>
              The leaderboard will go live when the competition opens. Check back then to track submissions and scores.
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
