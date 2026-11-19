/* eslint-env mocha */
import assert from 'assert';
import { createHmac } from 'crypto';
import config from '@/config';
import { createSignedGetHeader } from './authenticatedGet';
import { isValidUserHeader, signingUser } from './userHeader';
import { authenticatedRequest, createSignedHeaders } from '@/api-utils/forms/helpers/gbifAuthRequest';
import * as requestModule from '@/api-utils/forms/helpers/request';

// A fixed identity so the expected headers below don't depend on the local .env.
const testApp = { appKey: 'test.app', appSecret: 'test-secret' };

/**
 * Checks the headers sign exactly the given lines, followed by the x-gbif-date they carry, with the
 * test app's secret. The lines are written out by hand, so this is an independent check of what the
 * server (gbif-common-ws GbifAuthServiceImpl) will verify.
 */
function assertSigned(headers: Record<string, string>, lines: string[]) {
  assert.ok(!Number.isNaN(Date.parse(headers['x-gbif-date'])), 'x-gbif-date is a date');
  const stringToSign = [...lines, headers['x-gbif-date']].join('\n');
  const signature = createHmac('sha256', testApp.appSecret).update(stringToSign).digest('base64');
  assert.strictEqual(headers.Authorization, `GBIF test.app:${signature}`);
}

const badUserNames: unknown[] = [
  undefined,
  null,
  '',
  '  ',
  42,
  {},
  ['jane'],
  'a\nb',
  'a\u0000b',
  'a\u007fb',
  'a\u0085b', // C1 control (NEL)
  'łukasz', // above U+00FF: fetch can't put it in a header
  'a\u2028b',
  ' jane', // fetch trims the header, but the untrimmed value would be signed
  'jane ',
  'jane\t',
  'x'.repeat(256),
  // the app's own key would make the request run as the app without asApp
  'test.app',
  'TEST.APP',
];

describe('signingUser', () => {
  it('returns the user name when one is given', () => {
    assert.strictEqual(signingUser({ userName: 'jane' }, 'app'), 'jane');
  });

  it('returns the app key only when asApp is set', () => {
    assert.strictEqual(signingUser({ asApp: true }, 'app'), 'app');
  });

  ['jane+gbif@example.org', 'jørgen', '...abc...', 'Jane Doe', 'x'.repeat(255)].forEach((userName) => {
    it(`accepts the real-world user name ${JSON.stringify(userName)}`, () => {
      assert.strictEqual(signingUser({ userName }, 'test.app'), userName);
    });
  });

  badUserNames.forEach((userName) => {
    it(`never signs for user ${JSON.stringify(userName)}`, () => {
      assert.throws(() => signingUser({ userName }, 'test.app'), /valid userName, or asApp/);
      assert.strictEqual(isValidUserHeader(userName, 'test.app'), false);
    });
  });

  it('throws when no identity is given at all', () => {
    assert.throws(() => signingUser(undefined as any, 'app'), /valid userName, or asApp/);
    assert.throws(() => signingUser({}, 'app'), /valid userName, or asApp/);
  });

  it('refuses userName and asApp together', () => {
    assert.throws(() => signingUser({ userName: 'jane', asApp: true }, 'app'), /not both/);
  });

  it('does not treat a truthy asApp that is not true as app identity', () => {
    assert.throws(() => signingUser({ asApp: 'yes' } as any, 'app'), /valid userName, or asApp/);
  });
});

describe('createSignedGetHeader', () => {
  it('signs as the app when asked to', () => {
    const headers = createSignedGetHeader('https://api.test/v1/directory/participant?limit=1000', testApp, {
      asApp: true,
    });
    assert.strictEqual(headers['x-url'], 'https://api.test/v1/directory/participant');
    assert.strictEqual(headers['x-gbif-user'], 'test.app');
    assert.strictEqual(headers['Content-MD5'], undefined);
    assertSigned(headers, ['GET', '/v1/directory/participant?limit=1000', 'test.app']);
  });

  it('signs as the given user', () => {
    const headers = createSignedGetHeader('https://api.test/v1/occurrence/download/user/jane', testApp, {
      userName: 'jane',
    });
    assert.strictEqual(headers['x-gbif-user'], 'jane');
    assertSigned(headers, ['GET', '/v1/occurrence/download/user/jane', 'jane']);
  });

  it('signs the canonical query string', () => {
    const headers = createSignedGetHeader('https://api.test/v1/validation?offset=20&limit=10&q=a+b', testApp, {
      userName: 'jane',
    });
    assertSigned(headers, ['GET', '/v1/validation?limit=10&offset=20&q=a%20b', 'jane']);
  });

  it('accepts the URL as a URL object', () => {
    const url = new URL('https://api.test/v1/directory/participant');
    url.searchParams.append('q', 'x y');
    const headers = createSignedGetHeader(url, testApp, { asApp: true });
    assertSigned(headers, ['GET', '/v1/directory/participant?q=x%20y', 'test.app']);
  });

  it('throws instead of signing as the app when no identity is given', () => {
    assert.throws(() => (createSignedGetHeader as any)('https://api.test/v1/x', testApp), /valid userName, or asApp/);
  });

  it('throws instead of signing as the app for a logged-in user without a user name', () => {
    assert.throws(
      () => createSignedGetHeader('https://api.test/v1/x', testApp, { userName: undefined as any }),
      /valid userName/,
    );
  });

  it('throws for a user name that is the app key', () => {
    assert.throws(
      () => createSignedGetHeader('https://api.test/v1/x', testApp, { userName: 'test.app' }),
      /valid userName/,
    );
  });
});

describe('authenticatedRequest', () => {
  // authenticatedRequest reads the shared config, so swap in the fixed identity for these tests.
  // The HTTP call is swapped for one that records what it was given, so nothing goes out and the
  // tests can see exactly what would have been sent.
  const saved = { appKey: config.appKey, appSecret: config.appSecret };
  const http = requestModule as any;
  const realRequest = http.default;
  let sent: any[] = [];
  beforeEach(() => {
    Object.assign(config, testApp);
    sent = [];
    http.default = async (options: any) => {
      sent.push(options);
      return { statusCode: 200, body: {} };
    };
  });
  afterEach(() => {
    Object.assign(config, saved);
    http.default = realRequest;
  });

  it('sends the signed headers as the app (create publisher)', async () => {
    await authenticatedRequest({
      method: 'POST',
      body: { title: 'Example org' },
      url: 'https://api.test/v1/organization/',
      asApp: true,
    });
    assert.strictEqual(sent.length, 1);
    assert.strictEqual(sent[0].method, 'POST');
    assert.strictEqual(sent[0].url, 'https://api.test/v1/organization/');
    assert.deepStrictEqual(sent[0].json, { title: 'Example org' });
    const { headers } = sent[0];
    assert.deepStrictEqual(Object.keys(headers).sort(), [
      'Authorization',
      'Content-MD5',
      'x-gbif-date',
      'x-gbif-user',
      'x-url',
    ]);
    assert.strictEqual(headers['x-url'], 'https://api.test/v1/organization/');
    assert.strictEqual(headers['x-gbif-user'], 'test.app');
    // the MD5 of the body as sent: JSON.stringify({ title: 'Example org' })
    assert.strictEqual(headers['Content-MD5'], 'IFHJqYosdPsc5UO/Weg4lQ==');
    assertSigned(headers, ['POST', '/v1/organization/', 'application/json', 'IFHJqYosdPsc5UO/Weg4lQ==', 'test.app']);
  });

  it('sends the signed headers as the app (organization lookup)', async () => {
    await authenticatedRequest({
      method: 'GET',
      url: 'https://api.test/v1/organization/abc',
      asApp: true,
    });
    assert.strictEqual(sent.length, 1);
    assert.strictEqual(sent[0].method, 'GET');
    assert.strictEqual(sent[0].url, 'https://api.test/v1/organization/abc');
    assert.strictEqual(sent[0].json, true);
    assert.strictEqual(sent[0].headers['Content-MD5'], undefined);
    assertSigned(sent[0].headers, ['GET', '/v1/organization/abc', 'test.app']);
  });

  it('sends the signed headers as the given user', async () => {
    await authenticatedRequest({
      method: 'GET',
      url: 'https://api.test/v1/organization/abc',
      userName: 'jane',
    });
    assert.strictEqual(sent[0].headers['x-gbif-user'], 'jane');
  });

  it('signs the endorsement confirmation', () => {
    const headers = createSignedHeaders({
      method: 'POST',
      body: { confirmationKey: 'code' },
      url: 'https://api.test/v1/organization/abc/endorsement',
      asApp: true,
    });
    assert.strictEqual(headers['x-url'], 'https://api.test/v1/organization/abc/endorsement');
    assert.strictEqual(headers['Content-MD5'], '8m07wcgWE0JahkyxoplB7Q==');
    assertSigned(headers, [
      'POST',
      '/v1/organization/abc/endorsement',
      'application/json',
      '8m07wcgWE0JahkyxoplB7Q==',
      'test.app',
    ]);
  });

  it('signs the query string of the request URL', () => {
    const headers = createSignedHeaders({
      method: 'DELETE',
      url: 'https://api.test/v1/organization/abc?b=2&a=1',
      userName: 'jane',
    });
    assert.strictEqual(headers['x-url'], 'https://api.test/v1/organization/abc');
    assertSigned(headers, ['DELETE', '/v1/organization/abc?a=1&b=2', 'jane']);
  });

  it('signs as the given user', () => {
    const headers = createSignedHeaders({
      method: 'GET',
      url: 'https://api.test/v1/organization/abc',
      userName: 'jane',
    });
    assert.strictEqual(headers['x-gbif-user'], 'jane');
  });

  badUserNames.forEach((userName) => {
    it(`refuses user ${JSON.stringify(userName)} without asApp`, async () => {
      await assert.rejects(
        authenticatedRequest({ method: 'GET', url: 'https://api.test/v1/x', userName }),
        /valid userName, or asApp/,
      );
      assert.strictEqual(sent.length, 0);
    });
  });

  it('refuses a request with no identity', async () => {
    await assert.rejects(
      authenticatedRequest({ method: 'GET', url: 'https://api.test/v1/x' }),
      /valid userName, or asApp/,
    );
    assert.strictEqual(sent.length, 0);
  });

  it('refuses userName and asApp together', async () => {
    await assert.rejects(
      authenticatedRequest({
        method: 'GET',
        url: 'https://api.test/v1/x',
        userName: 'jane',
        asApp: true,
      }),
      /not both/,
    );
    assert.strictEqual(sent.length, 0);
  });
});
