import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../auth/gbifAuthRequest.mjs', () => ({ authenticatedRequest: vi.fn() }));
vi.mock('../auth/utils.mjs', () => ({ fetchWithRetry: vi.fn() }));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: { REGISTRY_API_V1: 'https://registry.test/v1', PUBLIC_API_V1: 'https://api.test/v1' },
}));

const { authenticatedRequest } = await import('../auth/gbifAuthRequest.mjs');
const { getByUserName, update, userPathSegment } = await import('./user.model.mjs');

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
