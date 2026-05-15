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
              }}>Work in Progress</span>
              <span>This page is being finalised ahead of the competition opening in July 2026.</span>
            </div>

            <p>We&apos;re excited for you to get started! Here&apos;s what your path through the 2026 competition looks like:</p>

            <hr />

            <h3>1. Ready to Start? Check Competition Rules and the Task</h3>
            <p>
              Before diving in, read through the{' '}
              <Link href="/editions/2026/rules/">competition rules</Link>{' '}
              and the{' '}
              <Link href="/editions/2026/tracks/">task description</Link>{' '}
              to understand the challenge and how submissions will be evaluated.
            </p>

            <hr />

            <h3>2. Play Around With the Data Using Our Tutorials</h3>
            <p>Two complementary directions, depending on whether you want to go <strong>deep</strong> on a single subject or <strong>broad</strong> across many:</p>
            <ol>
              <li>
                <strong>Word Classification &mdash; Deep (Intro)</strong><br />
                <a href={`${COLAB_BASE}/PNPL_Competition_Word_Classification_Deep_Intro.ipynb`} target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
              <li>
                <strong>Word Classification &mdash; Deep (Advanced)</strong><br />
                <a href={`${COLAB_BASE}/PNPL_Competition_Word_Classification_Deep_Advanced.ipynb`} target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
              <li>
                <strong>Word Classification &mdash; Broad</strong><br />
                <a href={`${COLAB_BASE}/PNPL_Competition_Word_Classification_Broad.ipynb`} target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
            </ol>

            <hr />

            <h3>3. Submit on Kaggle</h3>
            <p>When you&apos;re ready to submit, follow the submission tutorial to produce a valid submission file:</p>
            <ul>
              <li>
                <strong>2026 Submission Tutorial</strong><br />
                <a href={`${COLAB_BASE}/PNPL_Competition_2026_Submission.ipynb`} target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
            </ul>
            <p>Then submit on Kaggle:</p>
            <ol>
              <li>Create an account on <a href="https://www.kaggle.com/" target="_blank" rel="noopener noreferrer">Kaggle</a> if you don&apos;t already have one.</li>
              <li>Go to the <a href="https://www.kaggle.com/competitions/pnpl-competition-2026/" target="_blank" rel="noopener noreferrer">PNPL Competition 2026 page</a> and <strong>accept the competition rules</strong> &mdash; you won&apos;t be able to submit until you do.</li>
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
              If you have any questions or need help, please check our{' '}
              <a href="https://discord.gg/Fqr8gJnvSh" target="_blank" rel="noopener noreferrer">Discord server</a>{' '}
              or send us your questions to:{' '}
              <a href="mailto:libribrain@robots.ox.ac.uk">libribrain@robots.ox.ac.uk</a>
            </p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
