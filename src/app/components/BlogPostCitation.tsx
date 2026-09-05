'use client';

import React, { useState, useEffect } from 'react';

interface BlogPostCitationProps {
  bibtex: string;
  target?: "blog" | "paper";
}

export default function BlogPostCitation({ bibtex, target = "blog" }: BlogPostCitationProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const baseButtonColor = '#4a4a4a';
  const hoverButtonColor = '#333333';
  const successButtonColor = '#2e7d32';

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyBibTeX = async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy BibTeX:', err);
    }
  };

  return (
    <section style={{
      marginTop: '3rem',
      marginBottom: '2rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #ebebeb 100%)',
      borderRadius: '12px',
      border: '2px solid #e0e0e0',
      position: 'relative'
    }}>
      {/* Decorative element */}
      <div style={{
        position: 'absolute',
        top: '-1px',
        left: '2rem',
        right: '2rem',
        height: '3px',
        background: 'linear-gradient(90deg, #bdbdbd, #9e9e9e, #bdbdbd)',
        borderRadius: '2px'
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: '#444',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              fontSize: '20px'
            }}>📄</span>
            {target === "paper" ? "Cite the paper" : "Cite this blog post"}
          </h3>
          
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
            lineHeight: 1.4
          }}>
            {target === "paper"
              ? "If you enjoyed this blog post, please cite the paper."
              : "Use this citation format to reference this blog post in your research"}
          </p>
        </div>
        
        {mounted && (
          <button
            onClick={copyBibTeX}
            style={{
              background: copied ? successButtonColor : baseButtonColor,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '120px',
              boxShadow: copied
                ? '0 2px 8px rgba(46, 125, 50, 0.25)'
                : '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.background = hoverButtonColor;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.background = baseButtonColor;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {copied ? '✓ Copied!' : 'Copy BibTeX'}
          </button>
        )}
      </div>

      <pre
        style={{
          marginTop: '1.5rem',
          background: '#f0f0f0',
          color: '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          overflowX: 'auto',
          fontFamily: 'var(--font-geist-mono, Menlo, Consolas, monospace)',
          fontSize: '13px',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          border: '1px solid #dddddd'
        }}
      >
        {bibtex}
      </pre>
    </section>
  );
}
