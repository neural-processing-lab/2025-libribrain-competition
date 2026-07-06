import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function RulesPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Rules" subtitle="Competition rules and eligibility">
          <div className="prose-custom">

            <h3>Getting started</h3>
            <p>
              This challenge encourages broad participation and aims to advance the societal impact of
              speech decoding technologies. Everyone is welcome &mdash; no neuroscience background or
              specialised hardware required. Free GPU access is available through{' '}
              <a href="https://colab.research.google.com/" target="_blank" rel="noopener noreferrer">Google Colab</a>.
            </p>

            <hr />

            <h3>Tracks and divisions</h3>
            <p>
              The competition uses the <strong>LibriBrain100</strong> dataset and has <strong>two tracks</strong>,
              both evaluated on <strong>word classification</strong> (top-10 balanced accuracy over a
              vocabulary of 50 words):
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Track 1 &mdash; <em>Deep</em></th>
                    <th>Track 2 &mdash; <em>Broad</em></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Goal</th>
                    <td>Word classification on a single, deeply-sampled subject (<code>subj0</code>)</td>
                    <td>Word classification across 32 held-out subjects (<code>subj1</code>&ndash;<code>subj32</code>)</td>
                  </tr>
                  <tr>
                    <th>Training data</th>
                    <td>Extensive recordings from <code>subj0</code> across audiobooks, phonetically balanced speech corpora (TIMIT, MOCHA-TIMIT), and narrative podcasts</td>
                    <td>Varying amounts of labelled data per subject (see below)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <strong>Track 2 data groups.</strong> To study how performance scales with the amount of
              fine-tuning data, subjects in Track 2 are split into groups:
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Subjects</th>
                    <th>Labelled data per subject</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>100%</td><td>12</td><td>~40 min of audiobook listening</td></tr>
                  <tr><td>50%</td><td>10</td><td>~20 min of audiobook listening</td></tr>
                  <tr><td>25%</td><td>10</td><td>~10 min of audiobook listening</td></tr>
                </tbody>
              </table>
            </div>

            <hr />

            <h3>Submissions and leaderboards</h3>
            <ul>
              <li>You may submit to either or both tracks. Your progress will appear on the relevant leaderboard.</li>
              <li>Final rankings are determined on <strong>independent holdout data</strong> recorded with stimuli that are entirely different from anything released to participants.</li>
              <li>Submissions must beat the reference baselines to be eligible for prizes. Baseline values will be published ahead of the submission window.</li>
            </ul>

            <hr />

            <h3>Prizes</h3>
            <ul>
              <li>The <strong>top 3 confirmed teams</strong> per track win prizes, provided they beat the baselines.</li>
              <li>Each team may only win prize money <strong>once</strong> across the entire competition. If the same team places in the top 3 on multiple leaderboards, they will still be listed on all of them, but the prize for each additional placement goes to the next-ranked team.</li>
              <li>In the unlikely event of a tie, the prize will be split.</li>
            </ul>
            <p>See the <Link href="/editions/2026/prizes/">Prizes page</Link> for details.</p>

            <hr />

            <h3>Verification</h3>
            <p>
              After the submission deadline, all top-ranking teams will be asked to provide runnable{' '}
              <strong>model checkpoints</strong>. We may also ask specific teams to provide their{' '}
              <strong>training code</strong> so we can verify no cheating took place.
            </p>
            <p>
              The top 3 teams per track whose submissions are confirmed through this process will be
              declared the winners.
            </p>

            <hr />

            <h3>Open science</h3>
            <p>
              We strongly encourage all participants to share their code openly. We also welcome pull
              requests to the{' '}
              <a href="https://github.com/neural-processing-lab/pnpl" target="_blank" rel="noopener noreferrer">PNPL library</a>{' '}
              &mdash; for example, adding data loaders for new datasets to accelerate the community.
            </p>

            <hr />

            <h3>Communication</h3>
            <p>
              We have set up a <strong>Discord server</strong>, which already has an active community of
              researchers working on neural speech decoding. Join here:{' '}
              <a href="http://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer">Discord invite link</a>.
            </p>

          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
