/* eslint-env mocha */
import assert from 'assert';
import http from 'http';
import { GraphQLError } from 'graphql';
import DirectoryPersonAPI from './directoryPerson.source';
import { sanitizeUpstreamError } from './upstreamError';

describe('sanitizeUpstreamError', () => {
  const upstream = (status) =>
    Object.assign(new Error('upstream'), {
      extensions: { response: { url: 'http://internal/v1/directory/person/7', status, body: { secret: 'x' } } },
    });

  it('maps an upstream 404 to not found', () => {
    const err = sanitizeUpstreamError(upstream(404));
    assert.strictEqual(err.extensions.code, 'NOT_FOUND');
    assert.strictEqual(JSON.stringify(err.toJSON()).includes('internal'), false);
  });

  it('hides url and body of other upstream failures but keeps the cause for logging', () => {
    const cause = upstream(500);
    const err = sanitizeUpstreamError(cause);
    assert.strictEqual(err.extensions.code, 'UPSTREAM_ERROR');
    assert.strictEqual(err.originalError, cause);
    const json = JSON.stringify(err.toJSON());
    assert.strictEqual(json.includes('internal'), false);
    assert.strictEqual(json.includes('secret'), false);
  });

  it('leaves our own GraphQL errors alone', () => {
    const own = new GraphQLError('nope', { extensions: { code: 'BAD_USER_INPUT' } });
    assert.strictEqual(sanitizeUpstreamError(own), own);
  });
});

describe('DirectoryPersonAPI errors', function () {
  this.timeout(20000);
  async function withServer(status, run) {
    const server = http.createServer((req, res) => {
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'SECRET_UPSTREAM_BODY', trace: 'internal' }));
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const api = new DirectoryPersonAPI({
      apiv1: `http://127.0.0.1:${server.address().port}/v1`,
      appKey: 'k',
      appSecret: 's',
    });
    api.initialize({ context: { userAgent: 'x' } });
    try {
      await run(api);
    } finally {
      server.close();
    }
  }

  for (const status of [404, 500]) {
    it(`does not echo the upstream ${status} response to the client`, async () => {
      await withServer(status, async (api) => {
        await assert.rejects(api.getVolunteerByKey({ key: 700 }), (err) => {
          const json = JSON.stringify(err.toJSON());
          assert.strictEqual(json.includes('SECRET_UPSTREAM_BODY'), false);
          assert.strictEqual(json.includes('127.0.0.1'), false);
          return true;
        });
      });
    });
  }
});
