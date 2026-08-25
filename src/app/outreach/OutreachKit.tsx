'use client';

import { CSSProperties, useState } from 'react';
import { assetPath } from '../../lib/assetPath';
import { LINKEDIN_LIMIT, OUTREACH, TWEET_LIMIT, plainLength, tweetLength } from '../../lib/outreach';

const PURPLE = '#7c3aed';

const card: CSSProperties = {
  border: '1px solid #eee',
  borderRadius: '10px',
  padding: 'clamp(1.25rem, 3vw, 2rem)',
  background: '#fff',
};

const h2: CSSProperties = { fontSize: '22px', fontWeight: 700, margin: '0 0 0.4rem 0', color: '#0a0a0a' };
const h3: CSSProperties = { fontSize: '14px', fontWeight: 700, margin: '0 0 0.6rem 0', color: '#444', letterSpacing: '0.02em' };
const lead: CSSProperties = { fontSize: '14px', color: '#777', margin: '0 0 1.2rem 0', lineHeight: 1.6 };
const row: CSSProperties = { display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' };

const primaryBtn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '14px',
  fontWeight: 600,
  color: '#fff',
  background: PURPLE,
  textDecoration: 'none',
  border: 'none',
  borderRadius: '6px',
  padding: '0.7rem 1.3rem',
  cursor: 'pointer',
};

const secondaryBtn: CSSProperties = {
  ...primaryBtn,
  color: '#333',
  background: '#fff',
  border: '1px solid #ddd',
};

const textBlock: CSSProperties = {
  whiteSpace: 'pre-wrap',
  fontSize: '15px',
  lineHeight: 1.7,
  color: '#222',
  background: '#faf8ff',
  border: '1px solid rgba(124,58,237,0.15)',
  borderRadius: '8px',
  padding: '1.2rem 1.4rem',
  margin: '0 0 1rem 0',
  fontFamily: 'inherit',
};

function CopyButton({ text, label = 'Copy text' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2000);
  }
  return (
    <button type="button" onClick={copy} style={primaryBtn} aria-live="polite">
      {state === 'copied' ? '✓ Copied' : state === 'failed' ? 'Select & copy manually' : label}
    </button>
  );
}

function Count({ n, limit, platform }: { n: number; limit: number; platform: string }) {
  const over = n > limit;
  return (
    <span style={{ fontSize: '12px', color: over ? '#b42318' : '#999' }}>
      ≈ {n} / {limit} characters{over ? ` (too long for ${platform})` : ''}
    </span>
  );
}

export default function OutreachKit() {
  const encodedTweet = encodeURIComponent(OUTREACH.tweet);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Poster */}
      <section style={card} aria-labelledby="poster">
        <h2 id="poster" style={h2}>Poster</h2>
        <p style={lead}>16:9, so it works as a slide, on a screen in the lab, or as the image on a post. PDF for print and slides, PNG for social media.</p>
        <a href={assetPath(OUTREACH.poster.png)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '1.2rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(OUTREACH.poster.preview)}
            alt={OUTREACH.poster.alt}
            style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #eee', display: 'block' }}
          />
        </a>
        <div style={row}>
          <a href={assetPath(OUTREACH.poster.pdf)} download style={primaryBtn}>Download PDF</a>
          <a href={assetPath(OUTREACH.poster.png)} download style={secondaryBtn}>Download PNG</a>
          <span style={{ fontSize: '12px', color: '#999' }}>
            {OUTREACH.poster.pdfLabel} · {OUTREACH.poster.pngLabel}
          </span>
        </div>
      </section>

      {/* Shareable text */}
      <section style={card} aria-labelledby="share-text">
        <h2 id="share-text" style={h2}>Shareable text</h2>
        <p style={lead}>For Slack, Discord, mailing lists and newsletters. Plain text: paste as is, or trim to taste.</p>
        <pre style={textBlock}>{OUTREACH.shareText}</pre>
        <CopyButton text={OUTREACH.shareText} />
      </section>

      {/* Social posts */}
      <section style={card} aria-labelledby="posts">
        <h2 id="posts" style={h2}>Social posts</h2>
        <p style={lead}>Attach the PNG poster for the best reach.</p>

        <h3 style={h3}>Tweet (Twitter / Bluesky)</h3>
        <pre style={textBlock}>{OUTREACH.tweet}</pre>
        <div style={{ ...row, marginBottom: '1.8rem' }}>
          <CopyButton text={OUTREACH.tweet} label="Copy tweet" />
          <a href={`https://twitter.com/intent/tweet?text=${encodedTweet}`} target="_blank" rel="noopener noreferrer" style={secondaryBtn}>
            Post on Twitter
          </a>
          <a href={`https://bsky.app/intent/compose?text=${encodedTweet}`} target="_blank" rel="noopener noreferrer" style={secondaryBtn}>
            Post on Bluesky
          </a>
          <Count n={tweetLength(OUTREACH.tweet)} limit={TWEET_LIMIT} platform="Twitter" />
        </div>

        <h3 style={h3}>LinkedIn post</h3>
        <pre style={textBlock}>{OUTREACH.linkedin}</pre>
        <div style={row}>
          <CopyButton text={OUTREACH.linkedin} label="Copy post" />
          <Count n={plainLength(OUTREACH.linkedin)} limit={LINKEDIN_LIMIT} platform="LinkedIn" />
        </div>
      </section>

      {/* Links */}
      <section style={card} aria-labelledby="links">
        <h2 id="links" style={h2}>Key links</h2>
        <p style={lead}>Everything a post or email might need to point to.</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
          {OUTREACH.links.map((l) => (
            <li key={l.url} style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'baseline', fontSize: '15px' }}>
              <span style={{ color: '#444', minWidth: '260px' }}>{l.label}</span>
              <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: PURPLE, textDecoration: 'none', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '13px', wordBreak: 'break-all' }}>
                {l.url}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
