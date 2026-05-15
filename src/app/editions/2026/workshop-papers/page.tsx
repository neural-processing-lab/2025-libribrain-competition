import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';

export default function WorkshopPapersPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Workshop Papers" subtitle="Accepted submissions">
          <div className="prose-custom">
            <p>Workshop paper submissions for the 2026 PNPL Competition will be accepted after the competition concludes.</p>
            <p>See the <a href="/editions/2025/workshop-papers/">2025 workshop papers</a> for examples of past submissions.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
