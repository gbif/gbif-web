/* eslint-env mocha */
import assert from 'assert';
import OccurrenceAPI from './occurrence.source';

const config = {
  apiEs: 'https://es-api.example.org/v1',
  apiv1: 'https://api.example.org/v1',
  apiv2: 'https://api.example.org/v2',
  apiEsKey: 'secret',
};

// The headers willSendRequest sets for a given path.
function headersFor(path) {
  const source = new OccurrenceAPI(config);
  source.context = {
    userAgent: 'agent',
    referer: 'https://www.gbif.org/',
    requestId: 'request-1',
    clientIp: '192.0.2.1',
  };
  const request = { headers: {} };
  source.willSendRequest(path, request);
  return request.headers;
}

describe('occurrence request headers', () => {
  it('sends the API key and client details to the occurrence API', () => {
    const headers = headersFor('/occurrence/key/1');
    assert.strictEqual(headers.Authorization, 'ApiKey-v1 secret');
    assert.strictEqual(headers['x-client-ip'], '192.0.2.1');
    assert.strictEqual(headers['x-request-id'], 'request-1');
  });

  [
    'https://api.example.org/v1/occurrence/1/verbatim',
    'https://api.example.org/v2/map/occurrence/adhoc/predicate/',
  ].forEach((url) => {
    it(`sends the API key and client details to ${url}`, () => {
      const headers = headersFor(url);
      assert.strictEqual(headers.Authorization, 'ApiKey-v1 secret');
      assert.strictEqual(headers['x-client-ip'], '192.0.2.1');
    });
  });

  [
    'https://bionomia.net/occurrences/search',
    'https://es-api.example.org/v1x/occurrence',
    'https://api.example.org/v3/x',
    'https://es-api.example.org.evil.example/v1/occurrence',
  ].forEach((url) => {
    it(`sends nothing of ours to ${url}`, () => {
      assert.deepStrictEqual(headersFor(url), {});
    });
  });
});
