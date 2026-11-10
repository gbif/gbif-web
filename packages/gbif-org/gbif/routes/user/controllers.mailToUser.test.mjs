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
const { mailToUser } = await import('./controllers.mjs');

function fakeRes() {
  const res = { calls: [] };
  res.status = vi.fn(() => res);
  res.send = vi.fn(() => res);
  res.sendStatus = vi.fn(() => res);
  res.redirect = vi.fn(() => res);
  return res;
}

const staff = { email: 'someone@gbif.org' };

beforeEach(() => {
  decryptJSON.mockReset();
});

describe('mailToUser', () => {
  it('answers once with a 500 and a message when there is no referer', () => {
    const res = fakeRes();
    mailToUser({ user: staff, params: { user: 'code' }, headers: {} }, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send.mock.calls[0][0]).toContain('No referer present');
    // it must stop here, not carry on and answer a second time
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(decryptJSON).not.toHaveBeenCalled();
  });

  it('redirects to a mailto link when there is a referer', () => {
    decryptJSON.mockReturnValue({ email: 'jane@example.org' });
    const res = fakeRes();
    mailToUser(
      {
        user: staff,
        params: { user: 'code' },
        headers: { referer: 'https://github.com/gbif/portal-feedback/issues/123' },
      },
      res
    );
    expect(res.redirect).toHaveBeenCalledTimes(1);
    const [status, url] = res.redirect.mock.calls[0];
    expect(status).toBe(302);
    expect(url).toContain('mailto:jane@example.org?subject=GBIF Feedback system - ticket 123');
  });

  it('answers 403 for users outside gbif.org', () => {
    const res = fakeRes();
    mailToUser({ user: { email: 'a@example.org' }, params: { user: 'code' }, headers: {} }, res);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});
