import { beforeEach, describe, expect, it, vi } from 'vitest';

// Only the upstream call is mocked: the user name checks in user.model.mjs run for real.
vi.mock('../auth/gbifAuthRequest.mjs', () => ({ authenticatedRequest: vi.fn() }));
vi.mock('../auth/utils.mjs', () => ({
  fetchWithRetry: vi.fn(),
  setNoCache: vi.fn(),
  generateGraphQLToken: vi.fn(),
  generateToken: vi.fn(() => 'token'),
  removeTokenCookie: vi.fn(),
  setTokenCookie: vi.fn(),
}));
vi.mock('./encrypt.mjs', () => ({ decryptJSON: vi.fn() }));
vi.mock('../../envConfig.mjs', () => ({
  secretEnv: {
    REGISTRY_API_V1: 'https://registry.test/v1',
    PUBLIC_API_V1: 'https://api.test/v1',
    APP_KEY: 'test.app',
  },
}));

const { authenticatedRequest } = await import('../auth/gbifAuthRequest.mjs');
const { confirmAccount, resetPassword, updatePasswordFromChallengeCode } =
  await import('./controllers.mjs');

function fakeRes() {
  const res = { statusCode: 200, body: undefined };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.sendStatus = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  // wait for the controller's promise chain to settle
  res.done = () => new Promise((resolve) => setTimeout(resolve, 0));
  return res;
}

const registryUser = { userName: 'jane', settings: {} };

beforeEach(() => {
  authenticatedRequest.mockReset();
});

const unusableUserNames = [undefined, 42, { $ne: 1 }, 'a\nb', 'łukasz', 'test.app', 'TEST.APP'];

describe('confirm', () => {
  it.each(unusableUserNames)('answers 400 and sends nothing for user %j', async (username) => {
    const res = fakeRes();
    confirmAccount({ body: { code: 'code', username } }, res);
    await res.done();
    expect(res.statusCode).toBe(400);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });

  it('answers 400 and sends nothing without a challenge code', async () => {
    const res = fakeRes();
    confirmAccount({ body: { username: 'jane' } }, res);
    await res.done();
    expect(res.statusCode).toBe(400);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });

  it('trims a stray space from the user name', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 201, body: registryUser });
    const res = fakeRes();
    confirmAccount({ body: { code: 'code', username: ' jane ' } }, res);
    await res.done();
    expect(authenticatedRequest.mock.calls[0][0].userName).toBe('jane');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ user: { userName: 'jane' } });
  });

  // Only spaces and tabs are trimmed: a non-breaking space is not quietly dropped.
  it('answers 400 for a user name ending in a non-breaking space', async () => {
    const res = fakeRes();
    confirmAccount({ body: { code: 'code', username: 'jane\u00a0' } }, res);
    await res.done();
    expect(res.statusCode).toBe(400);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});

describe('update-forgotten-password', () => {
  it.each(unusableUserNames)('answers 400 and sends nothing for user %j', async (userName) => {
    const res = fakeRes();
    updatePasswordFromChallengeCode(
      { body: { userName, challengeCode: 'code', password: 'pw' } },
      res
    );
    await res.done();
    expect(res.statusCode).toBe(400);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });

  it.each([[{ challengeCode: 'code' }], [{ password: 'pw' }]])(
    'answers 400 and sends nothing for %j',
    async (fields) => {
      const res = fakeRes();
      updatePasswordFromChallengeCode({ body: { userName: 'jane', ...fields } }, res);
      await res.done();
      expect(res.statusCode).toBe(400);
      expect(authenticatedRequest).not.toHaveBeenCalled();
    }
  );

  it('trims a stray space from the user name', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 201, body: registryUser });
    const res = fakeRes();
    updatePasswordFromChallengeCode(
      { body: { userName: 'jane\t', challengeCode: 'code', password: 'pw' } },
      res
    );
    await res.done();
    expect(authenticatedRequest.mock.calls[0][0].userName).toBe('jane');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ user: { userName: 'jane' } });
  });
});

describe('reset-password', () => {
  it('trims a stray space from an autofilled email', async () => {
    authenticatedRequest.mockResolvedValue({ statusCode: 204, body: '' });
    const res = fakeRes();
    await resetPassword({ body: { userNameOrEmail: 'jane@example.org ' } }, res);
    expect(authenticatedRequest.mock.calls[0][0].userName).toBe('jane@example.org');
    expect(res.body).toEqual({ message: 'MAIL_CONFIRMATION' });
  });

  // The answer is the same as for a real account, so it says nothing about which accounts exist.
  it.each(['test.app', 'łukasz', { $ne: 1 }])(
    'sends nothing for %j and answers as usual',
    async (userNameOrEmail) => {
      const res = fakeRes();
      await resetPassword({ body: { userNameOrEmail } }, res);
      expect(authenticatedRequest).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'MAIL_CONFIRMATION' });
    }
  );

  it.each([undefined, '', '   '])('answers 400 when %j is given', async (userNameOrEmail) => {
    const res = fakeRes();
    await resetPassword({ body: { userNameOrEmail } }, res);
    expect(res.statusCode).toBe(400);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});
