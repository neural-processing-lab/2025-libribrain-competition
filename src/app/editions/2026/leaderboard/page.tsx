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
              Live leaderboards open 15 July 2026
            </h3>
            <p style={{ color: '#888', margin: '0 auto 1.5rem', maxWidth: '480px', fontSize: '16px' }}>
              Each track is scored on its own Kaggle competition. Once submissions open, standings will be
              tracked live on the Kaggle leaderboards below.
            </p>
            <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-deep/leaderboard" target="_blank" rel="noopener noreferrer" style={{
                fontSize: '13px',
                color: '#fff',
                textDecoration: 'none',
                background: '#7c3aed',
                padding: '0.6rem 1.3rem',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                Track 1 — Deep &rarr;
              </a>
              <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-broad/leaderboard" target="_blank" rel="noopener noreferrer" style={{
                fontSize: '13px',
                color: '#7c3aed',
                textDecoration: 'none',
                background: '#fff',
                border: '1px solid rgba(124,58,237,0.4)',
                padding: '0.6rem 1.3rem',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                Track 2 — Broad &rarr;
              </a>
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
