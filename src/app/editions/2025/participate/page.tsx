import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function ParticipatePage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Participate" subtitle="Get started with the competition">
          <div className="prose-custom">
            <p>We&apos;re excited for you to get started! Here are some resources to help you along the way:</p>

            <hr />

            <h3>1. Ready to Start? Check Competition Rules and Different Tasks</h3>
            <p>
              Once you are ready to start you can read about the{' '}
              <Link href="/editions/2025/rules/">competition rules</Link>, the{' '}
              <Link href="/editions/2025/tracks/">different tasks</Link> and how submissions will be evaluated.
            </p>

            <hr />

            <h3>2. Play Around With the Data and Different Tasks</h3>
            <p>You can play around with the data and check the different tasks using our tutorials:</p>
            <ol>
              <li>
                <strong>Speech Detection</strong><br />
                <a href="https://colab.research.google.com/github/neural-processing-lab/2025-libribrain-competition/blob/main/static/colabs/2025/LibriBrain_Competition_Speech_Detection.ipynb" target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
              <li>
                <strong>Phoneme Classification (updated for Phase 2!)</strong><br />
                <a href="https://colab.research.google.com/github/neural-processing-lab/2025-libribrain-competition/blob/main/static/colabs/2025/LibriBrain_Competition_Phoneme_Classification.ipynb" target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
            </ol>

            <hr />

            <h3>3. Prepare Submission</h3>
            <p>When ready to submit, check out the tutorials to see how to generate a submission file:</p>
            <ul>
              <li>
                <strong>Phase 2: How to generate a Phoneme Classification submission</strong><br />
                <a href="https://colab.research.google.com/github/neural-processing-lab/2025-libribrain-competition/blob/main/static/colabs/2025/LibriBrain_Competition_Phoneme_Task_Submission_Tutorial.ipynb" target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
              <li>
                <strong>Phase 1 (over!): How to generate a Speech Detection submission</strong><br />
                <a href="https://colab.research.google.com/github/neural-processing-lab/2025-libribrain-competition/blob/main/static/colabs/2025/LibriBrain_Competition_Submission_Tutorial.ipynb" target="_blank" rel="noopener noreferrer">Open in Colab</a>
              </li>
            </ul>

            <hr />

            <h3>4. Submit on EvalAI</h3>
            <p>After obtaining your predictions in CSV format, submit them by following these steps:</p>
            <ol>
              <li>Create an account on <a href="https://eval.ai/" target="_blank" rel="noopener noreferrer">EvalAI</a>.</li>
              <li>Go to the <a href="https://eval.ai/web/challenges/challenge-page/2504/overview" target="_blank" rel="noopener noreferrer">challenge page</a>.</li>
              <li>Click on participate and create a participant team.</li>
              <li>Select appropriate phase and upload your predictions by selecting <em>Upload file</em> as submission type.</li>
            </ol>
            <p>
              Additionally, we recommend having a look at the{' '}
              <a href="https://evalai.readthedocs.io/en/latest/participate.html" target="_blank" rel="noopener noreferrer">
                EvalAI documentation on participating in a challenge
              </a>.
            </p>

            <hr />

            <h3>5. Check Performance on Leaderboards</h3>
            <p>You can then check the evaluation metrics and the leaderboards to see how your solution is performing.</p>
            <ul>
              <li>
                <strong>Speech Detection:</strong>{' '}
                <Link href="/editions/2025/leaderboard/">Standard Track</Link> |{' '}
                <Link href="/editions/2025/leaderboard/">Extended Track</Link>
              </li>
              <li>
                <strong>Phoneme Classification:</strong>{' '}
                <Link href="/editions/2025/leaderboard/">Standard Track</Link> |{' '}
                <Link href="/editions/2025/leaderboard/">Extended Track</Link>
              </li>
            </ul>

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
