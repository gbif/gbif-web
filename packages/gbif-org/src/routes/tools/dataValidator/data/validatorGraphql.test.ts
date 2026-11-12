import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchEml, fetchValidation, upstreamStatus } from './validatorGraphql';

const KEY = '4f0c7a40-1b2c-4d3e-8f90-0a1b2c3d4e5f';
const graphqlEndpoint = 'https://graphql.test/graphql';

describe('upstreamStatus', () => {
  it('reads the status the validator answered', () => {
    expect(upstreamStatus([{ extensions: { response: { status: 403 } } }])).toBe(403);
  });

  it('maps GraphQL error codes to a status', () => {
    expect(upstreamStatus([{ extensions: { code: 'NOT_FOUND' } }])).toBe(404);
    expect(upstreamStatus([{ extensions: { code: 'UNAUTHENTICATED' } }])).toBe(401);
  });

  it('is undefined for errors without a status', () => {
    expect(upstreamStatus([{ extensions: { code: 'INTERNAL_SERVER_ERROR' } }])).toBeUndefined();
    expect(upstreamStatus(undefined)).toBeUndefined();
  });
});

describe('GraphQL calls', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const json = (body: unknown) =>
    new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });

  it('queries a validation with the bearer token and no cache', async () => {
    fetchMock.mockResolvedValue(json({ data: { validation: { key: KEY, status: 'RUNNING' } } }));
    await expect(fetchValidation({ graphqlEndpoint, token: 't', key: KEY })).resolves.toEqual({
      key: KEY,
      status: 'RUNNING',
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url.startsWith(`${graphqlEndpoint}?`)).toBe(true);
    expect(new URL(url).searchParams.get('variables')).toBe(JSON.stringify({ key: KEY }));
    expect(init.headers.authorization).toBe('Bearer t');
    expect(init.cache).toBe('no-cache');
  });

  it('throws the status the validator answered', async () => {
    fetchMock.mockResolvedValue(
      json({
        data: { validation: null },
        errors: [{ message: '403: Forbidden', extensions: { response: { status: 403 } } }],
      })
    );
    await expect(fetchValidation({ graphqlEndpoint, token: 't', key: KEY })).rejects.toMatchObject({
      status: 403,
    });
  });

  it('throws a plain error when no status is known', async () => {
    fetchMock.mockResolvedValue(json({ data: null, errors: [{ message: 'boom' }] }));
    await expect(fetchValidation({ graphqlEndpoint, token: 't', key: KEY })).rejects.toThrow(
      'boom'
    );
  });

  it('keeps a result that has field errors', async () => {
    fetchMock.mockResolvedValue(
      json({ data: { validation: { key: KEY } }, errors: [{ message: 'x', path: ['validation'] }] })
    );
    await expect(fetchValidation({ graphqlEndpoint, token: 't', key: KEY })).resolves.toEqual({
      key: KEY,
    });
  });

  it('never requests an invalid key', async () => {
    await expect(
      fetchValidation({ graphqlEndpoint, token: 't', key: '../user' })
    ).rejects.toMatchObject({ status: 404 });
    await expect(fetchEml({ graphqlEndpoint, token: 't', key: 'x' })).rejects.toMatchObject({
      status: 404,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns the EML of a validation', async () => {
    fetchMock.mockResolvedValue(json({ data: { validation: { key: KEY, eml: { title: 'x' } } } }));
    await expect(fetchEml({ graphqlEndpoint, token: 't', key: KEY })).resolves.toEqual({
      title: 'x',
    });
  });

  it('throws the status of a failed EML request', async () => {
    fetchMock.mockResolvedValue(
      json({
        data: { validation: { key: KEY, eml: null } },
        errors: [
          {
            message: '500',
            path: ['validation', 'eml'],
            extensions: { response: { status: 500 } },
          },
        ],
      })
    );
    await expect(fetchEml({ graphqlEndpoint, token: 't', key: KEY })).rejects.toMatchObject({
      status: 500,
    });
  });
});
