'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import wordart from '../wordart';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    setIsVisible(true);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
      backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
      borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent',
      transition: 'all 0.4s ease',
      padding: isScrolled ? '0.6rem 1rem' : '0.8rem 1rem',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      pointerEvents: isVisible ? 'auto' : 'none'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Link href="/" aria-label="PNPL Competition" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          textDecoration: 'none',
          color: '#0a0a0a'
        }}>
          <span style={{
            display: 'inline-block',
            width: '26px',
            height: '28px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <pre style={{
              fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
              fontSize: '9px',
              fontWeight: 700,
              lineHeight: 1,
              margin: 0,
              color: '#4c1d95',
              whiteSpace: 'pre',
              userSelect: 'none',
              transform: 'scale(0.07)',
              transformOrigin: 'top left'
            }}>
              {wordart}
            </pre>
          </span>
          <span className="desktop-only" style={{
            fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
            fontSize: 'clamp(13px, 2.5vw, 16px)',
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            PNPL <span style={{ color: '#7c3aed' }}>Competition</span>
          </span>
        </Link>

        <div style={{
          display: 'flex',
          gap: 'clamp(0.5rem, 2vw, 1.5rem)',
          alignItems: 'center'
        }}>
          {[
            { label: '2026', href: '/editions/2026/' },
            { label: '2025', href: '/editions/2025/' },
            { label: 'Blog', href: '/blog/' },
            { label: 'Papers', href: '/editions/2025/workshop-papers/' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="nav-link" style={{
              fontSize: 'clamp(11px, 1.8vw, 13px)',
              color: '#666',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/editions/2026/participate/"
            className="nav-button"
            style={{
              fontSize: 'clamp(10px, 1.8vw, 12px)',
              color: '#0a0a0a',
              border: '1px solid #0a0a0a',
              padding: 'clamp(0.3rem, 0.8vw, 0.4rem) clamp(0.6rem, 1.5vw, 0.9rem)',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '4px',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
          >
            Participate
          </Link>
        </div>
      </div>
    </nav>
  );
}
