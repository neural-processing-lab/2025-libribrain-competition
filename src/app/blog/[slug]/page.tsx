import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Citations from '../../components/Citations';
import BlogPostCitation from '../../components/BlogPostCitation';
import OVMIVisualizer from '../../components/OVMIVisualizer';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Posts can embed the interactive OVMI widget with this HTML comment in the markdown.
const OVMI_VISUALIZER_MARKER = '<!-- OVMI_VISUALIZER -->';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const hasOvmiVisualizer = post.content.includes(OVMI_VISUALIZER_MARKER);
  const [contentBefore, ...contentAfterParts] = hasOvmiVisualizer
    ? post.content.split(OVMI_VISUALIZER_MARKER)
    : [post.content];
  const contentAfter = contentAfterParts.join(OVMI_VISUALIZER_MARKER);

  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        {/* Header */}
        <section style={{
          padding: 'clamp(6rem, 12vw, 8rem) clamp(1rem, 4vw, 2rem) clamp(2rem, 4vw, 3rem)',
          background: '#fafafa',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <Link href="/blog/" style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#999',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              &larr; All Posts
            </Link>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: '0 0 1rem 0',
              lineHeight: 1.2
            }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '14px', color: '#888' }}>
              <span>{post.date}</span>
              {post.authors.length > 0 && (
                <span>&middot; {post.authors.join(', ')}</span>
              )}
            </div>
            {post.externalUrl && (
              <p style={{ fontSize: '13px', color: '#999', margin: '0.6rem 0 0' }}>
                Originally published on{' '}
                <a
                  href={post.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#776885', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                >
                  {post.externalSource || 'the original site'}
                </a>
              </p>
            )}
            {post.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '11px',
                    background: 'rgba(119,104,133,0.08)',
                    color: '#776885',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '10px',
                    letterSpacing: '0.02em'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section style={{
          padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)',
          maxWidth: '750px',
          margin: '0 auto'
        }}>
          <div className="prose-custom">
            {hasOvmiVisualizer ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: contentBefore }} />
                <OVMIVisualizer />
                <div dangerouslySetInnerHTML={{ __html: contentAfter }} />
              </>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>

          {post.selfCitation && (
            <BlogPostCitation bibtex={post.selfCitation} target={post.citationTarget} />
          )}

          {post.citations && post.citations.length > 0 && (
            <Citations citations={post.citations} />
          )}
        </section>

        <Footer />
      </main>
    </>
  );
}
