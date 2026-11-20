import express from 'express';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  clientAddress,
  createLimiter,
  fingerprint,
  isBot,
  isNoise,
  parseReport,
  renderEarlyErrorScript,
} from './clientErrors.mjs';
import { register } from './endpoints.mjs';

const SHA = '6d946415e08d0ca967184e257e003da15adeaa05';
const CHROME = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36';

const valid = {
  source: 'boundary',
  name: 'TypeError',
  message: "Cannot read properties of undefined (reading 'split')",
  stack:
    "TypeError: Cannot read properties of undefined (reading 'split')\n" +
    '    at Ab (https://www.gbif.org/assets/app-shared-CNktY3zd.js:1:2345)\n' +
    '    at div',
  path: '/occurrence/search',
  commit: SHA,
};

describe('parseReport', () => {
  it('keeps the known fields', () => {
    expect(parseReport(valid)).toEqual({
      ...valid,
      componentStack: undefined,
      graphQLErrors: undefined,
    });
  });

  it('drops unknown fields and invalid commits', () => {
    const report = parseReport({
      ...valid,
      commit: 'not-a-commit',
      email: 'someone@example.org',
    });
    expect(report.commit).toBe(undefined);
    expect(report).not.toHaveProperty('email');
  });

  it('keeps filters and searches in the page URL, but not secrets', () => {
    const report = parseReport({
      ...valid,
      path: '/occurrence/search?q=puma&taxonKey=2435099&token=abc&accessToken=x#access_token=y',
    });
    expect(report.path).toBe(
      '/occurrence/search?q=puma&taxonKey=2435099&token=…&accessToken=…#access_token=…'
    );
  });

  it('blanks secrets in URLs in messages and stacks, absolute or relative', () => {
    const report = parseReport({
      ...valid,
      message: 'Failed https://www.gbif.org/api/x?q=name&apikey=abc and /en/login?code=1&state=2',
      stack: 'Error\n    at f (https://www.gbif.org/en/user?code=xyz:1:2)',
    });
    expect(report.message).toBe(
      'Failed https://www.gbif.org/api/x?q=name&apikey=… and /en/login?code=…&state=…'
    );
    expect(report.stack).toBe('Error\n    at f (https://www.gbif.org/en/user?code=…:1:2)');
  });

  it('finds secrets in nested, awkward and encoded URLs', () => {
    const message = (text) => parseReport({ ...valid, message: text }).message;
    expect(message('?redirect=https://b.org/?token=S&q=puma')).toBe(
      '?redirect=https://b.org/?token=…&q=puma'
    );
    expect(message("?q=o'brien&token=S")).toBe("?q=o'brien&token=…");
    expect(message('?token[]=a;sid=b')).toBe('?token[]=…;sid=…');
    expect(message('?userEmail=me@example.org&taxonKey=5')).toBe('?userEmail=…&taxonKey=5');
    expect(message('https://a.org/?next=%2Fx%3Ftoken%3DSECRET%26q%3Dpuma')).toBe(
      'https://a.org/?next=%2Fx%3Ftoken%3D…%26q%3Dpuma'
    );
    expect(message('<a href=?token=x>')).toBe('<a href=?token=…>');
  });

  it('blanks parameter names that contain a secret word, but keeps GBIF filters', () => {
    expect(
      parseReport({
        ...valid,
        message:
          '?emailAddress=a&password_confirmation=b&x-api-key=c&accessKey=d&otp=1&ticket=2&pass=3' +
          '&taxonKey=6&institutionCode=7&stateProvince=8&datasetKey=9',
      }).message
    ).toBe(
      '?emailAddress=…&password_confirmation=…&x-api-key=…&accessKey=…&otp=…&ticket=…&pass=…' +
        '&taxonKey=6&institutionCode=7&stateProvince=8&datasetKey=9'
    );
  });

  it('blanks whole values: indexed, encoded, double-encoded, with apostrophes', () => {
    const message = (text) => parseReport({ ...valid, message: text }).message;
    expect(message('?token[0]=a&token%5B%5D=b&q=1')).toBe('?token[0]=…&token%5B%5D=…&q=1');
    expect(message('?next=%2Fx%3Ftoken%3Dab%2Bcd%2Fef%3D%3D%26q%3Dpuma')).toBe(
      '?next=%2Fx%3Ftoken%3D…%26q%3Dpuma'
    );
    expect(message('?next=%252Fx%253Ftoken%253DSECRET%2526q%253Dpuma')).toBe(
      '?next=%252Fx%253Ftoken%253D…%2526q%253Dpuma'
    );
    expect(message("?email=o'brien@x.com&q=puma")).toBe('?email=…&q=puma');
    expect(message('?token=abc:1234&q=1')).toBe('?token=…&q=1');
  });

  it('blanks bearer tokens, JWTs and email addresses anywhere', () => {
    expect(
      parseReport({
        ...valid,
        message: 'Authorization: Bearer abc.def-ghi, eyJhbGciOi.eyJzdWIi.c2ln, from me@example.org',
      }).message
    ).toBe('Authorization: Bearer …, …, from …@…');
  });

  it('keeps Firefox and Safari stack frames, which contain an @', () => {
    const stack =
      'f@https://www.gbif.org/assets/a.js:1:2\nglobal code@https://www.gbif.org/x.js:3:4';
    expect(parseReport({ ...valid, stack }).stack).toBe(stack);
  });

  it('only accepts paths on this site', () => {
    expect(parseReport({ ...valid, path: '//evil.example/a' }).path).toBe(undefined);
    expect(parseReport({ ...valid, path: 'https://evil.example/a' }).path).toBe(undefined);
  });

  it('leaves other text alone', () => {
    const message = (text) => parseReport({ ...valid, message: text }).message;
    expect(message("Unexpected token '#'")).toBe("Unexpected token '#'");
    expect(message("'div#main > a' is not a valid selector")).toBe(
      "'div#main > a' is not a valid selector"
    );
    expect(message('state=open is not a secret outside a query string')).toBe(
      'state=open is not a secret outside a query string'
    );
  });

  it('is quick on large reports of junk', () => {
    const junk = `?${'a&'.repeat(5000)}${'a'.repeat(5000)}`;
    const start = performance.now();
    for (let i = 0; i < 20; i++) parseReport({ ...valid, message: junk, stack: junk });
    expect(performance.now() - start).toBeLessThan(200);
  });

  it('leaves a question mark in ordinary text alone', () => {
    expect(parseReport({ ...valid, message: 'Why did this fail? No idea' }).message).toBe(
      'Why did this fail? No idea'
    );
  });

  it('truncates long values', () => {
    const report = parseReport({ ...valid, message: 'x'.repeat(5000), stack: 'y'.repeat(9000) });
    expect(report.message.length).toBeLessThanOrEqual(1001);
    expect(report.stack.length).toBeLessThanOrEqual(4001);
  });

  it('keeps at most five short GraphQL error messages', () => {
    const report = parseReport({ ...valid, graphQLErrors: Array(9).fill('z'.repeat(500)) });
    expect(report.graphQLErrors).toHaveLength(5);
    expect(report.graphQLErrors[0].length).toBeLessThanOrEqual(201);
  });

  it('refuses anything that is not a report', () => {
    expect(parseReport(null)).toBe(null);
    expect(parseReport([valid])).toBe(null);
    expect(parseReport({ ...valid, message: '' })).toBe(null);
    expect(parseReport({ ...valid, message: { toString: 'x' } })).toBe(null);
    expect(parseReport({ ...valid, source: 'server' })).toBe(null);
  });
});

describe('fingerprint', () => {
  it('is the same across builds: chunk hash, minified name and position change', () => {
    const otherBuild = {
      ...valid,
      stack: valid.stack
        .replace('CNktY3zd', 'Zq81LmPx')
        .replace('at Ab (', 'at Xk (')
        .replace(':1:2345', ':1:9876'),
    };
    expect(fingerprint(otherBuild)).toBe(fingerprint(valid));
  });

  it('is the same for Firefox-style frames from another build', () => {
    const firefox = (fn, hash) => ({
      ...valid,
      stack: `${fn}@https://www.gbif.org/assets/app-shared-${hash}.js:1:2345\n`,
    });
    expect(fingerprint(firefox('Ab', 'CNktY3zd'))).toBe(fingerprint(firefox('Xk', 'Zq81LmPx')));
  });

  it('separates errors thrown in different files', () => {
    const inVendor = { ...valid, stack: valid.stack.replace('app-shared', 'vendor') };
    expect(fingerprint(inVendor)).not.toBe(fingerprint(valid));
  });

  it('keeps short numbers that say which error it is, and merges record keys', () => {
    const react = (code) => ({ ...valid, message: `Minified React error #${code}`, stack: '' });
    expect(fingerprint(react(418))).not.toBe(fingerprint(react(423)));
    const missing = (key) => ({ ...valid, message: `Occurrence ${key} not found`, stack: '' });
    expect(fingerprint(missing(1234567))).toBe(fingerprint(missing(7654321)));
  });

  it('groups chunk load failures for the same page', () => {
    const chunkError = (hash) => ({
      ...valid,
      name: 'TypeError',
      message: `Failed to fetch dynamically imported module: https://www.gbif.org/assets/NameParserPage-${hash}.js`,
      stack: undefined,
    });
    expect(fingerprint(chunkError('pOpWo36a'))).toBe(fingerprint(chunkError('Ab12Cd34')));
  });

  it('separates different errors', () => {
    expect(fingerprint({ ...valid, message: 'Something else' })).not.toBe(fingerprint(valid));
  });

  it('uses the first frame with a file, skipping built-in functions', () => {
    const thrownIn = (file) => ({
      ...valid,
      stack: `TypeError: x\n    at JSON.parse (<anonymous>)\n    at Ab (https://www.gbif.org/assets/${file}-CNktY3zd.js:1:2)`,
    });
    expect(fingerprint(thrownIn('a'))).not.toBe(fingerprint(thrownIn('b')));
  });

  it("reads Safari's global code frames", () => {
    const safari = (file) => ({
      ...valid,
      stack: `global code@https://www.gbif.org/${file}.js:1:2`,
    });
    expect(fingerprint(safari('a'))).not.toBe(fingerprint(safari('b')));
  });

  it('keeps real property names apart', () => {
    const reading = (name) => ({
      ...valid,
      message: `Cannot read properties of undefined (reading '${name}')`,
      stack: '',
    });
    expect(fingerprint(reading('id'))).not.toBe(fingerprint(reading('map')));
  });

  it('groups messages that name a minified variable, in every browser', () => {
    const same = (a, b) =>
      fingerprint({ ...valid, message: a, stack: '' }) ===
      fingerprint({ ...valid, message: b, stack: '' });
    expect(
      same(
        "can't access lexical declaration 'Ab' before initialization",
        "can't access lexical declaration 'Xk' before initialization"
      )
    ).toBe(true);
    expect(same("Can't find variable: Ab", "Can't find variable: Xk")).toBe(true);
    expect(same('(0 , Ab.default) is not a function', '(0 , Xk.default) is not a function')).toBe(
      true
    );
    expect(
      same(
        'can\'t access property "map", e is undefined',
        'can\'t access property "map", t.d is undefined'
      )
    ).toBe(true);
    expect(
      same(
        "undefined is not an object (evaluating 'e.data.map')",
        "undefined is not an object (evaluating 't.x.map')"
      )
    ).toBe(true);
  });

  it('keeps the property or real name that says which error it is', () => {
    const differ = (a, b) =>
      fingerprint({ ...valid, message: a, stack: '' }) !==
      fingerprint({ ...valid, message: b, stack: '' });
    expect(
      differ(
        'can\'t access property "map", e is undefined',
        'can\'t access property "id", e is undefined'
      )
    ).toBe(true);
    expect(
      differ(
        "undefined is not an object (evaluating 'e.map')",
        "undefined is not an object (evaluating 'e.id')"
      )
    ).toBe(true);
    expect(differ("Can't find variable: Ab", "Can't find variable: fetchData")).toBe(true);
  });

  it("groups Safari's message for a minified function across builds", () => {
    const safari = (name) => ({
      ...valid,
      message: `${name} is not a function. (In '${name}(t)', '${name}' is undefined)`,
      stack: '',
    });
    expect(fingerprint(safari('Ab'))).toBe(fingerprint(safari('Xk')));
  });

  it('ignores minified names in messages', () => {
    const message = (text) => ({ ...valid, message: text, stack: '' });
    expect(fingerprint(message('Ab is not a function'))).toBe(
      fingerprint(message('Xk is not a function'))
    );
    expect(fingerprint(message("Cannot access 'Ab' before initialization"))).toBe(
      fingerprint(message("Cannot access 'zQ' before initialization"))
    );
    expect(fingerprint(message('fetchData is not a function'))).not.toBe(
      fingerprint(message('Ab is not a function'))
    );
  });

  it('ignores an @ in the message line of a V8 stack', () => {
    const withAt = { ...valid, stack: `Error: user@example\n    at Ab (https://x/a.js:1:2)` };
    const without = { ...valid, stack: `Error: other\n    at Ab (https://x/a.js:1:2)` };
    expect(fingerprint(withAt)).toBe(fingerprint(without));
  });
});

describe('isBot', () => {
  it('treats crawlers, headless browsers and a missing user agent as bots', () => {
    expect(isBot('Googlebot/2.1 (+http://www.google.com/bot.html)')).toBe(true);
    expect(isBot('Mozilla/5.0 HeadlessChrome/130.0')).toBe(true);
    expect(isBot(undefined)).toBe(true);
    expect(isBot(CHROME)).toBe(false);
  });
});

describe('isNoise', () => {
  it('drops errors we cannot act on, also when the browser did not filter them', () => {
    expect(isNoise({ ...valid, message: 'ResizeObserver loop limit exceeded' })).toBe(true);
    expect(isNoise({ ...valid, message: 'Script error.', stack: undefined })).toBe(true);
    expect(isNoise({ ...valid, stack: 'at x (moz-extension://abc/x.js:1:1)' })).toBe(true);
    expect(isNoise(valid)).toBe(false);
  });
});

describe('renderEarlyErrorScript', () => {
  it('is a single nonced script of valid JavaScript', () => {
    const html = renderEarlyErrorScript('abc123');
    const match = html.match(/^<script nonce="abc123">(.*)<\/script>$/s);
    expect(match).not.toBe(null);
    expect(match[1]).not.toContain('\n');
    expect(() => new Function(match[1])).not.toThrow();
  });
});

describe('createLimiter', () => {
  it('caps reports overall and per fingerprint within a minute', () => {
    let time = 0;
    const limiter = createLimiter({ perMinute: 3, perFingerprintPerMinute: 2, now: () => time });
    expect(limiter.take('a', 'x').allowed).toBe(true);
    expect(limiter.take('a', 'y').allowed).toBe(true);
    expect(limiter.take('a', 'z').allowed).toBe(false);
    expect(limiter.take('b', 'x').allowed).toBe(true);
    expect(limiter.take('c', 'y').allowed).toBe(false);

    time = 60_000;
    expect(limiter.take('a', 'x')).toEqual({ allowed: true, droppedInLastWindow: 2 });
    expect(limiter.take('a', 'x')).toEqual({ allowed: true, droppedInLastWindow: 0 });
  });

  it('applies only the overall limits without a visitor', () => {
    const limiter = createLimiter({ perMinute: 100, perClientPerMinute: 1 });
    expect(limiter.take('a', undefined).allowed).toBe(true);
    expect(limiter.take('b', undefined).allowed).toBe(true);
  });

  it('stops one visitor from using up the budget', () => {
    const limiter = createLimiter({ perMinute: 100, perClientPerMinute: 3 });
    for (let i = 0; i < 3; i++) expect(limiter.take(`junk ${i}`, 'attacker').allowed).toBe(true);
    expect(limiter.take('junk 3', 'attacker').allowed).toBe(false);
    expect(limiter.take('real error', 'visitor').allowed).toBe(true);
  });
});

describe('clientAddress', () => {
  const request = (forwarded, remoteAddress = '10.0.0.2') => ({
    get: (name) => (name === 'X-Forwarded-For' ? forwarded : undefined),
    socket: { remoteAddress },
  });

  it('uses the address Varnish added last, not ones the visitor sent', () => {
    expect(clientAddress(request('6.6.6.6, 203.0.113.7'))).toBe('203.0.113.7');
    expect(clientAddress(request('203.0.113.7'))).toBe('203.0.113.7');
    expect(clientAddress(request('::ffff:203.0.113.7:51234'))).toBe('203.0.113.7');
  });

  it('gives no visitor when the last entry is a private address, e.g. a proxy in front', () => {
    expect(clientAddress(request('203.0.113.7, 10.1.2.3'))).toBe(undefined);
    expect(clientAddress(request('172.20.0.5'))).toBe(undefined);
    expect(clientAddress(request('fd12:3456::1'))).toBe(undefined);
  });

  it('counts an IPv6 visitor by their /64 network', () => {
    expect(clientAddress(request('2001:db8:85a3:12:1::7'))).toBe('2001:db8:85a3:12::/64');
    expect(clientAddress(request('2001:db8:85a3:12:ffff::9'))).toBe('2001:db8:85a3:12::/64');
    expect(clientAddress(request('2001:db8::1'))).toBe('2001:db8:0:0::/64');
  });

  it('falls back to the connection without the header', () => {
    expect(clientAddress(request(undefined, '198.51.100.4'))).toBe('198.51.100.4');
    expect(clientAddress(request(undefined, '127.0.0.1'))).toBe(undefined);
  });
});

describe('POST /api/client-error', () => {
  let server;
  let url;
  const logged = [];
  const logger = { warn: (message, meta) => logged.push({ message, meta }) };

  beforeAll(async () => {
    const app = express();
    register(app, { logger, limiter: createLimiter({ perFingerprintPerMinute: 1 }) });
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    url = `http://localhost:${server.address().port}/api/client-error`;
  });
  afterAll(() => new Promise((resolve) => server.close(resolve)));
  beforeEach(() => {
    logged.length = 0;
  });

  const post = (body, { type = 'text/plain', userAgent = CHROME, headers = {} } = {}) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': type, 'User-Agent': userAgent, ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });

  it('logs a report sent as text/plain, as sendBeacon does', async () => {
    const response = await post(valid);
    expect(response.status).toBe(204);
    expect(logged).toHaveLength(1);
    expect(logged[0].message).toBe(`Client error: TypeError: ${valid.message}`);
    expect(logged[0].meta.clientCommit).toBe(SHA);
    expect(logged[0].meta.clientError).toMatchObject({
      source: 'boundary',
      path: '/occurrence/search',
      userAgent: CHROME,
    });
    expect(logged[0].meta.clientError.fingerprint).toMatch(/^[0-9a-f]{16}$/);
    expect(response.headers.get('X-Powered-By')).toBe(null);
  });

  it('accepts application/json, and limits repeats of the same error', async () => {
    const report = { ...valid, message: 'Only once per minute' };
    expect((await post(report, { type: 'application/json' })).status).toBe(204);
    expect((await post(report, { type: 'application/json' })).status).toBe(204);
    expect(logged).toHaveLength(1);
  });

  it('accepts but does not log reports from bots', async () => {
    const response = await post({ ...valid, message: 'From a bot' }, { userAgent: 'Googlebot' });
    expect(response.status).toBe(204);
    expect(logged).toHaveLength(0);
  });

  it('logs at most 300 characters of the user agent', async () => {
    const response = await post(
      { ...valid, message: 'Long user agent' },
      { userAgent: `${CHROME} ${'x'.repeat(12_000)}` }
    );
    expect(response.status).toBe(204);
    expect(logged[0].meta.clientError.userAgent.length).toBeLessThanOrEqual(301);
  });

  it('does not log reports that are noise', async () => {
    const response = await post({ ...valid, message: 'ResizeObserver loop limit exceeded' });
    expect(response.status).toBe(204);
    expect(logged).toHaveLength(0);
  });

  it('refuses reports another site posts', async () => {
    const response = await post(
      { ...valid, message: 'Made up elsewhere' },
      { headers: { 'Sec-Fetch-Site': 'cross-site' } }
    );
    expect(response.status).toBe(403);
    expect(logged).toHaveLength(0);
    const sameOrigin = await post(
      { ...valid, message: 'From our page' },
      { headers: { 'Sec-Fetch-Site': 'same-origin' } }
    );
    expect(sameOrigin.status).toBe(204);
  });

  it('refuses invalid reports, bad JSON and large bodies without logging', async () => {
    expect((await post({ source: 'boundary' })).status).toBe(400);
    expect((await post('{not json')).status).toBe(400);
    expect((await post({ ...valid, stack: 'x'.repeat(20_000) })).status).toBe(413);
    expect(logged).toHaveLength(0);
  });
});
