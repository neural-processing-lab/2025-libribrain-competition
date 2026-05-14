import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function PrizesPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Prizes" subtitle="Awards and recognition">
          <div className="prose-custom">
            <p>Prize details for the 2026 PNPL Competition will be announced before the competition opens.</p>
            <p>See the <a href="/editions/2025/prizes/">2025 winners</a> for reference.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
