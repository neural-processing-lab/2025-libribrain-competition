'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navigation from '../../../../components/Navigation';
import Footer from '../../../../components/Footer';
import EditionLayout from '../../../../components/EditionLayout';
import {
  CertificateApiError,
  PublicCertificate,
  certificateTitle,
  formatIssueDate,
  verifyCertificate,
} from '../../../../../lib/certificates';

const PURPLE = '#776885';

type State =
  | { status: 'idle' }
  | { status: 'loading'; id: string }
  | { status: 'valid'; certificate: PublicCertificate }
  | { status: 'invalid'; id: string }
  | { status: 'error'; message: string };

function VerifyForm() {
  const params = useSearchParams();
  const initialId = params.get('id') ?? '';
  const [input, setInput] = useState(initialId);
  const [state, setState] = useState<State>({ status: 'idle' });

  async function check(id: string) {
    const trimmed = id.trim();
    if (!trimmed) return;
    setState({ status: 'loading', id: trimmed });
    try {
      const cert = await verifyCertificate(trimmed);
      setState(cert ? { status: 'valid', certificate: cert } : { status: 'invalid', id: trimmed });
    } catch (err) {
      setState({
        status: 'error',
        message:
          err instanceof CertificateApiError
            ? err.message
            : 'Could not reach the verification service. Please try again later.',
      });
    }
  }

  useEffect(() => {
    if (initialId) void check(initialId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    void check(input);
  }

  return (
    <>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          aria-label="Certificate ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="PNPL25-XXXX-XXXX"
          spellCheck={false}
          style={{
            flex: '1 1 240px',
            fontSize: '15px',
            fontFamily: 'var(--font-geist-mono), monospace',
            padding: '0.7rem 0.9rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            background: '#fff',
            color: '#0a0a0a',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={state.status === 'loading'}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            background: PURPLE,
            border: 'none',
            borderRadius: '6px',
            padding: '0.8rem 1.4rem',
            cursor: 'pointer',
          }}
        >
          {state.status === 'loading' ? 'Checking…' : 'Verify'}
        </button>
      </form>

      {state.status === 'valid' && (
        <div
          role="status"
          className="card"
          style={{ border: '1px solid #b7dfc3', borderRadius: '8px', padding: '2rem', background: '#f4fbf6' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span
              aria-hidden
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#2f8f4e',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#1f6b39' }}>Valid certificate</span>
          </div>
          <p style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: PURPLE, fontWeight: 600, margin: '0 0 0.3rem 0' }}>
            {certificateTitle(state.certificate.kind)} · PNPL Competition {state.certificate.edition}
          </p>
          <h3 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 0.8rem 0' }}>Team “{state.certificate.team}”</h3>
          <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7, margin: '0 0 1rem 0' }}>{state.certificate.text}</p>
          <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.6 }}>
            <code>{state.certificate.id}</code> · issued {formatIssueDate(state.certificate.issueDate)} by the PNPL Competition
            organisers, University of Oxford.
          </p>
        </div>
      )}

      {state.status === 'invalid' && (
        <div
          role="status"
          className="card"
          style={{ border: '1px solid #f3c9c9', borderRadius: '8px', padding: '2rem', background: '#fdf6f6' }}
        >
          <p style={{ fontSize: '17px', fontWeight: 700, color: '#8a2d2d', margin: '0 0 0.5rem 0' }}>Not a valid certificate</p>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, margin: 0 }}>
            No certificate with the ID <code>{state.id}</code> has been issued. The ID is printed under the QR code
            on every certificate — check it for typos.
          </p>
        </div>
      )}

      {state.status === 'error' && (
        <p role="alert" style={{ fontSize: '14px', color: '#8a2d2d', background: '#fdf3f3', border: '1px solid #f3c9c9', borderRadius: '6px', padding: '0.8rem 1rem' }}>
          {state.message}
        </p>
      )}
    </>
  );
}

export default function VerifyCertificatePage() {
  return (
    <>
      <Navigation />
      <main style={{ color: '#0a0a0a', background: '#fff' }}>
        <EditionLayout year="2025" title="Verify a certificate" subtitle="Check that a PNPL Competition 2025 certificate is genuine">
          <div style={{ fontSize: '17px', lineHeight: 1.8, color: '#444', marginBottom: '1.5rem' }}>
            <p>
              Scan the QR code on a certificate, or enter its ID, to confirm it was issued by the organisers and see
              what it certifies. Looking for your own? Go to the{' '}
              <Link href="/editions/2025/certificates/">certificates page</Link>.
            </p>
          </div>
          <Suspense fallback={<p style={{ color: '#888' }}>Loading…</p>}>
            <VerifyForm />
          </Suspense>
        </EditionLayout>
        <Footer />
      </main>
    </>
  );
}
