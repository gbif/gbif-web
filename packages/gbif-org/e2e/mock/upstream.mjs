// Record/replay stand-in for every upstream gbif-org talks to (GraphQL, translations, REST, tiles).
// The e2e build bakes http://localhost:<MOCK_PORT>/<prefix> into every PUBLIC_* endpoint, so both
// the SSR server and the browser hit this server, never the real GBIF services.
//
// E2E_MODE=replay (default): serve recordings from e2e/recordings. A request without a recording is
//   answered with an error and logged as a miss; the test fixture and global teardown fail on misses.
// E2E_MODE=record: serve existing recordings, forward anything else to production GBIF and save it.
//   POST /__mock/prune afterwards deletes recordings the run never served.
//
// Keys are exact (operation + locale + query text + variables, or method + path + query string), so
// a changed query is a miss rather than a stale replay. Node built-ins only.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOCK_PORT } from '../env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECORDINGS_DIR = process.env.RECORDINGS_DIR || join(__dirname, '..', 'recordings');
const FALLBACK_DIR = join(__dirname, '..', '..', 'src', 'config', 'fallback');
const MODE = (process.env.E2E_MODE || 'replay').toLowerCase();

/**
 * @typedef {{ prefix: string, base?: string, kind?: 'graphql' | 'translations' | 'stub' }} Upstream
 * @typedef {{ query?: string, variables?: unknown, operationName?: string }} GraphQLBody
 * @typedef {{ request: object, status: number, contentType: string, encoding: 'utf8' | 'base64', body: string }} Recording
 * @typedef {import('node:http').IncomingHttpHeaders} Headers
 * @typedef {import('node:http').ServerResponse} Response
 */

// Longest prefix wins, so /api/v1 beats /api.
const UPSTREAMS = /** @type {Upstream[]} */ ([
  { prefix: '/graphql', base: 'https://graphql.gbif.org/graphql', kind: 'graphql' },
  // Served from the bundled fallback: in sync with the repo, and not a 500 KB recording per locale
  // that changes with every translation release.
  { prefix: '/translations', kind: 'translations' },
  { prefix: '/unstable-api', base: 'https://graphql.gbif.org/unstable-api' },
  { prefix: '/forms', base: 'https://graphql.gbif.org/forms' },
  { prefix: '/content', base: 'https://graphql.gbif.org/content' },
  { prefix: '/api/v1', base: 'https://api.gbif.org/v1' },
  { prefix: '/api/v2', base: 'https://api.gbif.org/v2' },
  { prefix: '/api', base: 'https://api.gbif.org' },
  // Map tiles and analytics figures are pixels, not data: stubbed so maps render blank and stable.
  { prefix: '/tile', kind: 'stub' },
  { prefix: '/api/v2/map', kind: 'stub' },
  { prefix: '/analytics-files', kind: 'stub' },
]).sort((a, b) => b.prefix.length - a.prefix.length);

// 1x1 transparent PNG.
const EMPTY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-max-age': '600',
};

/** @param {string} str */
function hash(str) {
  return createHash('sha1').update(str).digest('hex').slice(0, 12);
}

/** @param {string} str */
function sanitize(str) {
  return str
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

// Key order must not change the key.
/** @param {unknown} value @returns {string} */
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map(
        (k) =>
          `${JSON.stringify(k)}:${stableStringify(/** @type {Record<string, unknown>} */ (value)[k])}`
      )
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

/** @param {GraphQLBody | undefined} body */
function operationName(body) {
  if (typeof body?.operationName === 'string') return body.operationName;
  const m = /\b(?:query|mutation)\s+(\w+)/.exec(body?.query ?? '');
  return m ? m[1] : 'anonymous';
}

// The relative file a request is stored in. Also its identity.
/**
 * @param {Upstream} upstream @param {string} method @param {URL} url
 * @param {GraphQLBody | undefined} body @param {Headers} headers
 */
function recordingPath(upstream, method, url, body, headers) {
  if (upstream.kind === 'graphql') {
    const locale = String(headers.locale || 'none');
    const id = `${body?.query ?? ''}\n${stableStringify(body?.variables ?? {})}`;
    return join('graphql', operationName(body), `${sanitize(locale)}-${hash(id)}.json`);
  }
  const params = [...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  const query = new URLSearchParams(params).toString();
  const name = `${method}-${sanitize(url.pathname.slice(upstream.prefix.length)) || 'root'}`;
  return join('rest', sanitize(upstream.prefix), `${name}-${hash(query)}.json`);
}

/** @type {Map<string, Recording>} */
const store = new Map();
/** @type {Set<string>} */
const served = new Set();
/** @type {Map<string, Promise<Recording>>} */
const inflight = new Map();
/** @type {Array<Record<string, unknown>>} */
const misses = [];

function loadRecordings(dir = RECORDINGS_DIR, rel = '') {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relPath = join(rel, entry.name);
    if (entry.isDirectory()) loadRecordings(join(dir, entry.name), relPath);
    else if (entry.name.endsWith('.json')) {
      store.set(relPath, JSON.parse(readFileSync(join(dir, entry.name), 'utf8')));
    }
  }
}

// translations.json maps locale -> "/<file>.json?v=<hash>"; the bundled messages are per locale.
const translationsIndex = JSON.parse(readFileSync(join(FALLBACK_DIR, 'translations.json'), 'utf8'));
const messagesFileToLocale = new Map(
  Object.entries(/** @type {Record<string, { messages: string }>} */ (translationsIndex)).map(
    ([locale, entry]) => [basename(entry.messages.split('?')[0]), locale]
  )
);

/**
 * @param {Response} res @param {number} status @param {Record<string, string>} headers
 * @param {string | Buffer} body
 */
function send(res, status, headers, body) {
  res.writeHead(status, { ...CORS_HEADERS, ...headers });
  res.end(body);
}

/** @param {Response} res @param {string} file */
function sendJsonFile(res, file) {
  send(res, 200, { 'content-type': 'application/json' }, readFileSync(file));
}

/** @param {Response} res @param {Recording} rec */
function sendRecording(res, rec) {
  const body = rec.encoding === 'base64' ? Buffer.from(rec.body, 'base64') : rec.body;
  send(res, rec.status, { 'content-type': rec.contentType, 'x-mock': 'replay' }, body);
}

const TEXTUAL = /json|text|javascript|xml|html|graphql/i;

/**
 * @param {Upstream} upstream @param {string} method @param {URL} url
 * @param {GraphQLBody | undefined} body @param {Headers} headers @param {string} key
 * @returns {Promise<Recording>}
 */
async function record(upstream, method, url, body, headers, key) {
  const base = String(upstream.base);
  const target =
    upstream.kind === 'graphql'
      ? base
      : base + url.pathname.slice(upstream.prefix.length) + url.search;
  /** @type {Record<string, string>} */
  const forwardHeaders = { accept: headers.accept || '*/*' };
  if (headers.locale) forwardHeaders.locale = String(headers.locale);
  if (body !== undefined) forwardHeaders['content-type'] = 'application/json';

  const response = await fetch(target, {
    method,
    headers: forwardHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'follow',
  });
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const buffer = Buffer.from(await response.arrayBuffer());
  const textual = TEXTUAL.test(contentType);
  /** @type {Recording} */
  const rec = {
    request: { method, target, ...(body !== undefined ? { body } : {}) },
    status: response.status,
    contentType,
    encoding: textual ? 'utf8' : 'base64',
    body: buffer.toString(textual ? 'utf8' : 'base64'),
  };
  // GraphQL reports failures with status 200, so check the body too.
  if (upstream.kind === 'graphql' && textual && /"errors"\s*:\s*\[/.test(rec.body)) {
    console.warn(`[mock] WARNING ${key} recorded with GraphQL errors; check it before committing`);
  }
  // Upstream hiccups are not worth freezing into a fixture.
  if (response.status < 500) {
    const file = join(RECORDINGS_DIR, key);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(rec, null, 2) + '\n');
    store.set(key, rec);
  }
  console.log(`[mock] recorded ${response.status} ${key}`);
  return rec;
}

// Parallel identical misses share one upstream call and one write.
/**
 * @param {Upstream} upstream @param {string} method @param {URL} url
 * @param {GraphQLBody | undefined} body @param {Headers} headers @param {string} key
 * @returns {Promise<Recording>}
 */
function recordOnce(upstream, method, url, body, headers, key) {
  if (!inflight.has(key)) {
    inflight.set(
      key,
      record(upstream, method, url, body, headers, key).finally(() => inflight.delete(key))
    );
  }
  return /** @type {Promise<Recording>} */ (inflight.get(key));
}

function prune() {
  const removed = [...store.keys()].filter((key) => !served.has(key));
  for (const key of removed) {
    rmSync(join(RECORDINGS_DIR, key));
    store.delete(key);
  }
  return removed;
}

/** @param {import('node:http').IncomingMessage} req @returns {Promise<string>} */
function readBody(req) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/** @param {import('node:http').IncomingMessage} req @param {Response} res */
async function handle(req, res) {
  const url = new URL(req.url ?? '/', `http://localhost:${MOCK_PORT}`);
  if (req.method === 'OPTIONS') return send(res, 204, {}, '');

  if (url.pathname === '/__mock/health') return send(res, 200, {}, 'ok');
  if (url.pathname === '/__mock/misses') {
    const test = url.searchParams.get('test');
    const list = test ? misses.filter((m) => m.test === test) : misses;
    return send(res, 200, { 'content-type': 'application/json' }, JSON.stringify(list));
  }
  if (url.pathname === '/__mock/prune' && req.method === 'POST') {
    if (MODE !== 'record') return send(res, 409, {}, 'prune only runs in record mode');
    return send(res, 200, { 'content-type': 'application/json' }, JSON.stringify(prune()));
  }

  const upstream = UPSTREAMS.find(
    (u) => url.pathname === u.prefix || url.pathname.startsWith(u.prefix + '/')
  );
  if (!upstream) return send(res, 404, {}, `no upstream for ${url.pathname}`);

  if (upstream.kind === 'stub') {
    if (url.pathname.endsWith('.png'))
      return send(res, 200, { 'content-type': 'image/png' }, EMPTY_PNG);
    return send(res, 204, {}, '');
  }

  if (upstream.kind === 'translations') {
    const file = basename(url.pathname);
    if (file === 'translations.json') return sendJsonFile(res, join(FALLBACK_DIR, file));
    const locale = messagesFileToLocale.get(file);
    const messages = locale && join(FALLBACK_DIR, 'messages', `${locale}.json`);
    if (messages && existsSync(messages)) return sendJsonFile(res, messages);
    return send(res, 404, {}, `no bundled messages for ${file}`);
  }

  // Forces graphQLService to fall back to POST, which carries operation name and variables.
  if (upstream.kind === 'graphql' && req.method === 'GET') {
    return send(res, 200, { 'content-type': 'application/json' }, '{"unknownQueryId":true}');
  }

  const method = req.method ?? 'GET';
  const raw = method === 'POST' ? await readBody(req) : '';
  /** @type {GraphQLBody | undefined} */
  const body = raw ? JSON.parse(raw) : undefined;
  const key = recordingPath(upstream, method, url, body, req.headers);

  const existing = store.get(key);
  if (existing) {
    served.add(key);
    return sendRecording(res, existing);
  }

  if (MODE === 'record') {
    try {
      const rec = await recordOnce(upstream, method, url, body, req.headers, key);
      served.add(key);
      return sendRecording(res, rec);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[mock] record failed ${key}: ${message}`);
      return send(res, 502, {}, message);
    }
  }

  /** @type {Record<string, unknown>} */
  const miss = {
    key,
    method,
    path: url.pathname + url.search,
    page: req.headers['x-gbif-site-url'] ?? req.headers.referer,
    // Set by the test fixture on browser requests; server-side requests have none.
    test: req.headers['x-e2e-test'],
  };
  if (upstream.kind === 'graphql') miss.variables = body?.variables;
  misses.push(miss);
  console.warn(`[mock] MISS ${key} (page: ${miss.page ?? 'unknown'})`);
  if (upstream.kind === 'graphql') {
    const message = `e2e mock: no recording for ${key}. Run npm run e2e:record.`;
    return send(
      res,
      200,
      { 'content-type': 'application/json' },
      JSON.stringify({ data: null, errors: [{ message }] })
    );
  }
  return send(res, 404, { 'content-type': 'application/json' }, '{}');
}

loadRecordings();
createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error('[mock] handler error', err);
    send(res, 500, {}, String(err));
  });
}).listen(MOCK_PORT, () => {
  console.log(`[mock] ${MODE} mode on :${MOCK_PORT}, ${store.size} recordings`);
});
