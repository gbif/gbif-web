import { createHash, createHmac } from 'crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./utils.mjs', () => ({ fetchWithRetry: vi.fn() }));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: { APP_KEY: 'test.app', APP_SECRET: 'test-secret' },
}));

const { fetchWithRetry } = await import('./utils.mjs');
const { authenticatedRequest } = await import('./gbifAuthRequest.mjs');

const get = { method: 'GET', url: 'https://registry.test/v1/admin/user/jane' };

const downloadKey = '0012345-240626123714530';

beforeEach(() => {
  fetchWithRetry.mockReset();
  fetchWithRetry.mockResolvedValue({ ok: true, status: 200, text: async () => '{}' });
});

function sent() {
  return fetchWithRetry.mock.calls[0];
}

function sentHeaders() {
  return sent()[1].headers;
}

/**
 * Checks the headers sign exactly the given lines, followed by the x-gbif-date they carry, with the
 * test app's secret. The lines are written out by hand, so this is an independent check of what the
 * server (gbif-common-ws GbifAuthServiceImpl) will verify.
 */
function expectSigned(headers, lines) {
  expect(Number.isNaN(Date.parse(headers['x-gbif-date']))).toBe(false);
  const stringToSign = [...lines, headers['x-gbif-date']].join('\n');
  const signature = createHmac('sha256', 'test-secret').update(stringToSign).digest('base64');
  expect(headers.Authorization).toBe(`GBIF test.app:${signature}`);
}

function md5(body) {
  return createHash('md5').update(body).digest('base64');
}

describe('authenticatedRequest signs', () => {
  it('a POST as the app (create user)', async () => {
    await authenticatedRequest({
      method: 'POST',
      body: { userName: 'jane' },
      url: 'https://registry.test/v1/admin/user/',
      asApp: true,
    });
    const body = '{"userName":"jane"}';
    expect(sent()[1].body).toBe(body);
    expect(sentHeaders()).toStrictEqual({
      'x-url': 'https://registry.test/v1/admin/user/',
      'x-gbif-user': 'test.app',
      'x-gbif-date': expect.any(String),
      'User-Agent': 'GBIF-portal',
      'Content-MD5': md5(body),
      'Content-Type': 'application/json',
      Authorization: expect.any(String),
    });
    expectSigned(sentHeaders(), [
      'POST',
      '/v1/admin/user/',
      'application/json',
      md5(body),
      'test.app',
    ]);
  });

  it('a GET as the app (get user by name)', async () => {
    await authenticatedRequest({ ...get, asApp: true });
    expect(sentHeaders()).toStrictEqual({
      'x-url': 'https://registry.test/v1/admin/user/jane',
      'x-gbif-user': 'test.app',
      'x-gbif-date': expect.any(String),
      'User-Agent': 'GBIF-portal',
      Authorization: expect.any(String),
    });
    expectSigned(sentHeaders(), ['GET', '/v1/admin/user/jane', 'test.app']);
  });

  it('a GET with a query string (find user)', async () => {
    await authenticatedRequest({
      method: 'GET',
      url: 'https://registry.test/v1/admin/user/find?systemSettings=x&q=a+b',
      asApp: true,
    });
    expect(sentHeaders()['x-url']).toBe('https://registry.test/v1/admin/user/find');
    expectSigned(sentHeaders(), [
      'GET',
      '/v1/admin/user/find?q=a%20b&systemSettings=x',
      'test.app',
    ]);
  });

  it('a POST as a user (confirm account)', async () => {
    await authenticatedRequest({
      method: 'POST',
      body: { confirmationKey: 'abc' },
      url: 'https://registry.test/v1/admin/user/confirm',
      userName: 'jane',
    });
    const body = '{"confirmationKey":"abc"}';
    expectSigned(sentHeaders(), [
      'POST',
      '/v1/admin/user/confirm',
      'application/json',
      md5(body),
      'jane',
    ]);
  });

  it('a POST with a query string as a user (request download)', async () => {
    await authenticatedRequest({
      method: 'POST',
      body: { creator: 'jane' },
      url: 'https://api.test/v1/occurrence/download/request/?source=gbif.org',
      userName: 'jane',
    });
    expectSigned(sentHeaders(), [
      'POST',
      '/v1/occurrence/download/request/?source=gbif.org',
      'application/json',
      md5('{"creator":"jane"}'),
      'jane',
    ]);
  });

  it('a GET as a user (get download)', async () => {
    await authenticatedRequest({
      method: 'GET',
      url: `https://api.test/v1/occurrence/download/${downloadKey}`,
      userName: 'jane',
    });
    expectSigned(sentHeaders(), ['GET', `/v1/occurrence/download/${downloadKey}`, 'jane']);
  });

  it('a DELETE as a user (cancel download)', async () => {
    await authenticatedRequest({
      method: 'DELETE',
      url: `https://api.test/v1/occurrence/download/request/${downloadKey}`,
      userName: 'jane',
    });
    expect(sentHeaders()['Content-MD5']).toBeUndefined();
    expect(sentHeaders()['Content-Type']).toBeUndefined();
    expectSigned(sentHeaders(), [
      'DELETE',
      `/v1/occurrence/download/request/${downloadKey}`,
      'jane',
    ]);
  });

  it('a PUT as the app with an encoded path (update user)', async () => {
    await authenticatedRequest({
      method: 'PUT',
      body: { userName: 'jane+x' },
      url: 'https://registry.test/v1/admin/user/jane%2Bx',
      asApp: true,
    });
    // the server signs the decoded path
    expectSigned(sentHeaders(), [
      'PUT',
      '/v1/admin/user/jane+x',
      'application/json',
      md5('{"userName":"jane+x"}'),
      'test.app',
    ]);
  });

  it('refuses a POST without a body', async () => {
    await expect(
      authenticatedRequest({ method: 'POST', url: 'https://registry.test/v1/x', asApp: true })
    ).rejects.toThrow('require a body');
    expect(fetchWithRetry).not.toHaveBeenCalled();
  });
});

describe('authenticatedRequest identity', () => {
  it.each(['jane', 'jane+gbif@example.org', 'jørgen', 'Jane Doe', 'x'.repeat(255)])(
    'signs as the real-world user name %j',
    async (userName) => {
      await authenticatedRequest({ ...get, userName });
      expect(sentHeaders()['x-gbif-user']).toBe(userName);
    }
  );

  it.each([
    undefined,
    '',
    '  ',
    null,
    42,
    {},
    'a\nb',
    'a\u0000b',
    'a\u007fb',
    'a\u0085b',
    'łukasz',
    'a\u2028b',
    ' jane',
    'jane ',
    'x'.repeat(256),
    'test.app',
    'TEST.APP',
  ])('refuses to send a request for user %j without asApp', async (userName) => {
    await expect(authenticatedRequest({ ...get, userName })).rejects.toThrow(
      'valid userName, or asApp'
    );
    expect(fetchWithRetry).not.toHaveBeenCalled();
  });

  it('refuses userName and asApp together', async () => {
    await expect(authenticatedRequest({ ...get, userName: 'jane', asApp: true })).rejects.toThrow(
      'not both'
    );
    expect(fetchWithRetry).not.toHaveBeenCalled();
  });
});
