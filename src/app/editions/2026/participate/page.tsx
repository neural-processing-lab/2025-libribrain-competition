import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

const COLAB_BASE = 'https://colab.research.google.com/github/neural-processing-lab/2025-libribrain-competition/blob/main/static/colabs/2026';

export default function ParticipatePage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Participate" subtitle="How the 2026 competition works">
          <div className="prose-custom">
            <div style={{
              background: 'repeating-linear-gradient(45deg, #faf8ff, #faf8ff 10px, #f3eeff 10px, #f3eeff 20px)',
              border: '1px dashed rgba(124,58,237,0.4)',
              borderRadius: '8px',
              padding: '0.9rem 1.25rem',
              margin: '0 0 2rem 0',
              fontSize: '14px',
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap',
              lineHeight: 1.5
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7c3aed',
                background: 'rgba(124,58,237,0.12)',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                flexShrink: 0
              }}>Closed</span>
              <span>Submissions closed on <strong>15 October 2026 (AoE)</strong>. We are now verifying top-performing teams &mdash; see the{' '}
                <Link href="/blog/competition-closed-verification-and-write-ups/">announcement</Link> for how to submit your model for verification. Tutorials and data remain available, and you can still{' '}
                <Link href="/editions/2026/submit/">evaluate new submissions</Link> on the public test split.</span>
            </div>

            <p>Thank you for taking part! Here&apos;s what the path through the 2026 competition looked like, and what happens next:</p>

            <hr />

            <h3>1. Ready to Start? Check Competition Rules and the Task</h3>
            <p>
              Before diving in, read through the{' '}
              <Link href="/editions/2026/rules/">competition rules</Link>{' '}
              and the{' '}
              <Link href="/editions/2026/tracks/">task description</Link>{' '}
              to understand the challenge, the two tracks (Deep and Broad), and how submissions are
              evaluated (top-10 balanced accuracy over a 50-word vocabulary).
            </p>

            <hr />

            <h3>2. Play Around With the Data Using Our Tutorial</h3>
            <p>
              Start with our beginner notebook. It walks you through the LibriBrain100 dataset, a single MEG
              example, the fixed 50-word vocabulary, and training and evaluating your first
              word-classification model &mdash; from zero, on a free Colab GPU:
            </p>
            <ul>
              <li>
                <strong>Word Classification &mdash; Intro</strong><br />
                <a href={`${COLAB_BASE}/LibriBrain_Competition_Word_Classification_Intro.ipynb`} target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
            </ul>
            <p style={{ fontSize: '15px', color: '#777' }}>
              More notebooks &mdash; including deeper Deep and Broad Track walkthroughs and a submission
              guide &mdash; are in the{' '}
              <a href="https://github.com/neural-processing-lab/2025-libribrain-competition/tree/main/static/colabs/2026" target="_blank" rel="noopener noreferrer">competition repository</a>.
            </p>

            <hr />

            <h3>3. Submit Your Predictions</h3>
            <p>
              Each track had its own Kaggle competition, open from <strong>15 July</strong> to{' '}
              <strong>15 October 2026</strong>. Submissions there are now closed, but you can score new
              predictions on our <Link href="/editions/2026/submit/">submission page</Link>: files in the
              Kaggle format are scored against the public split of the held-out test set, so you can see how
              they would have scored.
            </p>
            <p>
              The Kaggle competitions:
            </p>
            <ul>
              <li>
                <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-deep/" target="_blank" rel="noopener noreferrer"><strong>Track 1 &mdash; Deep</strong></a>
              </li>
              <li>
                <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-broad/" target="_blank" rel="noopener noreferrer"><strong>Track 2 &mdash; Broad</strong></a>
              </li>
            </ul>

            <hr />

            <h3>4. Check Performance on the Leaderboard</h3>
            <p>
              See the final public standings on the{' '}
              <Link href="/editions/2026/leaderboard/">2026 leaderboard</Link>. Final rankings use a separate
              holdout set and are subject to verification.
            </p>

            <hr />

            <h3>5. Verification and Write-ups</h3>
            <p>
              To be considered for prizes, or to have your score verified, email{' '}
              <a href="mailto:libribrain@robots.ox.ac.uk">libribrain@robots.ox.ac.uk</a> with your Kaggle team
              name, username(s) and track(s), and send your checkpoints (and, for the Broad Track, your
              training code) by <strong>30 October 2026</strong>. Invited teams
              and teams in the public top 20 can also submit a{' '}
              <Link href="/editions/2026/workshop-papers/">write-up</Link> of their approach, which we plan to host on
              this website, by{' '}
              <strong>1 December 2026</strong>. Full details are in the{' '}
              <Link href="/blog/competition-closed-verification-and-write-ups/">announcement</Link>.
            </p>

            <hr />

            <p>
              If you have any questions or need help, please join our{' '}
              <a href="https://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer">Discord server</a>{' '}
              or send your questions to:{' '}
              <a href="mailto:libribrain@robots.ox.ac.uk">libribrain@robots.ox.ac.uk</a>
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
