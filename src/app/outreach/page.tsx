import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OutreachKit from './OutreachKit';

// Not linked from the navigation; shared directly with partners and colleagues.
export const metadata: Metadata = {
  title: 'Outreach kit | PNPL Competition 2026',
  description:
    'Poster, shareable text and a ready-made post to help spread the word about the 2026 PNPL Competition.',
};

export default function OutreachPage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <section
          style={{
            padding: 'clamp(5rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 3vw, 2rem)',
            background: '#fff',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid #eee',
          }}
        >
          <div className="hero-blob" style={{ width: 300, height: 300, background: '#c4b5fd', top: '-60px', right: '10%', filter: 'blur(60px)', opacity: 0.35, animation: 'blobFloat1 12s ease-in-out infinite' }} />
          <div className="hero-blob" style={{ width: 250, height: 250, background: '#93c5fd', bottom: '-40px', left: '15%', filter: 'blur(60px)', opacity: 0.3, animation: 'blobFloat2 15s ease-in-out infinite' }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 100, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
                Outreach kit
              </h1>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(124,58,237,0.08)', padding: '0.3rem 0.7rem', borderRadius: '6px', color: '#7c3aed' }}>
                2026 edition
              </span>
            </div>
            <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#888', margin: '0.5rem 0 0 0', fontWeight: 300 }}>
              Help us spread the word about the 2026 PNPL Competition
            </p>
            <p style={{ fontSize: '14px', color: '#999', margin: '1rem 0 0 0' }}>
              Thank you for sharing! Everything below is free to reuse. Questions? Reach us via the{' '}
              <Link href="/editions/2026/faq/" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>FAQ</Link> or Discord.
            </p>
          </div>
        </section>

        <section style={{ padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)', maxWidth: '960px', margin: '0 auto' }}>
          <OutreachKit />
        </section>
        <Footer />
      </main>
    </>
  );
}
