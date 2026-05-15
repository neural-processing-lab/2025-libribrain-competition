import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import Link from 'next/link';

export default function FAQPage2026() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2026" title="FAQ" subtitle="Frequently Asked Questions">
          <div className="prose-custom">
            <p>FAQ for the 2026 PNPL Competition is coming soon. Many answers from the <Link href="/editions/2025/faq/">2025 FAQ</Link> will still apply.</p>
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
