'use client';

import React, { useEffect, useRef, useState } from 'react';
import { assetPath } from '../../../lib/assetPath';

export function useInView<T extends Element>(opts: { once?: boolean; margin?: string } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { once = true, margin = '0px 0px -12% 0px' } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect(); }
      else if (!once) setInView(false);
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [once, margin]);
  return [ref, inView] as const;
}

export function Stat({ value, digits = 0, suffix = '', unit, label }: { value: number; digits?: number; suffix?: string; unit?: string; label: React.ReactNode }) {
  return (
    <div className="ds-stat">
      <div className="ds-stat-v">{value.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })}{suffix}{unit && <small>{unit}</small>}</div>
      <div className="ds-stat-l">{label}</div>
    </div>
  );
}

export function SectionHead({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="ds-sec-head">
      <h2 className="ds-h2">{title}</h2>
      {children}
    </div>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="ds-copy"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1400); });
      }}
    >
      {done ? 'Copied ✓' : label}
    </button>
  );
}

const PY_KW = new Set(['from', 'import', 'for', 'in', 'as', 'def', 'return', 'if', 'else', 'with', 'True', 'False', 'None', 'print']);

/** Tiny Python/BibTeX/shell highlighter; good enough for the snippets on these pages. */
function highlight(code: string, lang: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const lines = code.split('\n');
  lines.forEach((line, li) => {
    const re = lang === 'bibtex'
      ? /(@\w+)|(\{[^{}]*\})|(\w+(?=\s*=))/g
      : /(#.*$)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)(?=\()|(\b[A-Za-z_]+\b)/g;
    let last = 0; let m: RegExpExecArray | null;
    const parts: React.ReactNode[] = [];
    while ((m = re.exec(line))) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      const tok = m[0];
      let cls = '';
      if (lang === 'bibtex') cls = m[1] ? 'k' : m[2] ? 's' : 'f';
      else if (m[1]) cls = 'c';
      else if (m[2]) cls = 's';
      else if (m[3]) cls = 'n';
      else if (m[4]) cls = 'f';
      else if (m[5] && PY_KW.has(tok)) cls = 'k';
      parts.push(cls ? <span key={m.index} className={cls}>{tok}</span> : tok);
      last = m.index + tok.length;
    }
    if (last < line.length) parts.push(line.slice(last));
    out.push(<React.Fragment key={li}>{parts}{li < lines.length - 1 ? '\n' : ''}</React.Fragment>);
  });
  return out;
}

export function CodeBlock({ code, lang = 'python', style }: { code: string; lang?: 'python' | 'bibtex' | 'shell'; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <pre className="ds-code"><code>{highlight(code, lang)}</code></pre>
      <CopyButton text={code} />
    </div>
  );
}

export function Figure({ src, alt, caption, style }: { src: string; alt: string; caption?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <figure className="ds-figure" style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetPath(src)} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function Seg<T extends string>({ value, options, onChange, ariaLabel }: { value: T; options: { v: T; label: React.ReactNode }[]; onChange: (v: T) => void; ariaLabel?: string }) {
  return (
    <div className="ds-seg" role="group" aria-label={ariaLabel}>
      {options.map(o => (
        <button key={o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)}>{o.label}</button>
      ))}
    </div>
  );
}

/** Sticky in-page navigation that highlights the section in view. */
export function PageToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [top, setTop] = useState(56);
  // stick flush under the site's fixed nav, whose height animates when it shrinks on scroll
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const update = () => setTop(Math.floor(nav.getBoundingClientRect().bottom));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    nav.addEventListener('transitionend', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => { ro.disconnect(); nav.removeEventListener('transitionend', update); window.removeEventListener('scroll', update); };
  }, []);
  useEffect(() => {
    const els = items.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="ds-toc" aria-label="On this page" style={{ top }}>
      <div className="ds-wrap ds-toc-inner">
        {items.map(it => (
          <a key={it.id} href={`#${it.id}`} className={active === it.id ? 'is-active' : ''}>
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export const Icon = {
  hf: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-3.2 6.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm6.4 0a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 17.6c-2.3 0-4.2-1.4-4.8-3.4h9.6c-.6 2-2.5 3.4-4.8 3.4Z" /></svg>,
  paper: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>,
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 6h3a3 3 0 0 1-3 4M7 6H4a3 3 0 0 0 3 4" /></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" /></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>,
};
