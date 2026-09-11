import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';
import LeaderboardView from './LeaderboardView';
import { loadLeaderboard } from '../../../../lib/leaderboard';

export default function LeaderboardPage2026() {
  // Read at build time. The site is a static export, so the Kaggle token stays
  // in CI and the standings ship as plain HTML; the refresh workflow redeploys
  // whenever they move.
  const data = loadLeaderboard();

  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout
          year="2026"
          title="Leaderboard"
          subtitle="Live standings from the Kaggle public leaderboards"
        >
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '2rem',
            fontSize: '14px',
            lineHeight: 1.55,
            color: '#78350f'
          }}>
            <strong>Leaderboard notice:</strong> using the released <code>word_onset_s</code> or{' '}
            <code>shuffle_seed</code> metadata to map Deep track predictions onto Broad track samples is against
            the rules and will lead to disqualification.{' '}
            <Link href="/blog/competition-leaderboard-announcement/" style={{
              color: '#b45309',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}>
              Read the full announcement &rarr;
            </Link>
          </div>
          <LeaderboardView data={data} />
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
