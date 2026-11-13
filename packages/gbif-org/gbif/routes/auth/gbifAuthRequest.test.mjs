import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./utils.mjs', () => ({ fetchWithRetry: vi.fn() }));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: { APP_KEY: 'test.app', APP_SECRET: 'test-secret' },
}));

const { fetchWithRetry } = await import('./utils.mjs');
const { authenticatedRequest } = await import('./gbifAuthRequest.mjs');

const get = { method: 'GET', url: 'https://registry.test/v1/admin/user/jane' };

// Headers sent by the code before identity was made explicit (commit 2951017), run with the same
// key, secret and inputs. Callers that relied on the fallback must still send these, byte for byte.
const before = {
  createUserAsApp: {
    'x-url': 'admin/user/',
    'x-gbif-user': 'test.app',
    'User-Agent': 'GBIF-portal',
    'Content-MD5': '08E7KICxVDZ14ya92zeWyQ==',
    'Content-Type': 'application/json',
    Authorization: 'GBIF test.app:Ab/XeZmcj5Cmk0uWkSr3bGOYy1w=',
  },
  getUserAsApp: {
    'x-url': 'https://registry.test/v1/admin/user/jane',
    'x-gbif-user': 'test.app',
    'User-Agent': 'GBIF-portal',
    Authorization: 'GBIF test.app:iON5sB0YyKMDIQdOuBdeXCuALOw=',
  },
  confirmAsUser: {
    'x-url': 'admin/user/confirm',
    'x-gbif-user': 'jane',
    'User-Agent': 'GBIF-portal',
    'Content-MD5': 'SWdWk3aEEeROZw2tejMxjw==',
    'Content-Type': 'application/json',
    Authorization: 'GBIF test.app:r7xKYw1YVIYqTIl/k+VXqPQVzN8=',
  },
  getDownloadAsUser: {
    'x-url': 'https://api.test/v1/occurrence/download/0012345-240626123714530',
    'x-gbif-user': 'jane',
    'User-Agent': 'GBIF-portal',
    Authorization: 'GBIF test.app:xquefssw9SBQsPm5rOW7kVAlKPc=',
  },
  putDownloadAsUser: {
    'x-url': 'occurrence/download/0012345-240626123714530',
    'x-gbif-user': 'jane',
    'User-Agent': 'GBIF-portal',
    'Content-MD5': 'lMt4B8jsB534PL9tKLIxMQ==',
    'Content-Type': 'application/json',
    Authorization: 'GBIF test.app:SVYoCRF/KGocL5wTDxVyue4W1HQ=',
  },
  cancelDownloadAsUser: {
    'x-url': 'https://api.test/v1/occurrence/download/request/0012345-240626123714530',
    'x-gbif-user': 'jane',
    'User-Agent': 'GBIF-portal',
    Authorization: 'GBIF test.app:NfPZ/Lcy4eNlgXMwc5PZj2+t7yU=',
  },
  updateUserAsApp: {
    'x-url': 'admin/user/jane',
    'x-gbif-user': 'test.app',
    'User-Agent': 'GBIF-portal',
    'Content-MD5': '08E7KICxVDZ14ya92zeWyQ==',
    'Content-Type': 'application/json',
    Authorization: 'GBIF test.app:eryMtgMOAd9ljNwhT+9KITaFf78=',
  },
};

const downloadKey = '0012345-240626123714530';

beforeEach(() => {
  fetchWithRetry.mockReset();
  fetchWithRetry.mockResolvedValue({ ok: true, status: 200, text: async () => '{}' });
});

function sentHeaders() {
  return fetchWithRetry.mock.calls[0][1].headers;
}

describe('authenticatedRequest signs exactly as before', () => {
  it('a POST as the app (create user)', async () => {
    await authenticatedRequest({
      method: 'POST',
      body: { userName: 'jane' },
      url: 'https://registry.test/v1/admin/user/',
      canonicalPath: 'admin/user/',
      asApp: true,
    });
    expect(sentHeaders()).toStrictEqual(before.createUserAsApp);
  });

  it('a GET as the app (get user by name)', async () => {
    await authenticatedRequest({ ...get, asApp: true });
    expect(sentHeaders()).toStrictEqual(before.getUserAsApp);
  });

  it('a POST as a user (confirm account)', async () => {
    await authenticatedRequest({
      method: 'POST',
      body: { confirmationKey: 'abc' },
      url: 'https://registry.test/v1/admin/user/confirm',
      canonicalPath: 'admin/user/confirm',
      userName: 'jane',
    });
    expect(sentHeaders()).toStrictEqual(before.confirmAsUser);
  });

  it('a GET as a user (get download)', async () => {
    await authenticatedRequest({
      method: 'GET',
      url: `https://api.test/v1/occurrence/download/${downloadKey}`,
      userName: 'jane',
    });
    expect(sentHeaders()).toStrictEqual(before.getDownloadAsUser);
  });

  it('a PUT as a user (set download erasure date)', async () => {
    await authenticatedRequest({
      method: 'PUT',
      body: { key: downloadKey, eraseAfter: '2026-01-01T00:00:00.000Z' },
      url: `https://api.test/v1/occurrence/download/${downloadKey}`,
      canonicalPath: `occurrence/download/${downloadKey}`,
      userName: 'jane',
    });
    expect(sentHeaders()).toStrictEqual(before.putDownloadAsUser);
  });

  it('a DELETE as a user (cancel download)', async () => {
    await authenticatedRequest({
      method: 'DELETE',
      url: `https://api.test/v1/occurrence/download/request/${downloadKey}`,
      userName: 'jane',
    });
    expect(sentHeaders()).toStrictEqual(before.cancelDownloadAsUser);
  });

  it('a PUT as the app (update user)', async () => {
    await authenticatedRequest({
      method: 'PUT',
      body: { userName: 'jane' },
      url: 'https://registry.test/v1/admin/user/jane',
      canonicalPath: 'admin/user/jane',
      asApp: true,
    });
    expect(sentHeaders()).toStrictEqual(before.updateUserAsApp);
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
