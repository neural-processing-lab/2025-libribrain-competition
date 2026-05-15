'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems2025 = [
  { label: 'Overview', href: '/editions/2025/' },
  { label: 'Tracks', href: '/editions/2025/tracks/' },
  { label: 'Prizes', href: '/editions/2025/prizes/' },
  { label: 'Timeline', href: '/editions/2025/timeline/' },
  { label: 'Rules', href: '/editions/2025/rules/' },
  { label: 'Participate', href: '/editions/2025/participate/' },
  { label: 'Leaderboard', href: '/editions/2025/leaderboard/' },
  { label: 'Papers', href: '/editions/2025/workshop-papers/' },
  { label: 'Publications', href: '/editions/2025/publications/' },
  { label: 'Organisers', href: '/editions/2025/organisers/' },
  { label: 'FAQ', href: '/editions/2025/faq/' },
];

const navItems2026 = [
  { label: 'Overview', href: '/editions/2026/' },
  { label: 'Task', href: '/editions/2026/tracks/' },
  { label: 'Timeline', href: '/editions/2026/timeline/' },
  { label: 'Rules', href: '/editions/2026/rules/' },
  { label: 'Participate', href: '/editions/2026/participate/' },
  { label: 'Leaderboard', href: '/editions/2026/leaderboard/' },
  { label: 'Publications', href: '/editions/2026/publications/' },
  { label: 'Organisers', href: '/editions/2026/organisers/' },
  { label: 'FAQ', href: '/editions/2026/faq/' },
];

interface EditionLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  year?: '2025' | '2026';
}

export default function EditionLayout({ children, title, subtitle, year = '2025' }: EditionLayoutProps) {
  const pathname = usePathname();
  const navItems = year === '2026' ? navItems2026 : navItems2025;
  const isArchived = year === '2025';
  const isCurrent = year === '2026';


  return (
    <div>
      {/* Edition Header */}
      <section style={{
        padding: 'clamp(5rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 3vw, 2rem)',
        background: isArchived ? '#f5f3f7' : '#fff',
        color: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #eee'
      }}>
        {/* Animated blobs */}
        <div className="hero-blob" style={{ width: 300, height: 300, background: isArchived ? '#d4d0dc' : '#c4b5fd', top: '-60px', right: '10%', filter: 'blur(60px)', opacity: isArchived ? 0.5 : 0.35, animation: 'blobFloat1 12s ease-in-out infinite' }} />
        <div className="hero-blob" style={{ width: 250, height: 250, background: isArchived ? '#c5ccd6' : '#93c5fd', bottom: '-40px', left: '15%', filter: 'blur(60px)', opacity: isArchived ? 0.45 : 0.3, animation: 'blobFloat2 15s ease-in-out infinite' }} />
        <div className="hero-blob" style={{ width: 200, height: 200, background: isArchived ? '#cdc5d8' : '#d8b4fe', top: '30%', left: '60%', filter: 'blur(50px)', opacity: isArchived ? 0.4 : 0.25, animation: 'blobFloat3 10s ease-in-out infinite' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontWeight: 100,
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.1
            }}>
              {title}
            </h1>
            {isArchived && (
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'rgba(0,0,0,0.05)',
                padding: '0.3rem 0.7rem',
                borderRadius: '6px',
                color: '#999'
              }}>
                Archived
              </span>
            )}
            {isCurrent && (
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'rgba(124,58,237,0.08)',
                padding: '0.3rem 0.7rem',
                borderRadius: '6px',
                color: '#7c3aed'
              }}>
                Current
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              color: '#888',
              margin: '0.5rem 0 0 0',
              fontWeight: 300
            }}>
              {subtitle}
            </p>
          )}
          {isArchived && (
            <p style={{
              fontSize: '14px',
              color: '#999',
              margin: '1rem 0 0 0',
              fontWeight: 400
            }}>
              This edition has concluded.{' '}
              <Link href="/editions/2026/" style={{
                color: '#7c3aed',
                textDecoration: 'none',
                fontWeight: 600
              }}>
                Go to the 2026 PNPL Competition &rarr;
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Sub-navigation */}
      <div style={{
        borderBottom: '1px solid #eee',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '0',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0 clamp(1rem, 4vw, 2rem)'
        }}>
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname === item.href.replace(/\/$/, '');
            const accentColor = year === '2026' ? '#7c3aed' : '#776885';
            return (
              <Link key={item.href} href={item.href} style={{
                fontSize: '12px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: isActive ? accentColor : '#888',
                textDecoration: 'none',
                padding: '0.9rem 0.75rem',
                borderBottom: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <section style={{
        padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {children}
      </section>
    </div>
  );
}
