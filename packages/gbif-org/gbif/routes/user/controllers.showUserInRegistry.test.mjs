import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../auth/gbifAuthRequest.mjs', () => ({ authenticatedRequest: vi.fn() }));
vi.mock('../auth/utils.mjs', () => ({
  fetchWithRetry: vi.fn(),
  setNoCache: vi.fn(),
  generateGraphQLToken: vi.fn(),
  generateToken: vi.fn(),
  removeTokenCookie: vi.fn(),
  setTokenCookie: vi.fn(),
}));
vi.mock('./encrypt.mjs', () => ({ decryptJSON: vi.fn() }));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: { REGISTRY_API_V1: 'https://registry.test/v1', PUBLIC_API_V1: 'https://api.test/v1' },
}));

const { decryptJSON } = await import('./encrypt.mjs');
const { showUserInRegistry } = await import('./controllers.mjs');

function fakeRes() {
  const res = {};
  res.redirect = vi.fn(() => res);
  res.sendStatus = vi.fn(() => res);
  return res;
}

const staff = { email: 'someone@gbif.org' };
const call = (res) => showUserInRegistry({ user: staff, params: { user: 'code' } }, res);

beforeEach(() => {
  decryptJSON.mockReset();
  process.env.PUBLIC_REGISTRY = 'https://registry.test';
});

describe('showUserInRegistry', () => {
  it('redirects to the user page', () => {
    decryptJSON.mockReturnValue({ userName: 'jane_doe' });
    const res = fakeRes();
    call(res);
    expect(res.redirect).toHaveBeenCalledWith(302, 'https://registry.test/user/jane_doe');
  });

  it('encodes characters that are not path safe', () => {
    decryptJSON.mockReturnValue({ userName: 'jane+gbif@example.org' });
    const res = fakeRes();
    call(res);
    expect(res.redirect).toHaveBeenCalledWith(
      302,
      'https://registry.test/user/jane%2Bgbif%40example.org'
    );
  });

  it.each(['../sdf', '..', '.', 'a/b', 'a?b', 'a#b', 'a%2Fb', undefined])(
    'does not redirect for the user name %j',
    (userName) => {
      decryptJSON.mockReturnValue({ userName });
      const res = fakeRes();
      call(res);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    }
  );

  it('answers 403 for users outside gbif.org', () => {
    const res = fakeRes();
    showUserInRegistry({ user: { email: 'a@example.org' }, params: { user: 'code' } }, res);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(decryptJSON).not.toHaveBeenCalled();
  });
});
