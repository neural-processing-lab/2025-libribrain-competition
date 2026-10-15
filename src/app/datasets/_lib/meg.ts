'use client';

import { assetPath } from '../../../lib/assetPath';

/* ── Data shapes (written by the asset build scripts, see public/datasets/README.md) ── */

export interface Layout { xy: [number, number][]; xyz: [number, number, number][] }

export interface ClipMeta {
  fs: number;
  n: number;
  nsens: number;
  start: number;
  words: [string, number, number][];
  phonemes: [string, number, number][];
  silences: [number, number][];
  layout: Layout;
  session: string;
}

export interface Clip extends ClipMeta {
  /** Magnetometers, z-scored, nsens × n (row-major), range ≈ ±4. */
  mag: Float32Array;
  /** Combined planar gradient magnitude, nsens × n, range 0..5. */
  grad: Float32Array;
}

export interface Evoked {
  t0: number; fs: number; n_epochs: number;
  grad: number[][]; mag: number[][]; gfp: number[]; gfp_h1: number[]; gfp_h2: number[];
  lag0: number; xcorr: number[][]; xcorr_mean: number[]; xcorr_mag: number[][];
}

const cache = new Map<string, Promise<unknown>>();
function once<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, fn());
  return cache.get(key) as Promise<T>;
}

export function fetchJSON<T>(path: string): Promise<T> {
  return once(path, () => fetch(assetPath(path)).then(r => {
    if (!r.ok) throw new Error(`${path}: ${r.status}`);
    return r.json() as Promise<T>;
  }));
}

export function loadClip(dir: string): Promise<Clip> {
  return once(`clip:${dir}`, async () => {
    const [meta, buf] = await Promise.all([
      fetchJSON<ClipMeta>(`${dir}/clip.json`),
      fetch(assetPath(`${dir}/clip-meg.bin`)).then(r => r.arrayBuffer()),
    ]);
    const N = meta.nsens * meta.n;
    const i8 = new Int8Array(buf, 0, N);
    const u8 = new Uint8Array(buf, N, N);
    const mag = new Float32Array(N);
    const grad = new Float32Array(N);
    for (let i = 0; i < N; i++) { mag[i] = i8[i] / 31.75; grad[i] = u8[i] / 51; }
    return { ...meta, mag, grad };
  });
}

/** Linear interpolation of one sensor row at fractional sample index. */
export function sampleAt(arr: Float32Array, n: number, sensor: number, idx: number): number {
  const i = Math.max(0, Math.min(n - 1, idx));
  const a = Math.floor(i), b = Math.min(n - 1, a + 1), f = i - a;
  return arr[sensor * n + a] * (1 - f) + arr[sensor * n + b] * f;
}

/* ── Topomap interpolation ──────────────────────────────────────────── */

export interface TopoGrid { res: number; idx: Int32Array; w: Float32Array; k: number; inside: Uint8Array; radius: number }

/** Precomputes inverse-distance weights from each pixel to its k nearest sensors. */
export function makeTopoGrid(xy: [number, number][], res = 84, k = 7): TopoGrid {
  const radius = 1.06;
  const idx = new Int32Array(res * res * k);
  const w = new Float32Array(res * res * k);
  const inside = new Uint8Array(res * res);
  const d = new Float32Array(xy.length);
  const order = xy.map((_, i) => i);
  for (let py = 0; py < res; py++) {
    for (let px = 0; px < res; px++) {
      const x = ((px + 0.5) / res) * 2 - 1;
      const y = 1 - ((py + 0.5) / res) * 2; // front (+y) is up
      const p = py * res + px;
      const r = Math.hypot(x, y);
      if (r > radius) continue;
      inside[p] = 1;
      for (let s = 0; s < xy.length; s++) d[s] = Math.hypot(xy[s][0] * 0.98 - x, xy[s][1] * 0.98 - y);
      order.sort((a, b) => d[a] - d[b]);
      let sum = 0;
      for (let j = 0; j < k; j++) {
        const s = order[j];
        const wt = 1 / Math.pow(d[s] + 0.02, 2.2);
        idx[p * k + j] = s; w[p * k + j] = wt; sum += wt;
      }
      for (let j = 0; j < k; j++) w[p * k + j] /= sum;
    }
  }
  return { res, idx, w, k, inside, radius };
}

export type LUT = Uint8ClampedArray; // 256 × rgba

export function makeLUT(stops: [number, string][]): LUT {
  const lut = new Uint8ClampedArray(256 * 4);
  const rgb = stops.map(([p, c]) => [p, parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let j = 0;
    while (j < rgb.length - 2 && t > rgb[j + 1][0]) j++;
    const [p0, r0, g0, b0] = rgb[j], [p1, r1, g1, b1] = rgb[j + 1];
    const f = Math.max(0, Math.min(1, (t - p0) / (p1 - p0 || 1)));
    lut[i * 4] = r0 + (r1 - r0) * f;
    lut[i * 4 + 1] = g0 + (g1 - g0) * f;
    lut[i * 4 + 2] = b0 + (b1 - b0) * f;
    lut[i * 4 + 3] = 255;
  }
  return lut;
}

/** Field maps (signed): blue ↔ ink ↔ scarlet. */
export const LUT_DIVERGING_DARK = makeLUT([[0, '#60a5fa'], [0.3, '#1e3a8a'], [0.5, '#12102a'], [0.7, '#9f1239'], [1, '#fb7185']]);
export const LUT_DIVERGING_LIGHT = makeLUT([[0, '#2563eb'], [0.25, '#93c5fd'], [0.5, '#ffffff'], [0.75, '#fda4af'], [1, '#e0314b']]);
/** Power maps (unsigned): ink → violet → pink → white. */
export const LUT_POWER_DARK = makeLUT([[0, '#12102a'], [0.35, '#3b0f80'], [0.62, '#9333ea'], [0.82, '#f472b6'], [1, '#fff1f2']]);
export const LUT_POWER_LIGHT = makeLUT([[0, '#ffffff'], [0.25, '#ede9fe'], [0.55, '#a78bfa'], [0.8, '#7c3aed'], [1, '#2e1065']]);

/** Renders sensor values into an ImageData via the precomputed grid. `lo/hi` map to the LUT ends. */
export function paintTopo(img: ImageData, grid: TopoGrid, values: ArrayLike<number>, lo: number, hi: number, lut: LUT) {
  const { res, idx, w, k, inside } = grid;
  const data = img.data;
  const span = hi - lo || 1;
  for (let p = 0; p < res * res; p++) {
    const o = p * 4;
    if (!inside[p]) { data[o + 3] = 0; continue; }
    let v = 0;
    for (let j = 0; j < k; j++) v += values[idx[p * k + j]] * w[p * k + j];
    const c = Math.max(0, Math.min(255, Math.round(((v - lo) / span) * 255))) * 4;
    data[o] = lut[c]; data[o + 1] = lut[c + 1]; data[o + 2] = lut[c + 2]; data[o + 3] = 255;
  }
}

/** Index of the sensor nearest to a target position on the 2D layout. */
export function nearestSensor(xy: [number, number][], x: number, y: number): number {
  let best = 0, bd = Infinity;
  xy.forEach(([sx, sy], i) => { const d = (sx - x) ** 2 + (sy - y) ** 2; if (d < bd) { bd = d; best = i; } });
  return best;
}

/* ── Phonemes ─────────────────────────────────────────────────────── */

export type PhonClass = 'vowel' | 'plosive' | 'nasal' | 'fricative' | 'affricate' | 'approximant' | 'other';

const CLASS_OF: Record<string, PhonClass> = {};
'aa ae ah ao aw ay eh er ey ih iy ow oy uh uw'.split(' ').forEach(p => (CLASS_OF[p] = 'vowel'));
'p b t d k g'.split(' ').forEach(p => (CLASS_OF[p] = 'plosive'));
'm n ng'.split(' ').forEach(p => (CLASS_OF[p] = 'nasal'));
'f v th dh s z sh zh hh'.split(' ').forEach(p => (CLASS_OF[p] = 'fricative'));
'ch jh'.split(' ').forEach(p => (CLASS_OF[p] = 'affricate'));
'w r y l'.split(' ').forEach(p => (CLASS_OF[p] = 'approximant'));

export const PHON_COLORS: Record<PhonClass, string> = {
  vowel: '#a78bfa',
  plosive: '#fb7185',
  nasal: '#4ade80',
  fricative: '#fb923c',
  affricate: '#38bdf8',
  approximant: '#facc15',
  other: '#9ca3af',
};
export const PHON_COLORS_LIGHT: Record<PhonClass, string> = {
  vowel: '#7c3aed',
  plosive: '#e0314b',
  nasal: '#16a34a',
  fricative: '#ea7317',
  affricate: '#0284c7',
  approximant: '#ca8a04',
  other: '#9ca3af',
};

export function phonClass(p: string): PhonClass {
  return CLASS_OF[p.toLowerCase()] ?? 'other';
}

/** ARPAbet → example + IPA, used in tooltips. */
export const ARPABET: Record<string, [string, string]> = {
  aa: ['ɑ', 'odd'], ae: ['æ', 'at'], ah: ['ʌ', 'hut'], ao: ['ɔ', 'ought'], aw: ['aʊ', 'cow'], ay: ['aɪ', 'hide'],
  eh: ['ɛ', 'Ed'], er: ['ɝ', 'hurt'], ey: ['eɪ', 'ate'], ih: ['ɪ', 'it'], iy: ['i', 'eat'], ow: ['oʊ', 'oat'],
  oy: ['ɔɪ', 'toy'], uh: ['ʊ', 'hood'], uw: ['u', 'two'],
  p: ['p', 'pee'], b: ['b', 'be'], t: ['t', 'tea'], d: ['d', 'dee'], k: ['k', 'key'], g: ['g', 'green'],
  m: ['m', 'me'], n: ['n', 'knee'], ng: ['ŋ', 'ping'],
  f: ['f', 'fee'], v: ['v', 'vee'], th: ['θ', 'theta'], dh: ['ð', 'thee'], s: ['s', 'sea'], z: ['z', 'zee'],
  sh: ['ʃ', 'she'], zh: ['ʒ', 'seizure'], hh: ['h', 'he'], ch: ['tʃ', 'cheese'], jh: ['dʒ', 'gee'],
  w: ['w', 'we'], r: ['ɹ', 'read'], y: ['j', 'yield'], l: ['l', 'lee'],
};

export function fmt(n: number, digits = 0): string {
  return n.toLocaleString('en-GB', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}
