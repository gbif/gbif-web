import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isHttpUrl,
  isValidationKey,
  submitFile,
  submitUrl,
  validatorErrorKind,
  ValidatorHttpError,
} from './validatorApi';

const KEY = '4f0c7a40-1b2c-4d3e-8f90-0a1b2c3d4e5f';
const v1Endpoint = 'https://api.test/v1';

describe('validatorErrorKind', () => {
  it.each([
    [400, 'badRequest'],
    [401, 'unauthorized'],
    [403, 'unauthorized'],
    [404, 'notFound'],
    [413, 'tooLarge'],
    [415, 'unsupported'],
    [420, 'tooManyRunning'],
    [500, 'generic'],
    [502, 'generic'],
  ])('maps %i to %s', (status, kind) => {
    expect(validatorErrorKind(new ValidatorHttpError(status))).toBe(kind);
  });

  it.each([
    ['{"message":"File exceeds the maximum size allowed"}', 'tooLarge'],
    ['Unsupported file type: application/xml', 'unsupported'],
    ['{"message":"Something else"}', 'badRequest'],
    [undefined, 'badRequest'],
  ])('maps 400 with body %j to %s', (body, kind) => {
    expect(validatorErrorKind(new ValidatorHttpError(400, undefined, body))).toBe(kind);
  });

  it('maps anything that is not an HTTP error to generic', () => {
    expect(validatorErrorKind(new TypeError('Failed to fetch'))).toBe('generic');
    expect(validatorErrorKind(undefined)).toBe('generic');
  });
});

describe('isValidationKey', () => {
  it.each([KEY, KEY.toUpperCase()])('accepts %s', (key) => {
    expect(isValidationKey(key)).toBe(true);
  });

  it.each(['extensions', '../eml', `${KEY}/eml`, `${KEY}?x`, '', undefined, 42])(
    'rejects %j',
    (key) => {
      expect(isValidationKey(key)).toBe(false);
    }
  );
});

describe('isHttpUrl', () => {
  it.each(['https://example.org/dwca.zip', ' http://example.org/a.zip '])('accepts %j', (url) => {
    expect(isHttpUrl(url)).toBe(true);
  });

  it.each(['example.org/dwca.zip', 'ftp://example.org/a.zip', 'javascript:alert(1)', ''])(
    'rejects %j',
    (url) => {
      expect(isHttpUrl(url)).toBe(false);
    }
  );
});

describe('submitUrl', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  it('submits a URL as multipart fileUrl', async () => {
    fetchMock.mockResolvedValue(json({ key: KEY }));
    await expect(
      submitUrl({ v1Endpoint, token: 't', fileUrl: ' https://example.org/a.zip ' })
    ).resolves.toEqual({ key: KEY });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${v1Endpoint}/validation/url`);
    expect(init.method).toBe('POST');
    expect((init.body as FormData).get('fileUrl')).toBe('https://example.org/a.zip');
  });

  it('keeps the body of an error answer', async () => {
    fetchMock.mockResolvedValue(
      new Response('Unsupported file type: application/xml', { status: 400 })
    );
    await expect(
      submitUrl({ v1Endpoint, token: 't', fileUrl: 'https://a.b' })
    ).rejects.toMatchObject({ status: 400, body: 'Unsupported file type: application/xml' });
  });

  it('rejects a submit answer without a key', async () => {
    fetchMock.mockResolvedValue(json({}));
    await expect(submitUrl({ v1Endpoint, token: 't', fileUrl: 'https://a.b' })).rejects.toThrow(
      'key'
    );
  });
});

class FakeXhr {
  static last: FakeXhr;
  status = 0;
  responseText = '';
  responseType = '';
  headers: Record<string, string> = {};
  method?: string;
  url?: string;
  body?: FormData;
  upload: { onprogress?: (event: Partial<ProgressEvent>) => void } = {};
  onload?: () => void;
  onerror?: () => void;
  onabort?: () => void;
  constructor() {
    FakeXhr.last = this;
  }
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }
  send(body: FormData) {
    this.body = body;
  }
  abort() {
    this.onabort?.();
  }
  respond(status: number, body: unknown) {
    this.status = status;
    this.responseText = JSON.stringify(body);
    this.onload?.();
  }
}

describe('submitFile', () => {
  beforeEach(() => {
    vi.stubGlobal('XMLHttpRequest', FakeXhr);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const file = new File(['a,b'], 'data.csv', { type: 'text/csv' });

  it('posts the file as multipart and reports progress', async () => {
    const progress: number[] = [];
    const result = submitFile({
      v1Endpoint,
      token: 't',
      file,
      onProgress: (p) => progress.push(p),
    });
    const xhr = FakeXhr.last;
    expect(xhr.method).toBe('POST');
    expect(xhr.url).toBe(`${v1Endpoint}/validation`);
    expect(xhr.headers.Authorization).toBe('Bearer t');
    expect((xhr.body?.get('file') as File).name).toBe('data.csv');
    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 50, total: 200 });
    xhr.upload.onprogress?.({ lengthComputable: false, loaded: 1, total: 0 });
    xhr.respond(201, { key: KEY });
    await expect(result).resolves.toEqual({ key: KEY });
    expect(progress).toEqual([25]);
  });

  it('rejects with the HTTP status', async () => {
    const result = submitFile({ v1Endpoint, token: 't', file });
    FakeXhr.last.respond(413, { message: 'too large' });
    await expect(result).rejects.toMatchObject({
      status: 413,
      body: JSON.stringify({ message: 'too large' }),
    });
  });

  it('aborts with the signal', async () => {
    const controller = new AbortController();
    const result = submitFile({ v1Endpoint, token: 't', file, signal: controller.signal });
    controller.abort();
    await expect(result).rejects.toMatchObject({ name: 'AbortError' });
  });
});
