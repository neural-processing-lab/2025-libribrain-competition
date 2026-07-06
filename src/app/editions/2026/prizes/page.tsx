import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function PrizesPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Prizes" subtitle="Awards and recognition">
          <div className="prose-custom">
            <p>
              Prizes are awarded on <strong>both tracks</strong> &mdash;{' '}
              <Link href="/editions/2026/tracks/">Deep and Broad</Link>. The{' '}
              <strong>top 3 confirmed teams</strong> on each track win prizes, provided they beat the
              reference baselines.
            </p>

            <ul>
              <li>
                <strong>Beat the baselines.</strong> Only submissions that exceed the published reference
                baselines are eligible for prizes. Baseline values will be announced ahead of the
                submission window.
              </li>
              <li>
                <strong>One prize per team.</strong> Each team may only win prize money <strong>once</strong>{' '}
                across the entire competition. If the same team places in the top 3 on multiple
                leaderboards, they will still be listed on all of them, but the prize for each additional
                placement rolls down to the next-ranked eligible team.
              </li>
              <li>
                <strong>Ties.</strong> In the unlikely event of a tie, the prize will be split.
              </li>
            </ul>

            <hr />

            <h3>Confirmation</h3>
            <p>
              Final winners are confirmed through <Link href="/editions/2026/rules/">verification</Link>:
              after the deadline, top-ranking teams provide runnable model checkpoints (and, if requested,
              training code). The top 3 teams per track whose submissions are confirmed are declared the
              winners.
            </p>

            <hr />

            <p>
              Full prize amounts will be published before submissions open. For reference, see the{' '}
              <Link href="/editions/2025/prizes/">2025 winners</Link>.
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
