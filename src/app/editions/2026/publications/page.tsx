import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function PublicationsPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Publications" subtitle="Research papers">
          <div className="prose-custom">
            <p>Publications for the 2026 PNPL Competition will be listed here when available.</p>
            <p>In the meantime, see the <Link href="/editions/2025/publications/">2025 publications</Link> including the original LibriBrain dataset and competition papers.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
