'use client';

import React, { useState, useEffect } from 'react';
import type { Citation } from '@/lib/blog';

interface CitationsProps {
  citations: Citation[];
}

export default function Citations({ citations }: CitationsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyBibTeX = async (citation: Citation) => {
    try {
      await navigator.clipboard.writeText(citation.bibtex);
      setCopiedId(citation.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy BibTeX:', err);
    }
  };

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <section style={{
      marginTop: '4rem',
      paddingTop: '2rem',
      borderTop: '2px solid #f0f0f0'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 600,
        marginBottom: '2rem',
        color: '#333'
      }}>
        References
      </h2>
      
      <div style={{
        display: 'grid',
        gap: '1.5rem'
      }}>
        {citations.map((citation, index) => (
          <div
            key={citation.id}
            style={{
              padding: '1.5rem',
              background: '#f9f9f9',
              borderRadius: '8px',
              borderLeft: '4px solid #0a0a0a'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#0a0a0a',
                minWidth: '2rem'
              }}>
                [{index + 1}]
              </span>
              
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#333',
                  lineHeight: 1.4
                }}>
                  {citation.title}
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  {citation.authors.join(', ')}
                </p>
                
                <div style={{
                  fontSize: '14px',
                  color: '#888',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {citation.journal && (
                    <span><em>{citation.journal}</em></span>
                  )}
                  {citation.volume && (
                    <span>Vol. {citation.volume}</span>
                  )}
                  {citation.pages && (
                    <span>pp. {citation.pages}</span>
                  )}
                  <span>({citation.year})</span>
                </div>
                
                {(citation.doi || citation.url) && (
                  <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    {citation.doi && (
                      <a
                        href={`https://doi.org/${citation.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: '#0a0a0a',
                          textDecoration: 'underline'
                        }}
                      >
                        DOI: {citation.doi}
                      </a>
                    )}
                    {citation.url && !citation.doi && (
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: '#0a0a0a',
                          textDecoration: 'underline'
                        }}
                      >
                        View Article →
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              {mounted && (
                <button
                  onClick={() => copyBibTeX(citation)}
                  style={{
                    background: copiedId === citation.id ? '#4CAF50' : '#0a0a0a',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '80px'
                  }}
                >
                  {copiedId === citation.id ? 'Copied!' : 'BibTeX'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
