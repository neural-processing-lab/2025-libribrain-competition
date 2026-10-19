'use client';

import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  EVAL_API,
  EvalApiError,
  EvalInfo,
  EvalLeaderboardTeam,
  EvalResult,
  EvalTrack,
  compressForUpload,
  fetchEvalInfo,
  fetchEvalLeaderboard,
  fetchEvalResult,
  submitForEvaluation,
} from '../../../../lib/evaluation';
import { metricLabel } from '../leaderboard/MultiMetricTable';

const INK = { primary: '#0a0a0a', secondary: '#555', muted: '#888' };
const BORDER = 'rgba(124,58,237,0.12)';
const SURFACE = '#faf8ff';
const TRACK_COLOR: Record<EvalTrack, string> = { deep: '#7c3aed', broad: '#0d9488' };
const TRACK_LABEL: Record<EvalTrack, string> = { deep: 'Deep', broad: 'Broad' };
const METRICS = ['balacc@10', 'balacc@1', 'ovmi'];
const REMEMBER_KEY = 'libribrain-eval-submitter';

export interface ReferenceTeam {
  team: string;
  best: Record<string, number>;
}

const inputStyle: CSSProperties = {
  width: '100%',
  fontSize: '15px',
  padding: '0.65rem 0.85rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  background: '#fff',
  color: INK.primary,
  outline: 'none',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#444',
  marginBottom: '0.4rem',
};

const fmt = (v: number | null | undefined, digits = 4) => (v == null ? '—' : v.toFixed(digits));
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtMB = (bytes: number) => `${(bytes / 1048576).toFixed(bytes < 10 * 1048576 ? 1 : 0)} MB`;

function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: '12px', background: '#fff', padding: '22px 24px', ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ title, note }: { title: string; note?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '17px', fontWeight: 600, color: INK.primary, margin: 0 }}>{title}</h3>
      {note && <p style={{ fontSize: '13px', color: INK.muted, margin: '4px 0 0', lineHeight: 1.55 }}>{note}</p>}
    </div>
  );
}

function Pill({ active, color, onClick, children }: { active: boolean; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '7px 16px',
        borderRadius: '999px',
        border: `1px solid ${active ? color : BORDER}`,
        background: active ? color : '#fff',
        color: active ? '#fff' : INK.secondary,
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .15s ease',
      }}
    >
      {children}
    </button>
  );
}

/** Where a score would have placed among the competition teams (1-based). */
function placeAmong(reference: ReferenceTeam[], metric: string, value: number | null) {
  const scored = reference.filter((t) => t.best[metric] != null);
  if (value == null || !scored.length) return null;
  return { rank: scored.filter((t) => t.best[metric] > value).length + 1, of: scored.length };
}

type Phase = 'idle' | 'compressing' | 'uploading' | 'scoring';

export default function SubmitView({ reference }: { reference: Record<EvalTrack, ReferenceTeam[]> }) {
  const [info, setInfo] = useState<EvalInfo | null>(null);
  const [serviceDown, setServiceDown] = useState(false);

  const [track, setTrack] = useState<EvalTrack>('deep');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [listed, setListed] = useState(true);
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<EvalApiError | null>(null);
  const [result, setResult] = useState<EvalResult | null>(null);

  const [boardTrack, setBoardTrack] = useState<EvalTrack>('deep');
  const [board, setBoard] = useState<Record<EvalTrack, EvalLeaderboardTeam[] | null>>({ deep: null, broad: null });

  const loadBoard = useCallback((t: EvalTrack) => {
    fetchEvalLeaderboard(t)
      .then((b) => setBoard((prev) => ({ ...prev, [t]: b.teams })))
      .catch(() => setBoard((prev) => ({ ...prev, [t]: [] })));
  }, []);

  useEffect(() => {
    fetchEvalInfo().then(setInfo).catch(() => setServiceDown(true));
    loadBoard('deep');
    loadBoard('broad');
    // Remembered submitter details and a shared result link (?id=…) are
    // per-browser conveniences; the page works without either.
    try {
      const saved = JSON.parse(localStorage.getItem(REMEMBER_KEY) || 'null');
      if (saved) { setTeam(saved.team || ''); setEmail(saved.email || ''); }
    } catch { /* storage unavailable */ }
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
      fetchEvalResult(id).then((r) => { setResult(r); setTrack(r.track); }).catch(() => {});
    }
  }, [loadBoard]);

  const busy = phase !== 'idle';
  const accent = TRACK_COLOR[track];
  const trackEnabled = info ? info.tracks[track]?.enabled : true;
  const maxBytes = (info?.maxUploadMB ?? 150) * 1048576;

  async function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ team, email }));
    } catch { /* storage unavailable */ }
    try {
      setPhase('compressing');
      const body = await compressForUpload(file);
      if (body.size > maxBytes) {
        throw new EvalApiError(`The file is ${fmtMB(body.size)} after compression; the limit is ${fmtMB(maxBytes)}.`, 413);
      }
      setPhase('uploading');
      setProgress(0);
      const r = await submitForEvaluation(
        body,
        { track, team, email, listed, description, url },
        (f) => { setProgress(f); if (f >= 1) setPhase('scoring'); },
      );
      setResult(r);
      if (r.listed) { loadBoard(r.track); setBoardTrack(r.track); }
      // Shareable link to this result.
      window.history.replaceState(null, '', `?id=${r.id}`);
    } catch (err) {
      setError(err instanceof EvalApiError ? err : new EvalApiError('Something went wrong. Please try again.', 0));
    } finally {
      setPhase('idle');
    }
  }

  const phaseLabel: Record<Phase, string> = {
    idle: 'Evaluate submission',
    compressing: 'Compressing…',
    uploading: `Uploading… ${Math.round(progress * 100)}%`,
    scoring: 'Scoring…',
  };

  const boardRows = board[boardTrack];
  const boardAccent = TRACK_COLOR[boardTrack];
  const competitionBest = useMemo(() => {
    const ref = reference[boardTrack];
    if (!ref.length) return null;
    return ref.reduce((a, b) => ((b.best['balacc@10'] ?? -1) > (a.best['balacc@10'] ?? -1) ? b : a));
  }, [reference, boardTrack]);

  return (
    <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ marginTop: 0 }}>
          The 2026 Kaggle competitions have closed, but the benchmark stays open. Upload predictions for either
          track and they are scored against the held-out labels straight away, with the same metrics as the{' '}
          <Link href="/editions/2026/leaderboard/">competition leaderboard</Link>.
        </p>
        <p style={{ fontSize: '15px', color: INK.secondary, marginBottom: 0 }}>
          Only the <strong>public split</strong> of the test set is scored, the same rows behind the
          competition&apos;s public leaderboard, so the private split stays untouched. Final competition rankings are
          not affected by anything submitted here.
        </p>
      </div>

      {serviceDown && (
        <Card style={{ background: '#fdf3f3', border: '1px solid #f3c9c9', color: '#8a2d2d', fontSize: '15px', marginBottom: '1.5rem' }}>
          The evaluation service is not reachable right now. Please try again later, or contact{' '}
          <a href="mailto:libribrain@robots.ox.ac.uk" style={{ color: '#8a2d2d' }}>libribrain@robots.ox.ac.uk</a>.
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem', alignItems: 'start', marginBottom: '2rem' }}>
        {/* ------------------------------------------------------------ form */}
        <form onSubmit={onSubmit}>
          <Card>
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={labelStyle}>Track</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['deep', 'broad'] as EvalTrack[]).map((t) => (
                  <Pill key={t} active={track === t} color={TRACK_COLOR[t]} onClick={() => setTrack(t)}>
                    {TRACK_LABEL[t]} Track
                  </Pill>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="eval-file" style={labelStyle}>Submission file</label>
              <label
                htmlFor="eval-file"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                }}
                style={{
                  display: 'block',
                  border: `1.5px dashed ${dragging ? accent : file ? accent : '#d6d0e2'}`,
                  borderRadius: '8px',
                  background: dragging ? SURFACE : '#fff',
                  padding: '1.1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  color: INK.secondary,
                }}
              >
                {file ? (
                  <>
                    <strong style={{ color: INK.primary, wordBreak: 'break-all' }}>{file.name}</strong>
                    <span style={{ color: INK.muted }}> · {fmtMB(file.size)}</span>
                    <br />
                    <span style={{ fontSize: '13px', color: INK.muted }}>Click or drop to replace</span>
                  </>
                ) : (
                  <>
                    Drop your file here or <span style={{ color: accent, fontWeight: 600 }}>browse</span>
                    <br />
                    <span style={{ fontSize: '13px', color: INK.muted }}>.csv, .csv.gz or .zip, same format as on Kaggle</span>
                  </>
                )}
              </label>
              <input
                id="eval-file"
                type="file"
                accept=".csv,.gz,.zip,text/csv,application/gzip,application/zip"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 1rem' }}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label htmlFor="eval-team" style={labelStyle}>Team or display name</label>
                <input id="eval-team" type="text" required maxLength={60} value={team}
                  onChange={(e) => setTeam(e.target.value)} placeholder="Shown if listed" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label htmlFor="eval-email" style={labelStyle}>Email</label>
                <input id="eval-email" type="email" required autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="Never shown" style={inputStyle} />
              </div>
            </div>

            <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '14px', lineHeight: 1.5, color: INK.secondary, marginBottom: listed ? '0.9rem' : '1.4rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={listed} onChange={(e) => setListed(e.target.checked)} style={{ marginTop: '0.25rem', accentColor: accent }} />
              <span>List this result on the <strong>post-competition leaderboard</strong> below. Your team&apos;s best score is shown.</span>
            </label>

            {listed && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 1rem' }}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label htmlFor="eval-desc" style={labelStyle}>Method <span style={{ fontWeight: 400, color: INK.muted }}>(optional)</span></label>
                  <input id="eval-desc" type="text" maxLength={200} value={description}
                    onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Conformer + LM rescoring" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label htmlFor="eval-url" style={labelStyle}>Paper or code link <span style={{ fontWeight: 400, color: INK.muted }}>(optional)</span></label>
                  <input id="eval-url" type="url" maxLength={300} value={url}
                    onChange={(e) => setUrl(e.target.value)} placeholder="https://…" style={inputStyle} />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !file || !trackEnabled || serviceDown}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff',
                background: busy || !file || serviceDown ? '#b9aee0' : accent,
                border: 'none',
                borderRadius: '6px',
                padding: '0.8rem 1.6rem',
                cursor: busy ? 'wait' : !file ? 'not-allowed' : 'pointer',
                minWidth: '200px',
              }}
            >
              {phaseLabel[phase]}
            </button>
            {info && (
              <p style={{ fontSize: '13px', color: INK.muted, margin: '0.8rem 0 0', lineHeight: 1.5 }}>
                Up to {info.dailyLimit} submissions per track per 24 hours. Re-uploading an identical file returns
                the earlier result and does not count.
              </p>
            )}

            {error && (
              <div role="alert" style={{ marginTop: '1.2rem', fontSize: '14px', lineHeight: 1.6, color: '#8a2d2d', background: '#fdf3f3', border: '1px solid #f3c9c9', borderRadius: '6px', padding: '0.8rem 1rem' }}>
                {error.message}
                {error.details.length > 0 && (
                  <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem' }}>
                    {error.details.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                )}
              </div>
            )}
          </Card>
        </form>

        {/* ---------------------------------------------------------- result */}
        {result ? (
          <Card style={{ border: `1px solid ${TRACK_COLOR[result.track]}`, background: SURFACE }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: TRACK_COLOR[result.track], fontWeight: 700, background: '#fff', border: `1px solid ${BORDER}`, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
              {TRACK_LABEL[result.track]} Track · {result.split} split
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: INK.primary, margin: '0.8rem 0 0.2rem' }}>{result.team}</h3>
            <p style={{ fontSize: '13px', color: INK.muted, margin: '0 0 1.2rem' }}>
              {fmtDate(result.createdAt)} · {result.scoredRows.toLocaleString('en-GB')} rows scored
              {result.duplicate && ' · identical to an earlier upload'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.2rem' }}>
              {METRICS.map((m) => {
                const place = placeAmong(reference[result.track], m, result.metrics[m]);
                return (
                  <div key={m} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '12px 12px 10px' }}>
                    <div style={{ fontSize: '12px', color: INK.secondary, fontWeight: 600 }}>{metricLabel(m)}</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: m === 'balacc@10' ? TRACK_COLOR[result.track] : INK.primary, fontVariantNumeric: 'tabular-nums', lineHeight: 1.3 }}>
                      {fmt(result.metrics[m], m === 'ovmi' ? 3 : 4)}
                    </div>
                    {place && (
                      <div style={{ fontSize: '12px', color: INK.muted, lineHeight: 1.4 }}>
                        #{place.rank} of {place.of} teams
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: '13px', color: INK.secondary, lineHeight: 1.6, margin: '0 0 0.6rem' }}>
              Ranks compare against each competition team&apos;s best public-split score. BalAcc@10 can differ from
              Kaggle&apos;s by a few thousandths when several words share a probability at the top-10 boundary,
              because Kaggle breaks such ties arbitrarily.
            </p>
            <p style={{ fontSize: '13px', color: INK.muted, margin: 0, lineHeight: 1.6 }}>
              {result.listed ? 'Listed on the post-competition leaderboard.' : 'Not listed publicly.'}
              {result.remainingToday != null && ` ${result.remainingToday} submission${result.remainingToday === 1 ? '' : 's'} left on this track today.`}
              {' '}Result ID <code>{result.id}</code>
            </p>
          </Card>
        ) : (
          <Card style={{ background: SURFACE }}>
            <CardTitle title="What gets scored" />
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: INK.secondary, margin: 0, paddingLeft: '1.2rem' }}>
              <li>
                <strong>BalAcc@10</strong>, the competition metric: top-10 balanced accuracy over the 50-word
                vocabulary (chance 0.2).
              </li>
              <li><strong>BalAcc@1</strong>: the same, counting only the top prediction.</li>
              <li><strong>OVMI</strong>: out-of-vocabulary mutual information, in bits.</li>
            </ul>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: INK.secondary, margin: '0.9rem 0 0' }}>
              The file is the one you would have uploaded to Kaggle: an <code>index</code> column and one score column
              per vocabulary word, with a row for every test index of the track
              {info ? ` (${info.tracks.deep.rows?.toLocaleString('en-GB')} for Deep, ${info.tracks.broad.rows?.toLocaleString('en-GB')} for Broad)` : ''}.
              Any <code>moses_*</code> columns are ignored. Plain CSV files are compressed in your browser before
              upload.
            </p>
          </Card>
        )}
      </div>

      {/* ------------------------------------------------- post-competition board */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <CardTitle
          title="Post-competition leaderboard"
          note="Best opted-in result per team since the competition closed, public split. Separate from the official competition results."
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {(['deep', 'broad'] as EvalTrack[]).map((t) => (
            <Pill key={t} active={boardTrack === t} color={TRACK_COLOR[t]} onClick={() => setBoardTrack(t)}>
              {TRACK_LABEL[t]} Track
              {board[t] && board[t]!.length > 0 && <span style={{ opacity: 0.75, fontWeight: 400 }}> · {board[t]!.length}</span>}
            </Pill>
          ))}
        </div>
        {boardRows == null ? (
          <p style={{ fontSize: '14px', color: INK.muted, margin: 0 }}>Loading…</p>
        ) : boardRows.length === 0 ? (
          <p style={{ fontSize: '14px', color: INK.muted, margin: 0 }}>
            No listed results for the {TRACK_LABEL[boardTrack]} Track yet. Be the first.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
                  {['#', 'Team', ...METRICS.map(metricLabel), 'Subs', 'Date'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: i < 2 ? 'left' : 'right', fontSize: '12px', color: h === 'BalAcc@10' ? boardAccent : INK.secondary, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {h}{h === 'BalAcc@10' ? ' ↓' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {boardRows.map((t) => (
                  <tr key={t.team} style={{ borderBottom: '1px solid #f2f2f5' }}>
                    <td style={{ padding: '10px 12px', color: t.rank <= 3 ? boardAccent : INK.muted, fontWeight: t.rank <= 3 ? 700 : 400, fontVariantNumeric: 'tabular-nums' }}>{t.rank}</td>
                    <td style={{ padding: '10px 12px', lineHeight: 1.4 }}>
                      <div style={{ color: INK.primary, fontWeight: 500 }}>
                        {t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: INK.primary }}>{t.team} ↗</a> : t.team}
                      </div>
                      {t.description && <div style={{ fontSize: '12px', color: INK.muted }}>{t.description}</div>}
                    </td>
                    {METRICS.map((m) => (
                      <td key={m} style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: m === 'balacc@10' ? 700 : 400, color: INK.primary }}>
                        {fmt(t.metrics[m])}
                      </td>
                    ))}
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: INK.muted, fontVariantNumeric: 'tabular-nums' }}>{t.submissions}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: INK.muted, whiteSpace: 'nowrap' }}>{fmtDate(t.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {competitionBest && (
          <p style={{ fontSize: '13px', color: INK.muted, margin: '12px 0 0' }}>
            For reference: the best public BalAcc@10 during the competition was{' '}
            <strong style={{ color: INK.secondary }}>{fmt(competitionBest.best['balacc@10'])}</strong> ({competitionBest.team}).
          </p>
        )}
      </Card>

      {/* ----------------------------------------------------- command line */}
      <Card style={{ background: SURFACE }}>
        <CardTitle title="Submitting from the command line" note="Handy for large Broad files or scripted evaluation. The response is JSON with the scores." />
        <pre style={{ fontSize: '12.5px', lineHeight: 1.6, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '12px 14px', overflowX: 'auto', margin: 0, color: INK.primary }}>
{`gzip -k submission.csv
curl --data-binary @submission.csv.gz \\
  "${EVAL_API}/api/submissions?track=deep&team=My%20Team&email=me%40example.org&listed=0"`}
        </pre>
      </Card>
    </div>
  );
}
