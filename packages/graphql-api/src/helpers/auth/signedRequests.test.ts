/* eslint-env mocha */
import assert from 'assert';
import config from '@/config';
import { createSignedGetHeader } from './authenticatedGet';
import { isValidUserHeader, signingUser } from './userHeader';
import { authenticatedRequest, createSignedHeaders } from '@/api-utils/forms/helpers/gbifAuthRequest';

// A fixed identity so the expected headers below don't depend on the local .env.
const testApp = { appKey: 'test.app', appSecret: 'test-secret' };

// Headers produced by the code before identity was made explicit (commit 2951017), run with
// testApp and the same inputs. Every caller that relied on the fallback must still send these,
// byte for byte.
const before = {
  createPublisher: {
    'x-url': 'organization/',
    'x-gbif-user': 'test.app',
    'Content-MD5': 'IFHJqYosdPsc5UO/Weg4lQ==',
    Authorization: 'GBIF test.app:BCll28p71aIOV3fCF86dd8qjSig=',
  },
  getOrganization: {
    'x-url': 'https://api.test/v1/organization/abc',
    'x-gbif-user': 'test.app',
    Authorization: 'GBIF test.app:drvZfjMPCaCk9fUKm7ftdURCgHg=',
  },
  confirmEndorsement: {
    'x-url': 'organization/abc/endorsement',
    'x-gbif-user': 'test.app',
    'Content-MD5': '8m07wcgWE0JahkyxoplB7Q==',
    Authorization: 'GBIF test.app:KYYzJw/4Qqe67hnqkYP+4wXinUE=',
  },
  getAsApp: {
    'x-url': '/directory/participant',
    'x-gbif-user': 'test.app',
    Authorization: 'GBIF test.app:I3sgNP3bUDJLSxgd7ldCqjfnnHM=',
  },
  getAsUser: {
    'x-url': '/occurrence/download/user/jane',
    'x-gbif-user': 'jane',
    Authorization: 'GBIF test.app:Iiu1vBucDvLqzOulWONnGxPzPnY=',
  },
};

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
  it('signs as the app exactly as before when asked to', () => {
    assert.deepStrictEqual(createSignedGetHeader('/directory/participant', testApp, { asApp: true }), before.getAsApp);
  });

  it('signs as the given user exactly as before', () => {
    assert.deepStrictEqual(
      createSignedGetHeader('/occurrence/download/user/jane', testApp, { userName: 'jane' }),
      before.getAsUser,
    );
  });

  it('throws instead of signing as the app when no identity is given', () => {
    assert.throws(() => (createSignedGetHeader as any)('/x', testApp), /valid userName, or asApp/);
  });

  it('throws instead of signing as the app for a logged-in user without a user name', () => {
    assert.throws(() => createSignedGetHeader('/x', testApp, { userName: undefined as any }), /valid userName/);
  });

  it('throws for a user name that is the app key', () => {
    assert.throws(() => createSignedGetHeader('/x', testApp, { userName: 'test.app' }), /valid userName/);
  });
});

describe('authenticatedRequest', () => {
  // authenticatedRequest reads the shared config, so swap in the fixed identity for these tests.
  const saved = { appKey: config.appKey, appSecret: config.appSecret };
  beforeEach(() => Object.assign(config, testApp));
  afterEach(() => Object.assign(config, saved));

  it('signs create publisher exactly as before', () => {
    assert.deepStrictEqual(
      createSignedHeaders({
        method: 'POST',
        body: { title: 'Example org' },
        url: 'https://api.test/v1/organization/',
        canonicalPath: 'organization/',
        asApp: true,
      }),
      before.createPublisher,
    );
  });

  it('signs the organization lookup in confirm endorsement exactly as before', () => {
    assert.deepStrictEqual(
      createSignedHeaders({
        method: 'GET',
        url: 'https://api.test/v1/organization/abc',
        asApp: true,
      }),
      before.getOrganization,
    );
  });

  it('signs the endorsement confirmation exactly as before', () => {
    assert.deepStrictEqual(
      createSignedHeaders({
        method: 'POST',
        body: { confirmationKey: 'code' },
        url: 'https://api.test/v1/organization/abc/endorsement',
        canonicalPath: 'organization/abc/endorsement',
        asApp: true,
      }),
      before.confirmEndorsement,
    );
  });

  it('signs as the given user', () => {
    const headers = createSignedHeaders({
      method: 'GET',
      url: 'https://api.test/v1/organization/abc',
      userName: 'jane',
    });
    assert.strictEqual(headers['x-gbif-user'], 'jane');
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
      authenticatedRequest({
        method: 'GET',
        url: 'https://api.test/v1/x',
        userName: 'jane',
        asApp: true,
      }),
      /not both/,
    );
  });
});
