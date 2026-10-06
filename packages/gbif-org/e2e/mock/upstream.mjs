// Record/replay stand-in for every upstream gbif-org talks to (GraphQL, translations, REST, tiles).
// The e2e builds bake http://localhost:<PORT>/<prefix> into every PUBLIC_* endpoint, so both the
// SSR server and the browser hit this server, never the real GBIF services.
//
// MODE=replay (default): serve recordings from e2e/recordings. A request without a
//   recording is answered with an error and logged as a miss; global teardown fails the run on misses.
// MODE=record: serve existing recordings, forward anything else to production GBIF once and save it.
//
// Keys are exact (operation + locale + variables, or method + path + query) so each page replays
// precisely the data it was recorded with. Node built-ins only.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const RECORDINGS_DIR = process.env.RECORDINGS_DIR || join(__dirname, '..', 'recordings');

const PORT = parseInt(process.env.MOCK_PORT || '4020', 10);
const MODE = (process.env.MODE || 'replay').toLowerCase();

// Longest prefix wins, so /api/v1 beats /api.
const UPSTREAMS = [
  { prefix: '/graphql', base: 'https://graphql.gbif.org/graphql', kind: 'graphql' },
  { prefix: '/translations', base: 'https://react-components.gbif.org/lib/translations' },
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
].sort((a, b) => b.prefix.length - a.prefix.length);

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

function hash(str) {
  return createHash('sha1').update(str).digest('hex').slice(0, 12);
}

function sanitize(str) {
  return str
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

// Key order must not change the key.
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function operationName(body) {
  if (typeof body?.operationName === 'string') return body.operationName;
  const m = /\b(?:query|mutation)\s+(\w+)/.exec(body?.query ?? '');
  return m ? m[1] : 'anonymous';
}

// The relative file a request is stored in. Also its identity.
function recordingPath(upstream, method, url, body, headers) {
  if (upstream.kind === 'graphql') {
    const locale = headers.locale || 'none';
    const vars = stableStringify(body?.variables ?? {});
    return join('graphql', operationName(body), `${sanitize(locale)}-${hash(vars)}.json`);
  }
  const params = [...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  const query = new URLSearchParams(params).toString();
  const name = `${method}-${sanitize(url.pathname.slice(upstream.prefix.length)) || 'root'}`;
  return join('rest', sanitize(upstream.prefix), `${name}-${hash(query)}.json`);
}

const store = new Map();
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

function send(res, status, headers, body) {
  res.writeHead(status, { ...CORS_HEADERS, ...headers });
  res.end(body);
}

function sendRecording(res, rec) {
  const body = rec.encoding === 'base64' ? Buffer.from(rec.body, 'base64') : rec.body;
  send(res, rec.status, { 'content-type': rec.contentType, 'x-mock': 'replay' }, body);
}

const TEXTUAL = /json|text|javascript|xml|html|graphql/i;

async function record(upstream, method, url, body, headers, key) {
  const target =
    upstream.kind === 'graphql'
      ? upstream.base
      : upstream.base + url.pathname.slice(upstream.prefix.length) + url.search;
  const forwardHeaders = { accept: headers.accept || '*/*' };
  if (headers.locale) forwardHeaders.locale = headers.locale;
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
  const rec = {
    request: { method, target, ...(body !== undefined ? { body } : {}) },
    status: response.status,
    contentType,
    encoding: textual ? 'utf8' : 'base64',
    body: buffer.toString(textual ? 'utf8' : 'base64'),
  };
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

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handle(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === 'OPTIONS') return send(res, 204, {}, '');

  if (url.pathname === '/__mock/misses') {
    return send(res, 200, { 'content-type': 'application/json' }, JSON.stringify(misses));
  }
  if (url.pathname === '/__mock/health') return send(res, 200, {}, 'ok');

  const upstream = UPSTREAMS.find(
    (u) => url.pathname === u.prefix || url.pathname.startsWith(u.prefix + '/')
  );
  if (!upstream) return send(res, 404, {}, `no upstream for ${url.pathname}`);

  if (upstream.kind === 'stub') {
    if (url.pathname.endsWith('.png'))
      return send(res, 200, { 'content-type': 'image/png' }, EMPTY_PNG);
    return send(res, 204, {}, '');
  }

  // Forces graphQLService to fall back to POST, which carries operation name and variables.
  if (upstream.kind === 'graphql' && req.method === 'GET') {
    return send(res, 200, { 'content-type': 'application/json' }, '{"unknownQueryId":true}');
  }

  const raw = req.method === 'POST' ? await readBody(req) : '';
  const body = raw ? JSON.parse(raw) : undefined;
  const key = recordingPath(upstream, req.method, url, body, req.headers);

  const existing = store.get(key);
  if (existing) return sendRecording(res, existing);

  if (MODE === 'record') {
    try {
      return sendRecording(res, await record(upstream, req.method, url, body, req.headers, key));
    } catch (err) {
      console.error(`[mock] record failed ${key}: ${err.message}`);
      return send(res, 502, {}, err.message);
    }
  }

  const miss = {
    key,
    method: req.method,
    path: url.pathname + url.search,
    page: req.headers['x-gbif-site-url'] ?? req.headers.referer,
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
}).listen(PORT, () => {
  console.log(`[mock] ${MODE} mode on :${PORT}, ${store.size} recordings`);
});
