import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../auth/gbifAuthRequest.mjs', () => ({ authenticatedRequest: vi.fn() }));
vi.mock('../auth/utils.mjs', () => ({ fetchWithRetry: vi.fn() }));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: { REGISTRY_API_V1: 'https://registry.test/v1', PUBLIC_API_V1: 'https://api.test/v1' },
}));

const { authenticatedRequest } = await import('../auth/gbifAuthRequest.mjs');
const {
  getByUserName,
  update,
  userPathSegment,
  cancelDownload,
  deleteDownload,
  postponeDownloadDeletion,
  updateDerivedDataset,
  downloadKeySegment,
  downloadType,
  derivedDatasetDoiPath,
  getUserApiToken,
} = await import('./user.model.mjs');

const unsafeUserNames = [
  'a/b',
  '../user/find?x=1',
  'a\\b',
  'a?b',
  'a#b',
  'a%2Fb',
  '.',
  '..',
  'a\nb',
  '',
  '  ',
  undefined,
  null,
  42,
];

beforeEach(() => {
  authenticatedRequest.mockReset();
});

describe('userPathSegment', () => {
  it('leaves ordinary user names unchanged', () => {
    expect(userPathSegment('jane_doe-1.2')).toBe('jane_doe-1.2');
  });

  // Real accounts have names like these. They are not dot segments, so they must stay allowed.
  it.each(['...abc...', '...', '.abc', 'abc.', 'a..b'])('allows %s', (userName) => {
    expect(userPathSegment(userName)).toBe(userName);
    const path = new URL(`https://registry.test/v1/admin/user/${userPathSegment(userName)}`)
      .pathname;
    expect(path).toBe(`/v1/admin/user/${userName}`);
  });

  it('encodes characters that are allowed but not path-safe', () => {
    expect(userPathSegment('jane+gbif@example.org')).toBe('jane%2Bgbif%40example.org');
    expect(userPathSegment('a b&c')).toBe('a%20b%26c');
  });

  it.each(unsafeUserNames)('rejects %j', (userName) => {
    expect(() => userPathSegment(userName)).toThrow(TypeError);
  });
});

describe('getByUserName', () => {
  it('requests the admin user endpoint for that user only', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: { userName: 'jane' } });
    await expect(getByUserName('jane')).resolves.toEqual({ userName: 'jane' });
    expect(authenticatedRequest).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', url: 'https://registry.test/v1/admin/user/jane' })
    );
  });

  it('encodes the user name in the request URL', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: { userName: 'jane+x' } });
    await getByUserName('jane+x');
    expect(authenticatedRequest).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://registry.test/v1/admin/user/jane%2Bx' })
    );
  });

  it.each(unsafeUserNames)('never sends a request for %j', async (userName) => {
    await expect(getByUserName(userName)).rejects.toThrow(TypeError);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });

  it('rejects a response for a different user', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: { userName: 'admin' } });
    await expect(getByUserName('jane')).rejects.toThrow('different user');
  });

  it('rejects a response without a user', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: [{ userName: 'jane' }] });
    await expect(getByUserName('jane')).rejects.toThrow('different user');
  });
});

describe('update', () => {
  it('signs and sends the same encoded path', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 204 });
    await update('jane+x', { userName: 'jane+x' });
    expect(authenticatedRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: 'https://registry.test/v1/admin/user/jane%2Bx',
        canonicalPath: 'admin/user/jane%2Bx',
      })
    );
  });

  it('encodes a non-ASCII user name in both the URL and the signed path', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 204 });
    await update('jørgen', { userName: 'jørgen' });
    expect(authenticatedRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://registry.test/v1/admin/user/j%C3%B8rgen',
        canonicalPath: 'admin/user/j%C3%B8rgen',
      })
    );
  });

  it.each(unsafeUserNames)('never sends a request for %j', async (userName) => {
    await expect(update(userName, {})).rejects.toThrow(TypeError);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });

  it('refuses a body for a different user', async () => {
    await expect(update('jane', { userName: 'admin' })).rejects.toThrow(TypeError);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});

const goodKey = '0012345-240626123714530';
const badKeys = [
  '../../x',
  '..%2F..%2Fx',
  `${goodKey}/../../x`,
  `${goodKey}?x=1`,
  `${goodKey}#x`,
  `${goodKey}\n`,
  '..%2e',
  '%2e%2e-1',
  '１２３-４５６',
  '12345',
  '',
  ' ',
  undefined,
  null,
  42,
  [goodKey],
];

describe('downloadKeySegment and downloadType', () => {
  it('accepts a real download key', () => {
    expect(downloadKeySegment(goodKey)).toBe(goodKey);
  });

  it.each(badKeys)('rejects key %j with a 400', (key) => {
    expect(() => downloadKeySegment(key)).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  it('defaults to OCCURRENCE and only allows OCCURRENCE or EVENT', () => {
    expect(downloadType(undefined)).toBe('OCCURRENCE');
    expect(downloadType('OCCURRENCE')).toBe('OCCURRENCE');
    expect(downloadType('EVENT')).toBe('EVENT');
    for (const bad of ['event', 'OTHER', '', null, ['EVENT'], { a: 1 }]) {
      expect(() => downloadType(bad)).toThrow(expect.objectContaining({ statusCode: 400 }));
    }
  });
});

describe('download actions', () => {
  it('cancels with the key at the end of the URL', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 204 });
    await cancelDownload({ key: goodKey, type: 'EVENT', username: 'jane' });
    const options = authenticatedRequest.mock.calls[0][0];
    expect(options).toMatchObject({ method: 'DELETE', userName: 'jane' });
    expect(options.url.endsWith(`/${goodKey}`)).toBe(true);
  });

  it.each([
    ['cancelDownload', cancelDownload],
    ['deleteDownload', deleteDownload],
    ['postponeDownloadDeletion', postponeDownloadDeletion],
  ])('%s never sends a request for a bad key or type', async (_name, fn) => {
    for (const key of badKeys) {
      await expect(fn({ key, username: 'jane' })).rejects.toThrow(TypeError);
    }
    await expect(fn({ key: goodKey, type: 'x', username: 'jane' })).rejects.toThrow(TypeError);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});

describe('derivedDatasetDoiPath', () => {
  it('keeps the slash and encodes the suffix', () => {
    expect(derivedDatasetDoiPath('10.15468/dd.abc123')).toBe('10.15468/dd.abc123');
    expect(derivedDatasetDoiPath('10.15468/a%b')).toBe('10.15468/a%25b');
  });

  it.each([
    '../../x',
    '10.15468/..',
    '10.15468/.',
    '10.15468/a/b',
    '10.15468/a b',
    '10.15468/',
    '10.15468',
    '11.15468/x',
    '10.12/x',
    '10.15468/x\n',
    '',
    undefined,
    null,
    42,
  ])('rejects %j', (doi) => {
    expect(() => derivedDatasetDoiPath(doi)).toThrow(expect.objectContaining({ statusCode: 400 }));
  });

  it('keeps ? and # inside the path of the request that is sent', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 204 });
    await updateDerivedDataset({ a: 1 }, '10.1234/a?b#c', 'jane');
    const url = new URL(authenticatedRequest.mock.calls[0][0].url);
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
    expect(url.pathname.endsWith('/10.1234/a%3Fb%23c')).toBe(true);
  });
});

describe('updateDerivedDataset', () => {
  it('puts to the DOI path', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 204 });
    await updateDerivedDataset({ a: 1 }, '10.15468/dd.abc', 'jane');
    expect(authenticatedRequest.mock.calls[0][0].url.endsWith('/10.15468/dd.abc')).toBe(true);
  });

  it('never sends a request for a traversing DOI', async () => {
    await expect(updateDerivedDataset({}, '10.15468/..', 'jane')).rejects.toThrow(TypeError);
    await expect(updateDerivedDataset({}, '../../x', 'jane')).rejects.toThrow(TypeError);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});

function fakeJwt(payload) {
  const part = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${part({ alg: 'HS256' })}.${part(payload)}.c2lnbmF0dXJl`;
}

describe('getUserApiToken', () => {
  it('signs a GET to the user token endpoint with the app key', async () => {
    const token = fakeJwt({ userName: 'jane', exp: 2000000000 });
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: token });
    await expect(getUserApiToken('jane')).resolves.toEqual({ token, expiresAt: 2000000000000 });
    const options = authenticatedRequest.mock.calls[0][0];
    expect(options).toEqual({
      method: 'GET',
      url: 'https://registry.test/v1/user/jane/token',
      canonicalPath: 'user/jane/token',
    });
    expect(options.userName).toBeUndefined();
  });

  it('encodes the user name in both the URL and the signed path', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: fakeJwt({}) });
    await getUserApiToken('jane+x');
    const options = authenticatedRequest.mock.calls[0][0];
    expect(options.url).toBe('https://registry.test/v1/user/jane%2Bx/token');
    expect(options.canonicalPath).toBe('user/jane%2Bx/token');
  });

  it.each(unsafeUserNames)('never sends a request for %j', async (userName) => {
    await expect(getUserApiToken(userName)).rejects.toThrow(TypeError);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });

  it.each([
    ['an object', { token: 'a.b.c' }],
    ['an empty string', ''],
    ['a string that is not a JWT', '<html>error</html>'],
    ['a JWT with extra parts', 'a.b.c.d'],
  ])('rejects %s as the token', async (_label, body) => {
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body });
    await expect(getUserApiToken('jane')).rejects.toThrow('not a JWT');
  });

  it('rejects a token issued for another user', async () => {
    authenticatedRequest.mockResolvedValue({
      statusCode: 200,
      body: fakeJwt({ userName: 'admin' }),
    });
    await expect(getUserApiToken('jane')).rejects.toThrow('different user');
  });

  it('falls back to a short lifetime when the token has no expiry', async () => {
    authenticatedRequest.mockResolvedValue({
      statusCode: 200,
      body: fakeJwt({ userName: 'jane' }),
    });
    const before = Date.now();
    const { expiresAt } = await getUserApiToken('jane');
    expect(expiresAt).toBeGreaterThanOrEqual(before + 5 * 60 * 1000);
    expect(expiresAt).toBeLessThanOrEqual(Date.now() + 5 * 60 * 1000);
  });

  it('rejects a non-200 answer', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 204, body: '' });
    await expect(getUserApiToken('jane')).rejects.toThrow();
  });
});
