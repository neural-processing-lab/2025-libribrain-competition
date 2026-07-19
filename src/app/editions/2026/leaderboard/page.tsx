import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
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
          <LeaderboardView data={data} />
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
