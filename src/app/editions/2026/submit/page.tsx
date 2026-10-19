import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import SubmitView, { type ReferenceTeam } from './SubmitView';
import { loadLeaderboard, type TrackId } from '../../../../lib/leaderboard';

export default function SubmitPage2026() {
  // The competition's final public standings, read at build time, so a new
  // result can be placed against them in the browser.
  const { metrics } = loadLeaderboard();
  const reference = Object.fromEntries(
    (['deep', 'broad'] as TrackId[]).map((track) => [
      track,
      (metrics[track]?.teams ?? []).map((t) => ({
        team: t.team,
        best: Object.fromEntries(Object.entries(t.best).map(([m, b]) => [m, b.value])),
      })),
    ]),
  ) as Record<TrackId, ReferenceTeam[]>;

  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Submit" subtitle="Evaluate new models on the held-out test set">
          <SubmitView reference={reference} />
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
