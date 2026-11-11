/* eslint-env mocha */
import assert from 'assert';
import { createHmac, createHash } from 'node:crypto';
import config from '@/config';
import { createSignedGetHeader } from './authenticatedGet';
import { isValidUserHeader, signingUser } from './userHeader';
import { authenticatedRequest, createSignedHeaders } from '@/api-utils/forms/helpers/gbifAuthRequest';

// The signature as the registry computes it (GbifAuthService), written out independently so the
// tests show that requests are signed exactly as before for every caller.
function expectedAuthorization(stringToSign: string) {
  const signature = createHmac('sha1', config.appSecret).update(stringToSign).digest('base64');
  return `GBIF ${config.appKey}:${signature}`;
}

const badUserNames: unknown[] = [undefined, null, '', '  ', 42, {}, ['jane'], 'a\nb', 'a\u0000b', 'x'.repeat(256)];

describe('signingUser', () => {
  it('returns the user name when one is given', () => {
    assert.strictEqual(signingUser({ userName: 'jane' }, 'app'), 'jane');
  });

  it('returns the app key only when asApp is set', () => {
    assert.strictEqual(signingUser({ asApp: true }, 'app'), 'app');
  });

  it('accepts old user names that are email addresses', () => {
    assert.strictEqual(signingUser({ userName: 'jane+gbif@example.org' }, 'app'), 'jane+gbif@example.org');
  });

  badUserNames.forEach((userName) => {
    it(`never falls back to the app for user ${JSON.stringify(userName)}`, () => {
      assert.throws(() => signingUser({ userName }, 'app'), /valid userName, or asApp/);
      assert.strictEqual(isValidUserHeader(userName), false);
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
  it('signs as the app, the same as before, when asked to', () => {
    const headers = createSignedGetHeader('/directory/participant', config, { asApp: true });
    assert.strictEqual(headers['x-gbif-user'], config.appKey);
    assert.strictEqual(headers.Authorization, expectedAuthorization(`GET\n/directory/participant\n${config.appKey}`));
  });

  it('signs as the given user, the same as before', () => {
    const headers = createSignedGetHeader('/occurrence/download/user/jane', config, { userName: 'jane' });
    assert.strictEqual(headers['x-gbif-user'], 'jane');
    assert.strictEqual(headers.Authorization, expectedAuthorization('GET\n/occurrence/download/user/jane\njane'));
  });

  it('throws instead of signing as the app when no identity is given', () => {
    assert.throws(() => (createSignedGetHeader as any)('/x', config), /valid userName, or asApp/);
  });

  it('throws instead of signing as the app for a logged-in user without a user name', () => {
    assert.throws(() => createSignedGetHeader('/x', config, { userName: undefined as any }), /valid userName/);
  });
});

describe('authenticatedRequest', () => {
  it('signs a POST as the app, the same as before, when asked to (create publisher)', () => {
    const body = { title: 'Example org' };
    const headers = createSignedHeaders({
      method: 'POST',
      body,
      url: 'https://api.test/v1/organization/',
      canonicalPath: 'organization/',
      asApp: true,
    });
    const md5 = createHash('md5').update(JSON.stringify(body)).digest('base64');
    assert.strictEqual(headers['x-gbif-user'], config.appKey);
    assert.strictEqual(
      headers.Authorization,
      expectedAuthorization(`POST\norganization/\napplication/json\n${md5}\n${config.appKey}`),
    );
  });

  it('signs a GET as the app, the same as before, when asked to (confirm endorsement)', () => {
    const url = 'https://api.test/v1/organization/abc';
    const headers = createSignedHeaders({ method: 'GET', url, asApp: true });
    assert.strictEqual(headers['x-gbif-user'], config.appKey);
    assert.strictEqual(headers.Authorization, expectedAuthorization(`GET\n${url}\n${config.appKey}`));
  });

  it('signs as the given user', () => {
    const url = 'https://api.test/v1/organization/abc';
    const headers = createSignedHeaders({ method: 'GET', url, userName: 'jane' });
    assert.strictEqual(headers['x-gbif-user'], 'jane');
    assert.strictEqual(headers.Authorization, expectedAuthorization(`GET\n${url}\njane`));
  });

  // These reject before a request is made: the identity is checked first.
  badUserNames.forEach((userName) => {
    it(`refuses user ${JSON.stringify(userName)} without asApp`, async () => {
      await assert.rejects(
        authenticatedRequest({ method: 'GET', url: 'https://api.test/v1/x', userName }),
        /valid userName, or asApp/,
      );
    });
  });

  it('refuses a request with no identity', async () => {
    await assert.rejects(
      authenticatedRequest({ method: 'GET', url: 'https://api.test/v1/x' }),
      /valid userName, or asApp/,
    );
  });

  it('refuses userName and asApp together', async () => {
    await assert.rejects(
      authenticatedRequest({ method: 'GET', url: 'https://api.test/v1/x', userName: 'jane', asApp: true }),
      /not both/,
    );
  });
});
