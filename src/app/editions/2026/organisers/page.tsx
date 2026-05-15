import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function OrganisersPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="Organisers" subtitle="The team behind the 2026 PNPL Competition">
          <div className="prose-custom">
            <p>The organising team for the 2026 PNPL Competition will be announced soon. The competition continues to be led by the <a href="https://pnpl.robots.ox.ac.uk/" target="_blank" rel="noopener noreferrer">Parker Jones Neural Processing Lab (PNPL)</a> at Oxford.</p>
            <p>For reference, see the <Link href="/editions/2025/organisers/">2025 organisers</Link>.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
