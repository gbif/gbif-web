import type { Validation } from './types';

export class ValidatorHttpError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message ?? `Validator API answered ${status}`);
    this.name = 'ValidatorHttpError';
    this.status = status;
  }
}

export type ValidatorErrorKind =
  'badRequest' | 'unauthorized' | 'notFound' | 'tooLarge' | 'unsupported' | 'generic';

export function validatorErrorKind(error: unknown): ValidatorErrorKind {
  if (!(error instanceof ValidatorHttpError)) return 'generic';
  switch (error.status) {
    case 400:
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

type RequestBase = { v1Endpoint: string; token: string; signal?: AbortSignal };

function validationUrl(v1Endpoint: string, ...segments: string[]) {
  return [v1Endpoint.replace(/\/$/, ''), 'validation', ...segments].join('/');
}

function readKey(body: unknown): { key: string } {
  const key = (body as { key?: unknown } | null)?.key;
  if (!isValidationKey(key)) throw new Error('The validator did not answer with a key');
  return { key };
}

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
        reject(new ValidatorHttpError(xhr.status));
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

    if (signal) {
      if (signal.aborted) {
        xhr.abort();
        return;
      }
      signal.addEventListener('abort', () => xhr.abort(), { once: true });
    }

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
  if (!response.ok) throw new ValidatorHttpError(response.status);
  return readKey(await response.json());
}

export async function fetchValidation({
  v1Endpoint,
  token,
  key,
  signal,
}: RequestBase & { key: string }): Promise<Validation> {
  if (!isValidationKey(key)) throw new ValidatorHttpError(404, 'Not a validation key');
  const response = await fetch(validationUrl(v1Endpoint, encodeURIComponent(key)), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw new ValidatorHttpError(response.status);
  return (await response.json()) as Validation;
}

export async function fetchEml({
  v1Endpoint,
  token,
  key,
  signal,
}: RequestBase & { key: string }): Promise<unknown> {
  if (!isValidationKey(key)) throw new ValidatorHttpError(404, 'Not a validation key');
  const response = await fetch(validationUrl(v1Endpoint, encodeURIComponent(key), 'eml'), {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  if (!response.ok) throw new ValidatorHttpError(response.status);
  return response.json();
}
