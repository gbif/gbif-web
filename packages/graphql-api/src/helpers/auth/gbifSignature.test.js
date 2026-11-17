/* eslint-env mocha */
import assert from 'assert';
import { assertPathIsNotRewritten, canonicalQuery, canonicalUrl, gbifAuthHeaders } from './gbifSignature';

// Test vectors from gbif-common-ws GbifAuthServiceTest. A copy of these tests lives in
// packages/gbif-org/gbif/routes/auth/gbifSignature.test.mjs.
describe('canonicalQuery', () => {
  [
    [undefined, ''],
    ['', ''],
    ['b=2&a=1&flag&a=0', 'a=0&a=1&b=2&flag='],
    ['q=a+b', 'q=a%20b'],
    ['q=a%20b', 'q=a%20b'],
    ['q=%26%7E*', 'q=%26~%2A'],
    ['&', ''],
    ["q=!'()", 'q=%21%27%28%29'],
    ['q=%C3%B8', 'q=%C3%B8'],
  ].forEach(([raw, expected]) => {
    it(`canonicalizes ${JSON.stringify(raw)}`, () => {
      assert.strictEqual(canonicalQuery(raw), expected);
    });
  });
});

describe('canonicalUrl', () => {
  it('is the path alone without a query string', () => {
    assert.strictEqual(canonicalUrl('https://api.gbif.org/v1/dataset'), '/v1/dataset');
    assert.strictEqual(canonicalUrl('https://api.gbif.org/v1/dataset?'), '/v1/dataset');
  });

  it('decodes the path as the server does', () => {
    assert.strictEqual(canonicalUrl('https://api.gbif.org/v1/admin/user/jane%2Bx'), '/v1/admin/user/jane+x');
    assert.strictEqual(canonicalUrl('https://api.gbif.org/v1/admin/user/j%C3%B8rgen'), '/v1/admin/user/jørgen');
  });

  it('adds the canonical query string', () => {
    assert.strictEqual(
      canonicalUrl('https://api.gbif.org/v1/dataset?validate=true&tag=b*&tag=a+b'),
      '/v1/dataset?tag=a%20b&tag=b%2A&validate=true',
    );
  });
});

describe('assertPathIsNotRewritten', () => {
  [
    'https://api.gbif.org/v1/admin/user/jane',
    'https://api.gbif.org/v1/admin/user/jane.doe..x',
    'https://api.gbif.org/v1/derivedDataset/10.15468/dd.abc',
    'https://api.gbif.org/v1/admin/user/find?q=../x&r=a\\b',
    'http://localhost:8080/user/j%C3%B8rgen',
  ].forEach((url) => {
    it(`allows ${JSON.stringify(url)}`, () => {
      assert.doesNotThrow(() => assertPathIsNotRewritten(url));
    });
  });

  [
    'https://api.gbif.org/v1/directory/person/../../admin/user/jane',
    'https://api.gbif.org/v1/directory/person/./1',
    'https://api.gbif.org/v1/directory/person/%2e%2e/%2E%2E/admin/user/jane',
    'https://api.gbif.org/v1/directory/person/.%2e/admin',
    'https://api.gbif.org/v1/directory/person/..\\..\\admin\\user\\jane',
    'https://api.gbif.org/v1/directory/person/.\t./.\n./admin',
    'https://api.gbif.org/v1/directory/person/.. ',
    'https://api.gbif.org/v1/directory/person/..',
  ].forEach((url) => {
    it(`rejects ${JSON.stringify(url)}`, () => {
      assert.throws(() => assertPathIsNotRewritten(url), /Refusing to sign/);
    });
  });

  it('every rejected URL would otherwise have been signed for another path', () => {
    const url = 'https://api.gbif.org/v1/directory/person/%2e%2e/%2E%2E/admin/user/jane';
    assert.strictEqual(canonicalUrl(url), '/v1/admin/user/jane');
  });
});

describe('gbifAuthHeaders', () => {
  const date = new Date('2026-11-11T15:04:05Z');

  it('signs the gbif-common-ws README example', () => {
    assert.deepStrictEqual(
      gbifAuthHeaders({
        method: 'POST',
        url: 'https://api.gbif.org/v1/dataset?validate=true&tag=b*&tag=a+b',
        user: 'exampleuser',
        body: '{"title":"Example dataset"}',
        contentType: 'application/json',
        appKey: 'example.app',
        appSecret: 'example-secret',
        date,
      }),
      {
        'x-url': 'https://api.gbif.org/v1/dataset',
        'x-gbif-user': 'exampleuser',
        'x-gbif-date': 'Wed, 11 Nov 2026 15:04:05 GMT',
        'Content-MD5': 'BW6JIbyk1iXd2gEjg2Lo9Q==',
        Authorization: 'GBIF example.app:dxGpb0dP4c87l4xhXGLRZFB3Rs+MZXYKAsPYWAkJyAE=',
      },
    );
  });

  it('dates the request now by default', () => {
    const headers = gbifAuthHeaders({
      method: 'GET',
      url: 'https://api.gbif.org/v1/dataset',
      user: 'exampleuser',
      appKey: 'example.app',
      appSecret: 'example-secret',
    });
    assert.ok(Math.abs(Date.parse(headers['x-gbif-date']) - Date.now()) < 5000);
  });

  it('sends no Content-MD5 without a body', () => {
    const headers = gbifAuthHeaders({
      method: 'GET',
      url: 'https://api.gbif.org/v1/dataset?q=x',
      user: 'exampleuser',
      appKey: 'example.app',
      appSecret: 'example-secret',
      date,
    });
    assert.strictEqual(headers['Content-MD5'], undefined);
    assert.strictEqual(headers['x-url'], 'https://api.gbif.org/v1/dataset');
  });

  it('refuses to sign a URL whose path the parser would rewrite', () => {
    assert.throws(
      () =>
        gbifAuthHeaders({
          method: 'GET',
          url: 'https://api.gbif.org/v1/directory/person/../../admin/user/jane',
          user: 'exampleuser',
          appKey: 'example.app',
          appSecret: 'example-secret',
          date,
        }),
      /Refusing to sign/,
    );
  });
});
