// Client for the post-competition evaluation service (libribrain-eval in the
// competition workspace). The Kaggle tracks have closed; the service scores
// uploaded submission files against the held-out labels, on the public split
// only, so teams can see how they would have scored. Labels never leave it.

export const EVAL_API = (process.env.NEXT_PUBLIC_EVAL_API ?? 'https://eval.libribrain.com').replace(/\/$/, '');

export type EvalTrack = 'deep' | 'broad';
export type Metrics = Record<string, number | null>;

export interface EvalInfo {
  split: string;
  dailyLimit: number;
  maxUploadMB: number;
  formats: string[];
  metrics: string[];
  tracks: Record<EvalTrack, { label: string; competition: string; enabled: boolean; rows: number | null }>;
}

export interface EvalResult {
  id: string;
  track: EvalTrack;
  createdAt: string;
  split: string;
  scoredRows: number;
  metrics: Metrics;
  duplicate?: boolean;
  remainingToday?: number;
}

export interface SubmitFields {
  track: EvalTrack;
  email: string;
}

export class EvalApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly details: string[] = []) {
    super(message);
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${EVAL_API}${path}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new EvalApiError(body?.error || 'The evaluation service is unavailable.', res.status);
  return body as T;
}

export const fetchEvalInfo = () => getJson<EvalInfo>('/api/info');
export const fetchEvalResult = (id: string) => getJson<EvalResult>(`/api/submissions/${encodeURIComponent(id)}`);

/**
 * Gzips a plain CSV in the browser before upload (submission files compress
 * ~3-8x, and Broad files are tens of MB). Already-compressed files pass through.
 */
export async function compressForUpload(file: File): Promise<Blob> {
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const compressed = (head[0] === 0x1f && head[1] === 0x8b) || (head[0] === 0x50 && head[1] === 0x4b);
  if (compressed || typeof CompressionStream === 'undefined') return file;
  return new Response(file.stream().pipeThrough(new CompressionStream('gzip'))).blob();
}

/** Uploads the file and resolves with the scores. XHR rather than fetch, for upload progress. */
export function submitForEvaluation(
  body: Blob,
  fields: SubmitFields,
  onUploadProgress: (fraction: number) => void,
): Promise<EvalResult> {
  const params = new URLSearchParams({
    track: fields.track,
    email: fields.email,
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${EVAL_API}/api/submissions?${params}`);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onUploadProgress(e.loaded / e.total); };
    xhr.onload = () => {
      let data: { error?: string; details?: string[]; retryAt?: string } & Partial<EvalResult> = {};
      try { data = JSON.parse(xhr.responseText); } catch { /* non-JSON error */ }
      if (xhr.status >= 200 && xhr.status < 300) return resolve(data as EvalResult);
      let message = data.error || `The evaluation service returned an error (${xhr.status}).`;
      if (data.retryAt) {
        message += ` You can submit again from ${new Date(data.retryAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}.`;
      }
      reject(new EvalApiError(message, xhr.status, data.details || []));
    };
    xhr.onerror = () => reject(new EvalApiError('Could not reach the evaluation service. Please check your connection and try again.', 0));
    xhr.send(body);
  });
}
