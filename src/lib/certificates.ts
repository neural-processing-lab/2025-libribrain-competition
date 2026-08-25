// Client for the 2025 certificate service (see ../../certificate-service in the
// competition workspace). The API never returns personal data: claims require
// the participant's email *and* team name, and only team-level facts come back.

export const CERTIFICATES_API = (
  process.env.NEXT_PUBLIC_CERTIFICATES_API ?? 'https://certificates.libribrain.com'
).replace(/\/$/, '');

export type CertificateKind = 'participation' | 'winner';

export interface PublicCertificate {
  id: string;
  edition: 2025;
  team: string;
  kind: CertificateKind;
  text: string;
  tracks: string[];
  awards: string[];
  /** YYYY-MM-DD */
  issueDate: string;
}

export interface ClaimResult {
  certificate: PublicCertificate;
  /** Path (relative to the API) with a short-lived signed token. */
  download: string;
  filename: string;
}

export class CertificateApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

async function readError(res: Response, fallback: string): Promise<never> {
  let message = fallback;
  try {
    const body = (await res.json()) as { message?: string };
    if (body?.message) message = body.message;
  } catch {
    /* non-JSON error body */
  }
  throw new CertificateApiError(message, res.status);
}

export async function claimCertificate(email: string, team: string): Promise<ClaimResult> {
  const res = await fetch(`${CERTIFICATES_API}/api/certificates/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, team }),
  });
  if (!res.ok) await readError(res, 'The certificate service is currently unavailable. Please try again later.');
  return (await res.json()) as ClaimResult;
}

export async function verifyCertificate(id: string): Promise<PublicCertificate | null> {
  const res = await fetch(`${CERTIFICATES_API}/api/certificates/${encodeURIComponent(id.trim())}`);
  if (res.status === 404) return null;
  if (!res.ok) await readError(res, 'The verification service is currently unavailable. Please try again later.');
  const body = (await res.json()) as { valid: boolean; certificate: PublicCertificate };
  return body.valid ? body.certificate : null;
}

export function certificateTitle(kind: CertificateKind): string {
  return kind === 'winner' ? 'Certificate of Achievement' : 'Certificate of Participation';
}

/** "2026-08-25" -> "25 August 2026" */
export function formatIssueDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ---------------------------------------------------------------- LinkedIn "Add to profile"
// LinkedIn's URL-based flow for licences & certifications: opens the "Add
// license or certification" dialog pre-filled; the user reviews and saves.
// https://www.linkedin.com/help/linkedin/answer/a520739

/** Canonical verification URL, independent of which hostname serves the site. */
export const CANONICAL_VERIFY_URL = 'https://libribrain.com/editions/2025/certificates/verify/';

/** Shown as the issuing organisation. If the lab/competition has a LinkedIn
 *  company page, set LINKEDIN_ORGANIZATION_ID to its numeric ID instead — the
 *  entry then carries the page's logo. */
export const LINKEDIN_ORGANIZATION_NAME = 'PNPL Competition · University of Oxford';
export const LINKEDIN_ORGANIZATION_ID: string | null = null;

export function linkedInAddToProfileUrl(cert: PublicCertificate): string {
  const [year, month] = cert.issueDate.split('-');
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${certificateTitle(cert.kind)} — PNPL Competition ${cert.edition}`,
    issueYear: year,
    issueMonth: String(Number(month)),
    certUrl: `${CANONICAL_VERIFY_URL}?id=${cert.id}`,
    certId: cert.id,
  });
  if (LINKEDIN_ORGANIZATION_ID) params.set('organizationId', LINKEDIN_ORGANIZATION_ID);
  else params.set('organizationName', LINKEDIN_ORGANIZATION_NAME);
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
