import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export default async function BlogPage() {
  const posts = await getAllPosts();

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
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/" style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#999',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              &larr; LibriBrain
            </Link>
            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: 200,
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem 0'
            }}>
              Blog &amp; News
            </h1>
            <p style={{ fontSize: '18px', color: '#666', margin: 0, fontWeight: 300 }}>
              Updates, announcements, and technical deep dives from the PNPL Competition.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section style={{
          padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {posts.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '3rem 0' }}>
              No blog posts yet. Check back soon!
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '0' }}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    padding: '1.5rem 0',
                    borderBottom: '1px solid #eee',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <h2 style={{
                        fontSize: '20px',
                        fontWeight: 500,
                        margin: '0 0 0.4rem 0',
                        lineHeight: 1.3,
                        color: '#0a0a0a'
                      }}>
                        {post.title}
                      </h2>
                      <p style={{
                        fontSize: '15px',
                        color: '#666',
                        margin: '0 0 0.5rem 0',
                        lineHeight: 1.5
                      }}>
                        {post.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#999' }}>{post.date}</span>
                        {post.authors.length > 0 && (
                          <span style={{ fontSize: '13px', color: '#bbb' }}>
                            &middot; {post.authors.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: '16px', color: '#ccc', flexShrink: 0, paddingTop: '0.2rem' }}>&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </main>
    </>
  );
}
