import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

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
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        <Footer />
      </main>
    </>
  );
}
