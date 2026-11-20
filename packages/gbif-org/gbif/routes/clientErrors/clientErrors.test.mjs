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

  it('drops unknown fields, query strings and invalid commits', () => {
    const report = parseReport({
      ...valid,
      path: '/occurrence/search?q=secret#x',
      commit: 'not-a-commit',
      email: 'someone@example.org',
    });
    expect(report.path).toBe('/occurrence/search');
    expect(report.commit).toBe(undefined);
    expect(report).not.toHaveProperty('email');
  });

  it('removes query strings from URLs in messages and stacks', () => {
    const report = parseReport({
      ...valid,
      message: 'Failed to load https://www.gbif.org/api/x?token=abc&q=name',
      stack: 'Error\n    at f (https://www.gbif.org/en/user?code=xyz#frag:1:2)',
    });
    expect(report.message).toBe('Failed to load https://www.gbif.org/api/x');
    expect(report.stack).not.toContain('code=xyz');
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
  });

  it('falls back to the connection without the header', () => {
    expect(clientAddress(request(undefined))).toBe('10.0.0.2');
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

  const post = (body, { type = 'text/plain', userAgent = CHROME } = {}) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': type, 'User-Agent': userAgent },
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

  it('refuses invalid reports, bad JSON and large bodies without logging', async () => {
    expect((await post({ source: 'boundary' })).status).toBe(400);
    expect((await post('{not json')).status).toBe(400);
    expect((await post({ ...valid, stack: 'x'.repeat(20_000) })).status).toBe(413);
    expect(logged).toHaveLength(0);
  });
});
