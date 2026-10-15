'use client';

import React, { useEffect, useState } from 'react';
import { fetchJSON } from '../_lib/meg';

export interface Book { n: number; title: string; year: string; type: 'Novel' | 'Short Stories'; sessions: number; hms: string; reader: string; librivox: string; spine: string }

// Table 2 of Özdogan et al. (2025) and Table 5 of Mantegna et al. (2026).
export const BOOKS: Book[] = [
  { n: 1, title: 'A Study in Scarlet', year: '1887', type: 'Novel', sessions: 14, hms: '04:37:34', reader: 'David Clarke', librivox: 'https://librivox.org/a-study-in-scarlet-version-6-by-sir-arthur-conan-doyle/', spine: '#8f1d2c' },
  { n: 2, title: 'The Sign of the Four', year: '1890', type: 'Novel', sessions: 12, hms: '04:27:31', reader: 'David Clarke', librivox: 'https://librivox.org/the-sign-of-the-four-version-3-by-sir-arthur-conan-doyle/', spine: '#1f3a5f' },
  { n: 3, title: 'The Adventures of Sherlock Holmes', year: '1892', type: 'Short Stories', sessions: 12, hms: '10:56:13', reader: 'David Clarke', librivox: 'https://librivox.org/the-adventures-of-sherlock-holmes-version-4-by-sir-arthur-conan-doyle/', spine: '#2f4a3a' },
  { n: 4, title: 'The Memoirs of Sherlock Holmes', year: '1893', type: 'Short Stories', sessions: 12, hms: '08:53:17', reader: 'David Clarke', librivox: 'https://librivox.org/the-memoirs-of-sherlock-holmes-by-sir-arthur-conan-doyle-2/', spine: '#5a3a22' },
  { n: 5, title: 'The Hound of the Baskervilles', year: '1901–02', type: 'Novel', sessions: 15, hms: '06:10:32', reader: 'David Clarke', librivox: 'https://librivox.org/the-hound-of-the-baskervilles-version-4-by-sir-arthur-conan-doyle/', spine: '#3b2a4f' },
  { n: 6, title: 'The Return of Sherlock Holmes', year: '1905', type: 'Short Stories', sessions: 14, hms: '11:51:17', reader: 'David Clarke', librivox: 'https://librivox.org/the-return-of-sherlock-holmes-by-sir-arthur-conan-doyle-2/', spine: '#6b2737' },
  { n: 7, title: 'The Valley of Fear', year: '1914–15', type: 'Novel', sessions: 14, hms: '06:06:17', reader: 'David Clarke', librivox: 'https://librivox.org/the-valley-of-fear-version-3-by-sir-arthur-conan-doyle/', spine: '#24443f' },
  { n: 8, title: 'His Last Bow', year: '1917', type: 'Short Stories', sessions: 10, hms: '07:10:29', reader: 'David Clarke', librivox: 'https://librivox.org/his-last-bow-version-3-by-sir-arthur-conan-doyle/', spine: '#2b3f73' },
  { n: 9, title: 'The Case-Book of Sherlock Holmes', year: '1927', type: 'Short Stories', sessions: 13, hms: '08:27:01', reader: 'Thomas A. Copeland', librivox: 'https://librivox.org/the-case-book-of-sherlock-holmes-by-sir-arthur-conan-doyle/', spine: '#4b2e5c' },
];

export const hours = (hms: string) => { const [h, m, s] = hms.split(':').map(Number); return h + m / 60 + s / 3600; };

interface BookStats { words: number; vocab: number; distinctive: string[] }

/** Nine spines, width ∝ listening time. Click one to open its case file. */
export default function Bookshelf({ upTo = 9, highlightNew = false }: { upTo?: number; highlightNew?: boolean }) {
  const [sel, setSel] = useState(0);
  const [stats, setStats] = useState<Record<string, BookStats> | null>(null);
  useEffect(() => { fetchJSON<{ books: Record<string, BookStats> }>('/datasets/stats.json').then(s => setStats(s.books)); }, []);
  const b = BOOKS[sel];
  const st = stats?.[`Sherlock${b.n}`];
  const inSet = b.n <= upTo;
  const totalH = BOOKS.slice(0, upTo).reduce((a, x) => a + hours(x.hms), 0);
  return (
    <div>
      <div style={{ position: 'relative', padding: '0 0.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, minWidth: 560, height: 250, paddingTop: 20 }}>
          {BOOKS.map((bk, i) => {
            const h = hours(bk.hms);
            const ghost = bk.n > upTo;
            const isNew = highlightNew && bk.n > 7;
            const active = i === sel;
            return (
              <button
                key={bk.n}
                onClick={() => setSel(i)}
                aria-pressed={active}
                aria-label={`${bk.title}, ${bk.year}`}
                style={{
                  flex: `${h} 1 0`,
                  height: `${150 + (bk.sessions - 10) * 12 + (bk.type === 'Novel' ? 0 : 20)}px`,
                  border: ghost ? '1.5px dashed #c9c5d8' : 'none',
                  background: ghost ? 'transparent' : `linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.08) 20%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.2)), ${bk.spine}`,
                  borderRadius: '4px 4px 2px 2px',
                  cursor: 'pointer',
                  position: 'relative',
                  transform: active ? 'translateY(-14px)' : 'none',
                  transition: 'transform 0.35s cubic-bezier(.3,.7,.2,1), box-shadow 0.3s',
                  boxShadow: active ? '0 18px 30px -12px rgba(11,10,26,0.5)' : '0 2px 0 rgba(0,0,0,0.15)',
                  color: ghost ? '#a9a5b8' : '#f5e9c8',
                  padding: 0,
                  overflow: 'hidden',
                }}
              >
                {!ghost && <>
                  <span style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 2, background: 'rgba(214,180,106,0.7)' }} />
                  <span style={{ position: 'absolute', left: 0, right: 0, top: 15, height: 1, background: 'rgba(214,180,106,0.5)' }} />
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: 14, height: 2, background: 'rgba(214,180,106,0.7)' }} />
                </>}
                <span style={{
                  position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', whiteSpace: 'nowrap',
                  fontFamily: 'var(--ds-serif)', fontSize: 'clamp(12px, 1.4vw, 16px)', letterSpacing: '0.02em',
                }}>
                  {bk.title.replace('Sherlock Holmes', 'S. Holmes')}
                </span>
                <span style={{ position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--ds-mono)', fontSize: 10, opacity: 0.85 }}>{bk.n}</span>
                {isNew && <span style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--ds-mono)', fontSize: 9, background: '#c4b5fd', color: '#2e1065', padding: '1px 4px', borderRadius: 3 }}>NEW</span>}
              </button>
            );
          })}
        </div>
        <div style={{ height: 12, background: 'linear-gradient(#6b4a2b, #4a321c)', borderRadius: 2, boxShadow: '0 8px 16px -8px rgba(0,0,0,0.4)', minWidth: 560 }} />
        <div className="ds-note" style={{ display: 'flex', justifyContent: 'space-between', minWidth: 560 }}>
          <span>Spine width ∝ listening time · height ∝ sessions</span>
          <span>{upTo === 9 ? 'the complete canon' : `books 1–${upTo}`}: {totalH.toFixed(1)} h of audio{upTo < 9 ? ' · dashed = added in LibriBrain100' : ''}</span>
        </div>
      </div>

      {/* case file */}
      <div className="ds-card" style={{ marginTop: '1.4rem', background: '#fffdf7', borderColor: '#efe6cf', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)', gap: '1.5rem' }}>
        <div>
          <div className="ds-label" style={{ color: '#a3895a' }}>Case file № {b.n}{!inSet ? ' · LibriBrain100 only' : ''}</div>
          <h3 style={{ fontFamily: 'var(--ds-serif)', fontWeight: 400, fontSize: 32, lineHeight: 1.05, margin: '0.4rem 0 0.6rem', color: '#2a1f12' }}>{b.title}</h3>
          <div style={{ fontSize: 14, color: '#6b5a40', lineHeight: 1.7 }}>
            {b.type} · {b.year}<br />
            Read by {b.reader} for <a href={b.librivox} target="_blank" rel="noopener noreferrer" style={{ color: '#8f1d2c' }}>LibriVox</a>
          </div>
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '0.6rem', marginBottom: '0.9rem' }}>
            {[
              ['Listening', `${hours(b.hms).toFixed(1)} h`],
              ['Sessions', String(b.sessions)],
              ['Words', st ? `${Math.round(st.words / 1000)}k` : '…'],
              ['Vocabulary', st ? st.vocab.toLocaleString('en-GB') : '…'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: 'var(--ds-serif)', fontSize: 26, color: '#2a1f12', lineHeight: 1 }}>{v}</div>
                <div className="ds-label" style={{ color: '#a3895a', marginTop: 4 }}>{k}</div>
              </div>
            ))}
          </div>
          <div className="ds-label" style={{ color: '#a3895a', marginBottom: 6 }}>Persons &amp; things of interest <span style={{ textTransform: 'none', letterSpacing: 0 }}>(most distinctive words vs. the other books)</span></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {(st?.distinctive ?? []).map(w => (
              <span key={w} style={{ fontFamily: 'var(--ds-mono)', fontSize: 12, padding: '0.15rem 0.5rem', borderRadius: 4, background: '#f6edd7', color: '#5a4426', border: '1px solid #eadcb9' }}>{w}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 700px) { .ds-card[style*="fffdf7"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
