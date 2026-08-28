'use client';

import { CSSProperties, useState } from 'react';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import EditionLayout from '../../../components/EditionLayout';
import {
  CERTIFICATES_API,
  CertificateApiError,
  ClaimResult,
  certificateTitle,
  claimCertificate,
  formatIssueDate,
  linkedInAddToProfileUrl,
} from '../../../../lib/certificates';

const PURPLE = '#776885';

const inputStyle: CSSProperties = {
  width: '100%',
  fontSize: '15px',
  padding: '0.7rem 0.9rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  background: '#fff',
  color: '#0a0a0a',
  outline: 'none',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#444',
  marginBottom: '0.4rem',
};

export default function CertificatesPage() {
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClaimResult | null>(null);

  async function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await claimCertificate(email, team));
    } catch (err) {
      setError(
        err instanceof CertificateApiError
          ? err.message
          : 'Could not reach the certificate service. Please check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Certificates" subtitle="Download your team's certificate">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444', marginBottom: '2rem' }}>
            <p>
              Every team with a successful submission can download a <strong>Certificate of Participation</strong>;
              winning teams receive a <strong>Certificate of Achievement</strong>. Each one carries a unique ID and QR
              code that anyone can <Link href="/editions/2025/certificates/verify/">verify</Link>.
            </p>
            <p style={{ fontSize: '15px' }}>
              Enter the email address of your EvalAI account and your team name as shown on the{' '}
              <Link href="/editions/2025/leaderboard/">leaderboard</Link>. Any team member can do this; email addresses
              are never stored or displayed.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            <form
              onSubmit={onSubmit}
              className="card"
              style={{ border: '1px solid #eee', borderRadius: '8px', padding: '2rem', background: '#fff' }}
            >
              <div style={{ marginBottom: '1.2rem' }}>
                <label htmlFor="cert-email" style={labelStyle}>
                  EvalAI account email
                </label>
                <input
                  id="cert-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.org"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="cert-team" style={labelStyle}>
                  Team name
                </label>
                <input
                  id="cert-team"
                  type="text"
                  required
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="As shown on the leaderboard"
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  background: busy ? '#a99bb5' : PURPLE,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.8rem 1.6rem',
                  cursor: busy ? 'wait' : 'pointer',
                }}
              >
                {busy ? 'Looking up…' : 'Find my certificate'}
              </button>
              {error && (
                <p
                  role="alert"
                  style={{
                    marginTop: '1.2rem',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: '#8a2d2d',
                    background: '#fdf3f3',
                    border: '1px solid #f3c9c9',
                    borderRadius: '6px',
                    padding: '0.8rem 1rem',
                  }}
                >
                  {error}
                </p>
              )}
            </form>

            {result ? (
              <div
                className="card"
                style={{
                  border: `1px solid ${PURPLE}`,
                  borderRadius: '8px',
                  padding: '2rem',
                  background: '#fbfaff',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: PURPLE,
                    fontWeight: 600,
                    background: 'rgba(119,104,133,0.08)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '10px',
                    display: 'inline-block',
                    marginBottom: '0.8rem',
                  }}
                >
                  {certificateTitle(result.certificate.kind)}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 0.6rem 0' }}>{result.certificate.team}</h3>
                <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.6, margin: '0 0 1rem 0' }}>{result.certificate.text}</p>
                <p style={{ fontSize: '13px', color: '#888', margin: '0 0 1.4rem 0' }}>
                  <code>{result.certificate.id}</code> · issued {formatIssueDate(result.certificate.issueDate)}
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a
                    href={`${CERTIFICATES_API}${result.download}`}
                    download={result.filename}
                    style={{
                      display: 'inline-block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#fff',
                      background: PURPLE,
                      textDecoration: 'none',
                      borderRadius: '6px',
                      padding: '0.8rem 1.6rem',
                    }}
                  >
                    Download PDF
                  </a>
                  <a
                    href={linkedInAddToProfileUrl(result.certificate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#fff',
                      background: '#0A66C2',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      padding: '0.8rem 1.4rem',
                    }}
                  >
                    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                    </svg>
                    Add to LinkedIn profile
                  </a>
                </div>
                <p style={{ fontSize: '12px', color: '#999', margin: '1rem 0 0 0' }}>
                  Download link valid for one hour. LinkedIn opens a pre-filled &ldquo;add certification&rdquo; form for you
                  to review and save.
                </p>
              </div>
            ) : (
              <div style={{ fontSize: '14px', lineHeight: 1.7, color: '#666', padding: '0.5rem 0' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 0.5rem 0' }}>
                  Having trouble?
                </h3>
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                  <li>Use the email of the EvalAI account that was a member of the team.</li>
                  <li>
                    Only teams with at least one successfully evaluated submission are eligible — if you think
                    something is wrong, ask on our{' '}
                    <a href="https://libribrain.com/links/discord" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>
                      Discord
                    </a>
                    .
                  </li>
                </ul>
              </div>
            )}
          </div>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
