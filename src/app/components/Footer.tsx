import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      color: '#fff',
      padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)',
      borderTop: '1px solid #333',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(119,104,133,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(119,104,133,0.05) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          marginBottom: 'clamp(2rem, 5vw, 3rem)'
        }}>
          <div>
            <h3 style={{
              fontSize: 'clamp(18px, 3vw, 22px)',
              margin: '0 0 1rem 0',
              fontWeight: 200,
              letterSpacing: '-0.02em'
            }}>
              PNPL Competition
            </h3>
            <p style={{
              fontSize: 'clamp(13px, 2.5vw, 15px)',
              opacity: 0.7,
              margin: '0 0 1rem 0',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Annual neural speech decoding competition organized by the Parker Jones Neural Processing Lab.
            </p>
            <p style={{
              fontSize: 'clamp(12px, 2vw, 13px)',
              opacity: 0.5,
              margin: 0,
              lineHeight: 1.6
            }}>
              Oxford Robotics Institute<br />
              University of Oxford
            </p>
          </div>

          <div>
            <h4 style={{
              fontSize: 'clamp(11px, 2vw, 13px)',
              margin: '0 0 1.2rem 0',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              opacity: 0.7
            }}>
              Competition
            </h4>
            <div style={{ display: 'grid', gap: '0.7rem' }}>
              {[
                { label: 'Current Edition (2026)', href: '/editions/2026/' },
                { label: '2025 Edition', href: '/editions/2025/' },
                { label: 'Blog & News', href: '/blog/' },
                { label: 'Workshop Papers', href: '/editions/2025/workshop-papers/' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="footer-link" style={{
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  color: '#fff',
                  textDecoration: 'none',
                  opacity: 0.6,
                  transition: 'all 0.3s ease',
                  display: 'block'
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{
              fontSize: 'clamp(11px, 2vw, 13px)',
              margin: '0 0 1.2rem 0',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              opacity: 0.7
            }}>
              Connect
            </h4>
            <div style={{ display: 'grid', gap: '0.7rem' }}>
              {[
                { label: 'libribrain@robots.ox.ac.uk', href: 'mailto:libribrain@robots.ox.ac.uk' },
                { label: 'PNPL Lab Website', href: 'https://pnpl.robots.ox.ac.uk/' },
                { label: 'GitHub (pnpl)', href: 'https://github.com/neural-processing-lab/pnpl' },
                { label: 'Oxford Robotics Institute', href: 'https://ori.ox.ac.uk/' },
              ].map(link => (
                <a key={link.href} href={link.href} target={link.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" className="footer-link" style={{
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  color: '#fff',
                  textDecoration: 'none',
                  opacity: 0.6,
                  transition: 'all 0.3s ease',
                  display: 'block'
                }}>
                  {link.label} {!link.href.startsWith('mailto') ? '\u2192' : ''}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #333',
          paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ fontSize: 'clamp(10px, 1.8vw, 12px)', opacity: 0.35, margin: 0, letterSpacing: '0.02em' }}>
            &copy; {new Date().getFullYear()} Parker Jones Neural Processing Lab. All rights reserved.
          </p>
          <p style={{ fontSize: 'clamp(10px, 1.8vw, 12px)', opacity: 0.35, margin: 0, letterSpacing: '0.02em' }}>
            Part of the University of Oxford
          </p>
        </div>
      </div>
    </footer>
  );
}
