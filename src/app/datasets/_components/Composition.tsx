'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON } from '../_lib/meg';
import { BOOKS, hours } from './Bookshelf';

export const CORPUS_COLOR = { sherlock: '#4a7bd0', timit: '#e8913a', mocha: '#d64b4b', moth: '#3a9d63', broad: '#a855f7' };
const BOOK_SHADES = ['#9cc0ef', '#7fa9e6', '#6496dc', '#4f86d2', '#3f76c4', '#3467b2', '#2b599f', '#244c8b', '#1e4078'];

/* ── Bubble pack: sub-0 as a big circle of corpora, 32 broad listeners beside it ── */

interface Bubble { id: string; label: string; h: number; color: string; x: number; y: number; r: number }

function relax(items: Bubble[], cx: number, cy: number, iters = 500) {
  for (let it = 0; it < iters; it++) {
    for (const b of items) { b.x += (cx - b.x) * 0.02; b.y += (cy - b.y) * 0.02; }
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const a = items[i], b = items[j];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, min = a.r + b.r + 1.2;
      if (d < min) { const push = (min - d) / 2, ux = dx / d, uy = dy / d; a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push; }
    }
  }
}

export function BubblePack({ height = 430 }: { height?: number }) {
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState<Bubble | null>(null);
  useEffect(() => setMounted(true), []);
  const layout = useMemo(() => {
    const k = 13.5; // px per sqrt(hour)
    const deep: Bubble[] = [
      ...BOOKS.map((b, i) => ({ id: `b${b.n}`, label: `Book ${b.n}`, h: hours(b.hms), color: BOOK_SHADES[i], x: 0, y: 0, r: 0 })),
      { id: 'timit', label: 'TIMIT', h: 5.3, color: CORPUS_COLOR.timit, x: 0, y: 0, r: 0 },
      { id: 'mocha', label: 'MOCHA', h: 1.1, color: CORPUS_COLOR.mocha, x: 0, y: 0, r: 0 },
      { id: 'moth', label: 'The Moth', h: 6.0, color: CORPUS_COLOR.moth, x: 0, y: 0, r: 0 },
    ];
    deep.forEach((b, i) => { b.r = k * Math.sqrt(b.h); const a = i * 2.4; b.x = 230 + Math.cos(a) * 40 * (1 + i * 0.1); b.y = 215 + Math.sin(a) * 40 * (1 + i * 0.1); });
    relax(deep, 230, 215);
    const outerR = Math.max(...deep.map(b => Math.hypot(b.x - 230, b.y - 215) + b.r)) + 8;
    const broad: Bubble[] = Array.from({ length: 32 }, (_, i) => {
      const a = i * 2.39996, rr = 9 * Math.sqrt(i + 0.5);
      return { id: `s${i + 1}`, label: `sub-${i + 1}`, h: 23.7 / 32, color: CORPUS_COLOR.broad, x: 560 + Math.cos(a) * rr, y: 215 + Math.sin(a) * rr, r: k * Math.sqrt(23.7 / 32) };
    });
    relax(broad, 560, 215, 300);
    return { deep, broad, outerR };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 700 ${height}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} role="img" aria-label="Bubble chart: sub-0's 80 hours split into corpora, beside 32 small circles for the broad subjects">
        {mounted && (
          <g>
            <circle cx={230} cy={215} r={layout.outerR} fill="rgba(74,123,208,0.06)" stroke="#4a7bd0" strokeWidth={2} strokeDasharray="1 0" style={{ animation: 'dsFloat 9s ease-in-out infinite' }} />
            <text x={230} y={215 - layout.outerR - 12} textAnchor="middle" fontFamily="var(--ds-serif)" fontSize={26} fill="#0b0a1a">sub-0 · 80.5 h</text>
            {layout.deep.map((b, i) => (
              <g key={b.id} onPointerEnter={() => setHover(b)} onPointerLeave={() => setHover(null)} style={{ cursor: 'default' }}>
                <circle cx={b.x} cy={b.y} r={b.r} fill={b.color} stroke="#fff" strokeWidth={1.5}
                  style={{ transformOrigin: `${b.x}px ${b.y}px`, animation: `dsPop 0.7s ${i * 60}ms both cubic-bezier(.3,1.4,.4,1)`, opacity: hover && hover.id !== b.id ? 0.6 : 1 }} />
                {b.r > 22 && <text x={b.x} y={b.y + 4} textAnchor="middle" fontSize={b.r > 34 ? 12.5 : 10.5} fontWeight={600} fill="#fff" style={{ pointerEvents: 'none' }}>{b.label}</text>}
              </g>
            ))}
            <text x={560} y={215 - 130} textAnchor="middle" fontFamily="var(--ds-serif)" fontSize={26} fill="#0b0a1a">sub-1 … sub-32</text>
            <text x={560} y={215 - 108} textAnchor="middle" fontFamily="var(--ds-mono)" fontSize={11} fill="#77738a">~44 min each · 23.7 h</text>
            {layout.broad.map((b, i) => (
              <circle key={b.id} cx={b.x} cy={b.y} r={b.r} fill={b.color} fillOpacity={0.85} stroke="#fff" strokeWidth={1.2}
                onPointerEnter={() => setHover(b)} onPointerLeave={() => setHover(null)}
                style={{ transformOrigin: `${b.x}px ${b.y}px`, animation: `dsPop 0.6s ${700 + i * 25}ms both cubic-bezier(.3,1.4,.4,1)`, opacity: hover && hover.id !== b.id ? 0.55 : 1 }} />
            ))}
          </g>
        )}
      </svg>
      {hover && (
        <div className="ds-tip" style={{ left: `${(hover.x / 700) * 100}%`, top: `${((hover.y - hover.r) / height) * 100}%` }}>
          <b>{hover.id.startsWith('b') ? BOOKS[+hover.id.slice(1) - 1].title : hover.id.startsWith('s') ? hover.label : hover.label}</b><br />
          <span className="m">{hover.h >= 1 ? `${hover.h.toFixed(1)} h` : `≈${Math.round(hover.h * 60)} min`} · {hover.id.startsWith('s') ? 'Sherlock Book 1, ch. 11–12' : 'sub-0'}</span>
        </div>
      )}
      <style>{`@keyframes dsPop { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  );
}

/* ── Squarified treemap of every session ─────────────────────────────── */

interface Node { id: string; label: string; value: number; color: string; children?: Node[]; meta?: string }
interface Rect { x: number; y: number; w: number; h: number; node: Node; depth: number }

function squarify(nodes: Node[], x: number, y: number, w: number, h: number): { node: Node; x: number; y: number; w: number; h: number }[] {
  const total = nodes.reduce((a, n) => a + n.value, 0);
  const items = nodes.map(n => ({ node: n, area: (n.value / total) * w * h })).sort((a, b) => b.area - a.area);
  const out: { node: Node; x: number; y: number; w: number; h: number }[] = [];
  let rx = x, ry = y, rw = w, rh = h;
  const worst = (row: typeof items, side: number) => {
    const s = row.reduce((a, r) => a + r.area, 0);
    const mx = Math.max(...row.map(r => r.area)), mn = Math.min(...row.map(r => r.area));
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };
  let row: typeof items = [];
  let i = 0;
  while (i < items.length) {
    const side = Math.min(rw, rh);
    const next = [...row, items[i]];
    if (row.length === 0 || worst(next, side) <= worst(row, side)) { row = next; i++; continue; }
    // lay out row
    const s = row.reduce((a, r) => a + r.area, 0);
    if (rw >= rh) { const cw = s / rh; let cy = ry; for (const r of row) { const ch = r.area / cw; out.push({ node: r.node, x: rx, y: cy, w: cw, h: ch }); cy += ch; } rx += cw; rw -= cw; }
    else { const ch = s / rw; let cx = rx; for (const r of row) { const cw = r.area / ch; out.push({ node: r.node, x: cx, y: ry, w: cw, h: ch }); cx += cw; } ry += ch; rh -= ch; }
    row = [];
  }
  if (row.length) {
    const s = row.reduce((a, r) => a + r.area, 0);
    if (rw >= rh) { const cw = s / rh; let cy = ry; for (const r of row) { const ch = r.area / cw; out.push({ node: r.node, x: rx, y: cy, w: cw, h: ch }); cy += ch; } }
    else { const ch = s / rw; let cx = rx; for (const r of row) { const cw = r.area / ch; out.push({ node: r.node, x: cx, y: ry, w: cw, h: ch }); cx += cw; } }
  }
  return out;
}

function layoutTree(nodes: Node[], x: number, y: number, w: number, h: number, depth = 0, pad = 0): Rect[] {
  const rects: Rect[] = [];
  for (const r of squarify(nodes, x, y, w, h)) {
    rects.push({ ...r, depth });
    if (r.node.children?.length) {
      const p = depth === 0 ? 3 : 1.5;
      rects.push(...layoutTree(r.node.children, r.x + p, r.y + p + (depth === 0 ? 0 : 0), Math.max(0, r.w - 2 * p), Math.max(0, r.h - 2 * p), depth + 1, pad));
    }
  }
  return rects;
}

// Paper totals (Table 2) used to scale per-session durations measured from the event files.
const PAPER_HOURS: Record<string, number> = { Sherlock: 68.1, TIMIT: 5.3, MOCHATIMIT: 1.1, TheMoth: 6.0, Broad: 23.7 };

export function SessionTreemap() {
  const [sessions, setSessions] = useState<[string, number, number, number, number][] | null>(null);
  const [hover, setHover] = useState<Rect | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); fetchJSON<{ sessions: [string, number, number, number, number][] }>('/datasets/stats.json').then(s => setSessions(s.sessions)); }, []);

  const rects = useMemo(() => {
    if (!sessions) return [];
    const groupOf = (c: string, sub: number) => sub > 0 ? 'Broad' : c.startsWith('Sherlock') ? 'Sherlock' : c;
    const sums: Record<string, number> = {};
    sessions.forEach(([c, sub, , m]) => { const g = groupOf(c, sub); sums[g] = (sums[g] ?? 0) + m; });
    const scale = (c: string, sub: number, m: number) => { const g = groupOf(c, sub); return (m / sums[g]) * PAPER_HOURS[g] * 60; };
    const sesNode = (c: string, sub: number, ses: number, m: number, nw: number, color: string, label: string): Node =>
      ({ id: `${c}-${sub}-${ses}`, label, value: scale(c, sub, m), color, meta: `${Math.round(scale(c, sub, m))} min · ${nw.toLocaleString('en-GB')} words` });
    const books: Node[] = BOOKS.map((b, i) => ({
      id: `Sherlock${b.n}`, label: `(${b.n}) ${b.title}`, value: 0, color: BOOK_SHADES[i],
      children: sessions.filter(s => s[0] === `Sherlock${b.n}` && s[1] === 0).map(s => sesNode(s[0], 0, s[2], s[3], s[4], BOOK_SHADES[i], `${b.title} · session ${s[2]}`)),
    }));
    books.forEach(b => (b.value = b.children!.reduce((a, c) => a + c.value, 0)));
    const corpus = (key: string, label: string, color: string): Node => {
      const ch = sessions.filter(s => s[0] === key && s[1] === 0).map(s => sesNode(s[0], 0, s[2], s[3], s[4], color, `${label} · session ${s[2]}`));
      return { id: key, label, color, value: ch.reduce((a, c) => a + c.value, 0), children: ch };
    };
    const broadSubs: Node[] = Array.from({ length: 32 }, (_, i) => {
      const ch = sessions.filter(s => s[1] === i + 1).map(s => sesNode(s[0], s[1], s[2], s[3], s[4], CORPUS_COLOR.broad, `sub-${i + 1} · ${s[2] === 11 ? 'ch. 11 (validation)' : 'ch. 12 (test)'}`));
      return { id: `sub-${i + 1}`, label: `sub-${i + 1}`, color: CORPUS_COLOR.broad, value: ch.reduce((a, c) => a + c.value, 0), children: ch };
    });
    const top: Node[] = [
      { id: 'audiobooks', label: 'Audiobooks · sub-0', color: CORPUS_COLOR.sherlock, value: books.reduce((a, b) => a + b.value, 0), children: books },
      { id: 'podcasts', label: 'Podcasts', color: CORPUS_COLOR.moth, value: 0, children: [corpus('TheMoth', 'The Moth', CORPUS_COLOR.moth)] },
      { id: 'sentences', label: 'Sentences', color: CORPUS_COLOR.timit, value: 0, children: [corpus('TIMIT', 'TIMIT', CORPUS_COLOR.timit), corpus('MOCHATIMIT', 'MOCHA-TIMIT', CORPUS_COLOR.mocha)] },
      { id: 'broad', label: 'Broad · sub-1 … sub-32', color: CORPUS_COLOR.broad, value: broadSubs.reduce((a, b) => a + b.value, 0), children: broadSubs },
    ];
    top.forEach(t => { if (!t.value) t.value = t.children!.reduce((a, c) => a + c.value, 0); });
    return layoutTree(top, 0, 0, 1000, 560);
  }, [sessions]);

  const leaves = rects.filter(r => !r.node.children);
  const labelled = rects.filter(r => r.node.children && r.depth === 1 && r.w > 70 && r.h > 34 && !r.node.id.startsWith('sub-'));
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1000 / 560', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
        {mounted && leaves.map(r => (
          <div key={r.node.id}
            onPointerEnter={() => setHover(r)} onPointerLeave={() => setHover(null)}
            style={{
              position: 'absolute', left: `${r.x / 10}%`, top: `${(r.y / 560) * 100}%`, width: `${r.w / 10}%`, height: `${(r.h / 560) * 100}%`,
              background: r.node.color, boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.75)',
              filter: hover && hover.node.id === r.node.id ? 'brightness(1.25)' : undefined, transition: 'filter 0.15s',
            }} />
        ))}
        {mounted && labelled.map(r => (
          <div key={`l-${r.node.id}`} style={{
            position: 'absolute', left: `${r.x / 10}%`, top: `${(r.y / 560) * 100}%`, width: `${r.w / 10}%`, height: `${(r.h / 560) * 100}%`,
            display: 'grid', placeItems: 'center', pointerEvents: 'none', textAlign: 'center', padding: 4,
            color: '#fff', fontWeight: 700, fontSize: 'clamp(9px, 1.2vw, 13px)', textShadow: '0 1px 3px rgba(0,0,0,0.45)', lineHeight: 1.2,
          }}>{r.node.label}</div>
        ))}
        {mounted && (() => {
          const b = rects.find(r => r.node.id === 'broad');
          return b ? <div style={{ position: 'absolute', left: `${b.x / 10}%`, top: `${(b.y / 560) * 100}%`, width: `${b.w / 10}%`, height: `${(b.h / 560) * 100}%`, display: 'grid', placeItems: 'center', pointerEvents: 'none', color: '#fff', fontWeight: 700, fontSize: 'clamp(10px, 1.4vw, 15px)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>32 broad subjects</div> : null;
        })()}
      </div>
      {hover && (
        <div className="ds-tip" style={{ left: `${(hover.x + hover.w / 2) / 10}%`, top: `${(hover.y / 560) * 100}%` }}>
          <b>{hover.node.label}</b><br /><span className="m">{hover.node.meta}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
        {[['Audiobooks (sub-0)', CORPUS_COLOR.sherlock], ['TIMIT', CORPUS_COLOR.timit], ['MOCHA-TIMIT', CORPUS_COLOR.mocha], ['The Moth', CORPUS_COLOR.moth], ['Broad subjects', CORPUS_COLOR.broad]].map(([l, c]) => (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ds-muted)' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: c }} />{l}</span>
        ))}
      </div>
    </div>
  );
}
