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
vi.mock('../../config/logger.mjs', () => ({
  default: { warn: vi.fn(), logError: vi.fn(), info: vi.fn(), error: vi.fn() },
}));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: { REGISTRY_API_V1: 'https://registry.test/v1', PUBLIC_API_V1: 'https://api.test/v1' },
}));

const { authenticatedRequest } = await import('../auth/gbifAuthRequest.mjs');
const { setNoCache } = await import('../auth/utils.mjs');
const { default: logger } = await import('../../config/logger.mjs');
const { getApiToken } = await import('./controllers.mjs');

function fakeRes() {
  const res = { statusCode: 200, body: undefined };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
}

function fakeJwt(payload) {
  const part = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${part({ alg: 'HS256' })}.${part(payload)}.c2lnbmF0dXJl`;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getApiToken controller', () => {
  it('answers the token and its expiry for the logged-in user', async () => {
    const token = fakeJwt({ userName: 'jane', exp: 2000000000 });
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: token });
    const res = fakeRes();
    await getApiToken({ user: { userName: 'jane' }, body: {}, query: {}, params: {} }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ token, expiresAt: 2000000000000 });
    expect(setNoCache).toHaveBeenCalledWith(res);
  });

  it('takes the user name from req.user only', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: fakeJwt({}) });
    await getApiToken(
      {
        user: { userName: 'jane' },
        body: { userName: 'admin' },
        query: { userName: 'admin' },
        params: { user: 'admin' },
      },
      fakeRes()
    );
    expect(authenticatedRequest.mock.calls[0][0].url).toBe(
      'https://registry.test/v1/user/jane/token'
    );
  });

  it('answers 502 with a fixed message and does not forward the upstream error', async () => {
    authenticatedRequest.mockRejectedValue(
      Object.assign(new Error('secret upstream detail'), { statusCode: 403 })
    );
    const res = fakeRes();
    await getApiToken({ user: { userName: 'jane' } }, res);
    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ message: 'Could not get an API token' });
  });

  it('answers 502 for a token issued to someone else, without logging the token', async () => {
    const token = fakeJwt({ userName: 'admin' });
    authenticatedRequest.mockResolvedValue({ statusCode: 200, body: token });
    const res = fakeRes();
    await getApiToken({ user: { userName: 'jane' } }, res);
    expect(res.statusCode).toBe(502);
    const logged = JSON.stringify([logger.warn.mock.calls, logger.logError.mock.calls]);
    expect(logged).not.toContain(token);
  });

  it('answers 502 without a request for an unsafe user name', async () => {
    const res = fakeRes();
    await getApiToken({ user: { userName: '../admin' } }, res);
    expect(res.statusCode).toBe(502);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});
