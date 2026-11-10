import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./utils.mjs', () => ({ fetchWithRetry: vi.fn() }));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: { APP_KEY: 'gbif.app', APP_SECRET: 'secret' },
}));

const { fetchWithRetry } = await import('./utils.mjs');
const { authenticatedRequest } = await import('./gbifAuthRequest.mjs');

const get = { method: 'GET', url: 'https://registry.test/v1/admin/user/jane' };

beforeEach(() => {
  fetchWithRetry.mockReset();
  fetchWithRetry.mockResolvedValue({ ok: true, status: 200, text: async () => '{}' });
});

function sentUser() {
  return fetchWithRetry.mock.calls[0][1].headers['x-gbif-user'];
}

describe('authenticatedRequest identity', () => {
  it('signs as the given user', async () => {
    await authenticatedRequest({ ...get, userName: 'jane' });
    expect(sentUser()).toBe('jane');
  });

  it('signs as the app only when asked to', async () => {
    await authenticatedRequest({ ...get, asApp: true });
    expect(sentUser()).toBe('gbif.app');
  });

  it.each([undefined, '', '  ', null, 42, {}, 'a\nb', 'a\u0000b', 'x'.repeat(256)])(
    'refuses to send a request for user %j without asApp',
    async (userName) => {
      await expect(authenticatedRequest({ ...get, userName })).rejects.toThrow(
        'valid userName, or asApp'
      );
      expect(fetchWithRetry).not.toHaveBeenCalled();
    }
  );

  it('refuses userName and asApp together', async () => {
    await expect(authenticatedRequest({ ...get, userName: 'jane', asApp: true })).rejects.toThrow(
      'not both'
    );
    expect(fetchWithRetry).not.toHaveBeenCalled();
  });

  it('accepts old user names that are email addresses', async () => {
    await authenticatedRequest({ ...get, userName: 'jane+gbif@example.org' });
    expect(sentUser()).toBe('jane+gbif@example.org');
  });
});
