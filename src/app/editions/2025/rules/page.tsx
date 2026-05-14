import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function RulesPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Rules" subtitle="Competition rules and eligibility">
          <div className="prose-custom">
            <p>The primary aim of the competition is to foster innovation across all levels of expertise and resources. With that in mind, we have tried to make the rules as inclusive as possible.</p>

            <hr />

            <h3>1. Eligibility &amp; Participation</h3>
            <ul>
              <li><strong>Open to All</strong> &mdash; No domain-specific knowledge or specialized hardware is required. Everyone is welcome to join.</li>
              <li><strong>Inclusivity</strong> &mdash; We aim for the broadest participation. If you&apos;re unable to complete a full submission, you will <strong>not</strong> be penalized; partial entries are still encouraged.</li>
            </ul>

            <hr />

            <h3>2. Tracks</h3>
            <p>We offer <strong>two parallel tracks</strong> to balance resource-driven and method-driven innovation:</p>
            <ol>
              <li>
                <strong>Standard Track</strong>
                <ul>
                  <li><strong>Data Constraint:</strong> Only the LibriBrain training dataset may be used.</li>
                  <li><strong>Purpose:</strong> Level the playing field for teams with limited compute or data access.</li>
                </ul>
              </li>
              <li>
                <strong>Extended Track</strong>
                <ul>
                  <li><strong>No Data Limits:</strong> Participants may use any publicly available or proprietary data they believe will help.</li>
                  <li><strong>Purpose:</strong> Reward scale-driven breakthroughs without data restrictions.</li>
                </ul>
              </li>
            </ol>

            <blockquote>
              <strong>Note:</strong> You may submit to both tracks. Your progress will appear on each leaderboard, but <strong>prize money can only be won once per team</strong>. If your team ranks first on both tracks, you&apos;ll still be listed on both leaderboards; the prize for the second win rolls down to the next eligible team.
            </blockquote>

            <hr />

            <h3>3. Prizes &amp; Evaluation</h3>
            <ul>
              <li>
                <strong>Benchmarks to Beat</strong>
                <ul>
                  <li>Speech Detection: F1<sub>macro</sub> &ge; 68%</li>
                  <li>Phoneme Classification: F1<sub>macro</sub> &ge; 6.1%</li>
                </ul>
              </li>
              <li>
                <strong>Winners</strong> &mdash; Top 3 confirmed submissions in the standard track, <strong>provided</strong> they exceed the benchmarks. Special recognition for the best verified submission in the extended track.
              </li>
              <li>
                <strong>Verification</strong>
                <ul>
                  <li>Standard Track finalists: organizers will request training code to confirm no external data was used.</li>
                  <li>Extended Track finalists: we will reach out to discuss compute usage and verify that submissions improve from inclusion of multiple datasets.</li>
                </ul>
              </li>
            </ul>

            <hr />

            <h3>4. Code Sharing &amp; Open Science</h3>
            <p>While not strictly required, you are strongly encouraged to:</p>
            <ul>
              <li>Share your solution code publicly (e.g., GitHub).</li>
              <li>Contribute to the PNPL library by submitting pull requests with any modifications you found useful.</li>
            </ul>

            <hr />

            <h3>5. Data Leakage &amp; Final Ranking</h3>
            <p>To ensure fairness, all final rankings are determined on an <strong>independent holdout dataset</strong> that participants cannot access.</p>

            <hr />

            <h3>6. Communication &amp; Support</h3>
            <ul>
              <li><strong>Primary Platform:</strong> Join our <a href="https://discord.gg/libribrain" target="_blank" rel="noopener noreferrer">Discord server</a> for real-time Q&amp;A, technical support, and community discussion.</li>
              <li><strong>Updates &amp; Announcements:</strong> Important rule changes, deadline reminders, and clarifications will be posted in the Discord channel.</li>
            </ul>

            <hr />

            <p>Thank you for participating! We look forward to seeing your innovative approaches and celebrating the societal impact of speech decoding technologies.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
