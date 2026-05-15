import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function LeaderboardPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Leaderboard" subtitle="Competition rankings and scores">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
            <p>
              The leaderboard shows the top submissions for each track. For full interactive leaderboards with charts, visit the original competition page.
            </p>

            <div style={{
              background: '#f8f5fb',
              border: '1px solid rgba(119,104,133,0.15)',
              borderRadius: '6px',
              padding: '1.2rem 1.5rem',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '14px', color: '#555' }}>
                View full interactive leaderboards on EvalAI:
              </span>
              <a
                href="https://eval.ai/web/challenges/challenge-page/2504/leaderboard"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: '#fff',
                  background: '#776885',
                  padding: '0.4rem 1rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                EvalAI Leaderboard &rarr;
              </a>
            </div>

            {/* Speech Detection */}
            <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 1.5rem 0' }}>
              Speech Detection
            </h2>

            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#776885', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standard Track
            </h3>
            <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Rank</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Team</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>F1 Macro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, team: 'Parameter Team', score: 'Winner' },
                    { rank: 2, team: 'TheLimbicLad', score: '2nd Place' },
                    { rank: 3, team: 'alvi', score: '3rd Place' },
                  ].map(row => (
                    <tr key={row.rank} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>#{row.rank}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{row.team}</td>
                      <td style={{ padding: '0.7rem 1rem', textAlign: 'right', color: '#776885', fontWeight: 600 }}>{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#776885', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Extended Track
            </h3>
            <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '2.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Rank</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Team</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>F1 Macro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, team: 'Sherlock Holmes', score: 'Winner' },
                    { rank: 2, team: 'SHINE', score: '2nd Place' },
                    { rank: 3, team: 'I_love_silksong', score: 'Honourable Mention' },
                  ].map(row => (
                    <tr key={row.rank} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>#{row.rank}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{row.team}</td>
                      <td style={{ padding: '0.7rem 1rem', textAlign: 'right', color: '#776885', fontWeight: 600 }}>{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phoneme Classification */}
            <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 1.5rem 0' }}>
              Phoneme Classification
            </h2>

            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#776885', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standard Track
            </h3>
            <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Rank</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Team</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>F1 Macro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, team: 'neural2speech', score: 'Winner' },
                    { rank: 2, team: 'BrainWatson', score: '2nd Place' },
                    { rank: 3, team: 'sigint', score: '3rd Place' },
                  ].map(row => (
                    <tr key={row.rank} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>#{row.rank}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>{row.team}</td>
                      <td style={{ padding: '0.7rem 1rem', textAlign: 'right', color: '#776885', fontWeight: 600 }}>{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#776885', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Extended Track
            </h3>
            <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Rank</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Team</th>
                    <th style={{ padding: '0.7rem 1rem', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>F1 Macro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderTop: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.7rem 1rem', fontWeight: 500 }}>#1</td>
                    <td style={{ padding: '0.7rem 1rem' }}>I_love_silksong</td>
                    <td style={{ padding: '0.7rem 1rem', textAlign: 'right', color: '#776885', fontWeight: 600 }}>Honourable Mention</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
