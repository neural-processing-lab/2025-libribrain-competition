import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LINKS } from '../../../lib/links';

// Static export: one redirect page per short link, nothing else.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LINKS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const link = LINKS[slug];
  return {
    title: link ? `Redirecting to ${link.label}` : 'Not found',
    robots: { index: false, follow: false },
  };
}

export default async function ShortLinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const link = LINKS[slug];
  if (!link) notFound();
  const target = JSON.stringify(link.url);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '3rem 1.5rem', color: '#0a0a0a' }}>
      {/* React hoists <meta> into <head>; the meta refresh works without JavaScript. */}
      <meta httpEquiv="refresh" content={`0;url=${link.url}`} />
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace(${target});` }} />
      <p>
        Taking you to {link.label}. If nothing happens, follow this link:{' '}
        <a href={link.url} style={{ color: '#7c3aed' }}>{link.url}</a>
      </p>
    </main>
  );
}
