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
        <EditionLayout year="2026" title="Participate" subtitle="Get started with the 2026 competition">
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
              }}>Now Open</span>
              <span>Tutorials and data are live so you can start now. Submissions open <strong>15 July 2026</strong> and close <strong>15 October 2026 (AoE)</strong>. More tutorial material is on the way.</span>
            </div>

            <p>We&apos;re excited for you to get started! Here&apos;s what your path through the 2026 competition looks like:</p>

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
              Additional tutorials &mdash; including deeper Track 1/Track 2 walkthroughs and a submission
              guide &mdash; will be released over the coming weeks. Follow along on{' '}
              <a href="http://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer">Discord</a>{' '}
              for announcements.
            </p>

            <hr />

            <h3>3. Submit on Kaggle</h3>
            <p>
              Each track has its own Kaggle competition. Submissions open on <strong>15 July 2026</strong>{' '}
              &mdash; you may enter either or both:
            </p>
            <ul>
              <li>
                <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-deep/" target="_blank" rel="noopener noreferrer"><strong>Track 1 &mdash; Deep</strong></a>
              </li>
              <li>
                <a href="https://www.kaggle.com/competitions/pnpl-competition-2026-broad/" target="_blank" rel="noopener noreferrer"><strong>Track 2 &mdash; Broad</strong></a>
              </li>
            </ul>
            <p>To submit:</p>
            <ol>
              <li>Create an account on <a href="https://www.kaggle.com/" target="_blank" rel="noopener noreferrer">Kaggle</a> if you don&apos;t already have one.</li>
              <li>Open the track page(s) above and <strong>accept the competition rules</strong> &mdash; you won&apos;t be able to submit until you do.</li>
              <li>Upload your submission file via the <em>Submit Predictions</em> button.</li>
            </ol>

            <hr />

            <h3>4. Check Performance on the Leaderboard</h3>
            <p>
              Track your standing and compare against other teams on the{' '}
              <Link href="/editions/2026/leaderboard/">2026 leaderboard</Link>.
            </p>

            <hr />

            <p>
              If you have any questions or need help, please join our{' '}
              <a href="http://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer">Discord server</a>{' '}
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
