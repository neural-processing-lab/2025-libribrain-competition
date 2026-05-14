import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function RulesPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Rules" subtitle="Competition rules and eligibility">
          <div className="prose-custom">
            <p>Rules for the 2026 PNPL Competition will largely follow the 2025 edition. Full rules will be published before the competition opens in June 2026.</p>
            <p>Key principles:</p>
            <ul>
              <li><strong>Open to All</strong> &mdash; No domain-specific knowledge or specialized hardware required.</li>
              <li><strong>Two tracks</strong> &mdash; Standard (LibriBrain100 data only) and Extended (any data).</li>
              <li><strong>Fair evaluation</strong> &mdash; Final rankings on an independent holdout set.</li>
              <li><strong>Open science encouraged</strong> &mdash; Share your code and contribute to the community.</li>
            </ul>
            <hr />
            <p>For reference, see the <a href="/editions/2025/rules/">2025 rules</a>.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
