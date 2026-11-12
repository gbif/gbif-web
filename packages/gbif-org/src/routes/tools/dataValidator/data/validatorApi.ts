export class ValidatorHttpError extends Error {
  status: number;
  body?: string;
  constructor(status: number, message?: string, body?: string) {
    super(message ?? `Validator API answered ${status}`);
    this.name = 'ValidatorHttpError';
    this.status = status;
    this.body = body;
  }
}

export type ValidatorErrorKind =
  | 'badRequest'
  | 'unauthorized'
  | 'notFound'
  | 'tooLarge'
  | 'unsupported'
  | 'tooManyRunning'
  | 'generic';

export function validatorErrorKind(error: unknown): ValidatorErrorKind {
  if (!(error instanceof ValidatorHttpError)) return 'generic';
  switch (error.status) {
    case 400:
      if (/exceeds the maximum size/i.test(error.body ?? '')) return 'tooLarge';
      if (/unsupported file type/i.test(error.body ?? '')) return 'unsupported';
      return 'badRequest';
    case 401:
    case 403:
      return 'unauthorized';
    case 404:
      return 'notFound';
    case 413:
      return 'tooLarge';
    case 415:
      return 'unsupported';
    case 420:
      return 'tooManyRunning';
    default:
      return 'generic';
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidationKey(key: unknown): key is string {
  return typeof key === 'string' && UUID.test(key);
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Submissions post to the REST API; results are read through GraphQL (validatorGraphql.ts).
type RequestBase = { v1Endpoint: string; token: string; signal?: AbortSignal };

function validationUrl(v1Endpoint: string, ...segments: string[]) {
  return [v1Endpoint.replace(/\/$/, ''), 'validation', ...segments].join('/');
}

function readKey(body: unknown): { key: string } {
  const key = (body as { key?: unknown } | null)?.key;
  if (!isValidationKey(key)) throw new Error('The validator did not answer with a key');
  return { key };
}

// the limit the upload form states; the validator's own limit is configured per deployment
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

// XMLHttpRequest because fetch cannot report upload progress.
export function submitFile({
  v1Endpoint,
  token,
  file,
  onProgress,
  signal,
}: RequestBase & { file: File; onProgress?: (percent: number) => void }): Promise<{
  key: string;
}> {
  return new Promise((resolve, reject) => {
    // abort() on an XHR that was never sent fires no abort event
    if (signal?.aborted) {
      reject(new DOMException('Upload aborted', 'AbortError'));
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', validationUrl(v1Endpoint));
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'text';

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.min(100, Math.round((100 * event.loaded) / event.total)));
      }
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new ValidatorHttpError(xhr.status, undefined, xhr.responseText));
        return;
      }
      try {
        resolve(readKey(JSON.parse(xhr.responseText)));
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () => reject(new Error('Network error while uploading'));
    xhr.onabort = () => reject(new DOMException('Upload aborted', 'AbortError'));

    signal?.addEventListener('abort', () => xhr.abort(), { once: true });

    const body = new FormData();
    body.append('file', file);
    xhr.send(body);
  });
}

export async function submitUrl({
  v1Endpoint,
  token,
  fileUrl,
  signal,
}: RequestBase & { fileUrl: string }): Promise<{ key: string }> {
  const body = new FormData();
  body.append('fileUrl', fileUrl.trim());
  const response = await fetch(validationUrl(v1Endpoint, 'url'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
    signal,
  });
  if (!response.ok) {
    let text: string | undefined;
    try {
      text = await response.text();
    } catch {
      // the status alone is enough
    }
    throw new ValidatorHttpError(response.status, undefined, text);
  }
  return readKey(await response.json());
}
