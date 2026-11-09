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

const { authenticatedRequest } = await import('../auth/gbifAuthRequest.mjs');
const { cancelDownload, deleteDownload, postponeDownloadDeletion, updateDerivedDataset } =
  await import('./controllers.mjs');

function fakeRes() {
  const res = { statusCode: undefined, body: undefined };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.sendStatus = (code) => {
    res.statusCode = code;
    return res;
  };
  res.send = (body) => {
    res.body = body;
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

const user = { userName: 'jane' };

beforeEach(() => {
  authenticatedRequest.mockReset();
});

describe.each([
  ['cancelDownload', cancelDownload],
  ['deleteDownload', deleteDownload],
  ['postponeDownloadDeletion', postponeDownloadDeletion],
])('%s controller', (_name, controller) => {
  it.each(['..%2F..%2Fx', '../../x', '12345', '0012345-240626123714530/..'])(
    'answers 400 and sends nothing upstream for key %j',
    async (key) => {
      const res = fakeRes();
      controller({ user, params: { key }, query: {} }, res);
      await res.done();
      expect(res.statusCode).toBe(400);
      expect(authenticatedRequest).not.toHaveBeenCalled();
    }
  );

  it('answers 400 for an unknown type', async () => {
    const res = fakeRes();
    controller({ user, params: { key: '0012345-240626123714530' }, query: { type: 'x' } }, res);
    await res.done();
    expect(res.statusCode).toBe(400);
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});

describe('updateDerivedDataset controller', () => {
  it('answers 400 with a short message and sends nothing upstream for a traversing DOI', async () => {
    const res = fakeRes();
    await updateDerivedDataset({ user, params: { doi: '10.1234/..' }, body: {} }, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'doi is not valid', code: 400 });
    expect(authenticatedRequest).not.toHaveBeenCalled();
  });
});
