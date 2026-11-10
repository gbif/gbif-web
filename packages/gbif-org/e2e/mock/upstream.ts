// Stand-in for every upstream gbif-org talks to: GraphQL, REST, forms, content search,
// translations and tiles. The e2e build bakes http://localhost:<MOCK_PORT>/<prefix> into every
// PUBLIC_* endpoint (env.ts), so the gbif.org server and the browser only ever reach this server.
// Started by playwright.config.ts; node built-ins only.
//
// A request goes through handle():
//   1. /__mock/* control endpoints: health, misses (read by test.ts and globalTeardown), unsaved
//      (read by globalTeardown), tests started/passed (reported by test.ts), prune (called by
//      globalTeardown), faults (added and cleared by test.ts's mockFault).
//   2. Pick the upstream by longest path prefix (UPSTREAMS). Tiles and analytics images are stubbed
//      blank; translations come from the bundled src/config/fallback/.
//   3. GraphQL GETs get {"unknownQueryId":true}, so the client retries as a POST that carries the
//      operation name, query and variables. A GET that already carries ?query= is handled as that
//      POST.
//   4. Compute the recording key (recordingPath): operation + locale + query text + variables for
//      GraphQL, method + path + sorted query string for REST. Exact, so a changed query is a miss
//      rather than a stale replay. Unnamed GraphQL operations are refused in every mode.
//   5. Answer according to E2E_MODE:
//      replay (default)  serve the recording; without one, log a miss and answer with an error.
//      record            serve the recording; without one, fetch from production and save it.
//      refresh           fetch every key once per run from production and overwrite its recording.
//      live              fetch from E2E_UPSTREAM (prod, test or dev) or E2E_GRAPHQL_ORIGIN /
//                        E2E_API_ORIGIN / E2E_CONTENT_ORIGIN, save nothing. E2E_UPSTREAM_HEADERS
//                        (JSON) adds headers.
//   6. If a test registered a fault for this GraphQL operation, break the answer before sending it
//      (see Fault). Faults never reach the recordings.
//
// record and refresh refuse any upstream but production, so recordings never come from test or
// dev. After a record or refresh run, prune deletes recordings the run never served, but only if
// every test in the suite ran and passed: a partial, failed or aborted run served too little to
// judge.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import {
  createServer,
  type IncomingHttpHeaders as Headers,
  type IncomingMessage,
  type ServerResponse as Response,
} from 'node:http';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOCK_PORT } from '../env.ts';
import type { Fault as TestFault } from '../test.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECORDINGS_DIR = join(__dirname, '..', 'recordings');
const FALLBACK_DIR = join(__dirname, '..', '..', 'src', 'config', 'fallback');
const MODE = (process.env.E2E_MODE || 'replay').toLowerCase();
const RECORDS = MODE === 'record' || MODE === 'refresh';
const LIVE = MODE === 'live';
if (!['replay', 'record', 'refresh', 'live'].includes(MODE)) {
  throw new Error(`Unknown E2E_MODE ${MODE}; use replay, record, refresh or live`);
}

const ENVIRONMENTS: Record<string, { graphql: string; api: string; content: string }> = {
  prod: {
    graphql: 'https://graphql.gbif.org',
    api: 'https://api.gbif.org',
    content: 'https://hp-search.gbif.org',
  },
  test: {
    graphql: 'https://graphql.gbif-test.org',
    api: 'https://api.gbif-test.org',
    content: 'https://hp-search.gbif-test.org',
  },
  dev: {
    graphql: 'https://graphql.gbif-dev.org',
    api: 'https://api.gbif-dev.org',
    content: 'https://hp-search.gbif-dev.org',
  },
};
const UPSTREAM_NAME = (process.env.E2E_UPSTREAM || 'prod').toLowerCase();
const ENVIRONMENT = ENVIRONMENTS[UPSTREAM_NAME];
if (!ENVIRONMENT) {
  throw new Error(`Unknown E2E_UPSTREAM ${UPSTREAM_NAME}; use ${Object.keys(ENVIRONMENTS)}`);
}
const GRAPHQL_ORIGIN = process.env.E2E_GRAPHQL_ORIGIN || ENVIRONMENT.graphql;
const API_ORIGIN = process.env.E2E_API_ORIGIN || ENVIRONMENT.api;
const CONTENT_ORIGIN = process.env.E2E_CONTENT_ORIGIN || ENVIRONMENT.content;
const NOT_PROD = [
  [GRAPHQL_ORIGIN, ENVIRONMENTS.prod.graphql],
  [API_ORIGIN, ENVIRONMENTS.prod.api],
  [CONTENT_ORIGIN, ENVIRONMENTS.prod.content],
]
  .filter(([origin, prod]) => origin !== prod)
  .map(([origin]) => origin);
if (RECORDS && NOT_PROD.length > 0) {
  throw new Error(
    `E2E_MODE=${MODE} only records from production; use E2E_MODE=live for ${NOT_PROD.join(', ')}`
  );
}
// Extra headers for every forwarded request, e.g. a token that lets tests past the bot check in
// front of the test and dev hosts.
const EXTRA_HEADERS = JSON.parse(process.env.E2E_UPSTREAM_HEADERS || '{}');

// A fault as test.ts registers it: see Fault there.
type Fault = TestFault & { test: string };
type Upstream = { prefix: string; base?: string; kind?: 'graphql' | 'translations' | 'stub' };
type GraphQLBody = { query?: string; variables?: unknown; operationName?: string };
type Recording = {
  request: object;
  status: number;
  contentType: string;
  encoding: 'utf8' | 'base64';
  body: string;
};
// On disk a JSON body is stored parsed, so a changed answer diffs line by line.
type StoredRecording =
  | Recording
  | (Omit<Recording, 'encoding' | 'body'> & { encoding: 'json'; body: unknown });

// The parsed body, or undefined when it is not JSON.
function parseJson(rec: Recording): unknown {
  if (rec.encoding !== 'utf8') return undefined;
  try {
    return JSON.parse(rec.body);
  } catch {
    return undefined;
  }
}

function toStored(rec: Recording, json: unknown): StoredRecording {
  return json === undefined ? rec : { ...rec, encoding: 'json', body: json };
}

function fromStored(stored: StoredRecording): Recording {
  if (stored.encoding !== 'json') return stored;
  return { ...stored, encoding: 'utf8', body: JSON.stringify(stored.body) };
}

// Longest prefix wins, so /api/v1 beats /api.
const UPSTREAMS: Upstream[] = [
  { prefix: '/graphql', base: `${GRAPHQL_ORIGIN}/graphql`, kind: 'graphql' },
  // Served from the bundled fallback: in sync with the repo, and not a 500 KB recording per locale
  // that changes with every translation release.
  { prefix: '/translations', kind: 'translations' },
  { prefix: '/unstable-api', base: `${GRAPHQL_ORIGIN}/unstable-api` },
  { prefix: '/forms', base: `${GRAPHQL_ORIGIN}/forms` },
  { prefix: '/content', base: `${CONTENT_ORIGIN}/content` },
  { prefix: '/api/v1', base: `${API_ORIGIN}/v1` },
  { prefix: '/api/v2', base: `${API_ORIGIN}/v2` },
  { prefix: '/api', base: API_ORIGIN },
  // Map tiles and analytics figures are pixels, not data: stubbed so maps render blank and stable.
  { prefix: '/tile', kind: 'stub' },
  { prefix: '/api/v2/map', kind: 'stub' },
  { prefix: '/analytics-files', kind: 'stub' },
];
UPSTREAMS.sort((a, b) => b.prefix.length - a.prefix.length);

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

function hash(str: string) {
  return createHash('sha1').update(str).digest('hex').slice(0, 12);
}

function sanitize(str: string) {
  return str
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

// Key order must not change the key.
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function operationName(body: GraphQLBody | undefined): string | undefined {
  if (typeof body?.operationName === 'string' && body.operationName) return body.operationName;
  const m = /\b(?:query|mutation)\s+(\w+)/.exec(body?.query ?? '');
  return m?.[1];
}

// The relative file a request is stored in. Also its identity.
function recordingPath(
  upstream: Upstream,
  method: string,
  url: URL,
  body: GraphQLBody | undefined,
  headers: Headers
) {
  if (upstream.kind === 'graphql') {
    const locale = String(headers.locale || 'none');
    const id = `${body?.query ?? ''}\n${stableStringify(body?.variables ?? {})}`;
    return join(
      'graphql',
      operationName(body) ?? 'anonymous',
      `${sanitize(locale)}-${hash(id)}.json`
    );
  }
  const params = [...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  const query = new URLSearchParams(params).toString();
  const name = `${method}-${sanitize(url.pathname.slice(upstream.prefix.length)) || 'root'}`;
  return join('rest', sanitize(upstream.prefix), `${name}-${hash(query)}.json`);
}

const store: Map<string, Recording> = new Map();
const served: Set<string> = new Set();
const inflight: Map<string, Promise<Recording>> = new Map();
const misses: Array<Record<string, unknown>> = [];
// Answers record() passed on without saving, by key; listed by globalTeardown.
const unsaved: Map<string, Record<string, unknown> & { count: number }> = new Map();
// Reported by the test fixture.
// ids holds the distinct tests that started, so a repeated test counts once.
const tests = { started: 0, passed: 0, ids: new Set() };
let faults: Fault[] = [];

function loadRecordings(dir = RECORDINGS_DIR, rel = '') {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relPath = join(rel, entry.name);
    if (entry.isDirectory()) loadRecordings(join(dir, entry.name), relPath);
    else if (entry.name.endsWith('.json')) {
      store.set(relPath, fromStored(JSON.parse(readFileSync(join(dir, entry.name), 'utf8'))));
    }
  }
}

// translations.json maps locale -> "/<file>.json?v=<hash>"; the bundled messages are per locale.
const translationsIndex = JSON.parse(readFileSync(join(FALLBACK_DIR, 'translations.json'), 'utf8'));
const messagesFileToLocale = new Map(
  Object.entries(translationsIndex as Record<string, { messages: string }>).map(
    ([locale, entry]) => [basename(entry.messages.split('?')[0]), locale]
  )
);

function send(
  res: Response,
  status: number,
  headers: Record<string, string>,
  body: string | Buffer
) {
  res.writeHead(status, { ...CORS_HEADERS, ...headers });
  res.end(body);
}

function sendJsonFile(res: Response, file: string) {
  send(res, 200, { 'content-type': 'application/json' }, readFileSync(file));
}

function sendRecording(res: Response, rec: Recording) {
  const body = rec.encoding === 'base64' ? Buffer.from(rec.body, 'base64') : rec.body;
  send(res, rec.status, { 'content-type': rec.contentType, 'x-mock': 'replay' }, body);
}

const TEXTUAL = /json|text|javascript|xml|html|graphql/i;

// Contact photos arrive as full-size base64 inside GraphQL responses (several MB each) and no
// spec checks them, so every recorded one is the same 8x8 gray JPEG.
const PLACEHOLDER_PHOTO =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAIAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDpqKKKAP/Z';

function replacePhotos(body: string): string {
  if (!body.includes('"profilePicture"')) return body;
  return JSON.stringify(JSON.parse(body), (key, value) =>
    key === 'profilePicture' && typeof value === 'string' && value ? PLACEHOLDER_PHOTO : value
  );
}

// The API rate-limits bursts: a record run with every worker loading pages answered some lookups
// with 429. Calls beyond the cap wait for a free slot; a 429 is retried after Retry-After.
const UPSTREAM_CONCURRENCY = Math.max(1, Number(process.env.E2E_UPSTREAM_CONCURRENCY) || 4);
const RATE_LIMIT_RETRIES = 3;
let activeUpstreamCalls = 0;
const waitingForSlot: (() => void)[] = [];

async function withUpstreamSlot<T>(call: () => Promise<T>): Promise<T> {
  if (activeUpstreamCalls < UPSTREAM_CONCURRENCY) activeUpstreamCalls++;
  else await new Promise<void>((resolve) => waitingForSlot.push(resolve));
  try {
    return await call();
  } finally {
    // Hand the slot straight to the next waiter, or free it.
    const next = waitingForSlot.shift();
    if (next) next();
    else activeUpstreamCalls--;
  }
}

function retryAfterMs(header: string | null, attempt: number): number {
  const seconds = Number(header);
  const hint =
    header && Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header ?? '') - Date.now();
  // A zero, negative or unreadable hint falls back to the backoff.
  if (hint > 0) return Math.min(hint, 60_000);
  return 5000 * 2 ** (attempt - 1);
}

// Fetches the request from the real upstream. Used by record/refresh (then saved) and live.
async function forward(
  upstream: Upstream,
  method: string,
  url: URL,
  body: GraphQLBody | undefined,
  headers: Headers
): Promise<Recording> {
  const base = String(upstream.base);
  const target =
    upstream.kind === 'graphql'
      ? base
      : base + url.pathname.slice(upstream.prefix.length) + url.search;
  const forwardHeaders: Record<string, string> = {
    accept: headers.accept || '*/*',
    ...EXTRA_HEADERS,
  };
  if (headers.locale) forwardHeaders.locale = String(headers.locale);
  // graphql-api answers isbot() user agents with 418 on its third-party endpoints (CITES), and
  // headless Chrome counts as a bot, so record what a real browser gets.
  if (headers['user-agent']) {
    forwardHeaders['user-agent'] = String(headers['user-agent']).replace(
      'HeadlessChrome',
      'Chrome'
    );
  }
  if (body !== undefined) forwardHeaders['content-type'] = 'application/json';

  const { response, buffer } = await withUpstreamSlot(async () => {
    for (let attempt = 1; ; attempt++) {
      const response = await fetch(target, {
        method,
        headers: forwardHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
        redirect: 'follow',
      });
      const buffer = Buffer.from(await response.arrayBuffer());
      if (response.status !== 429 || attempt > RATE_LIMIT_RETRIES) return { response, buffer };
      const wait = retryAfterMs(response.headers.get('retry-after'), attempt);
      console.warn(`[mock] 429 from ${target}; retry ${attempt} in ${wait / 1000}s`);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  });
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const textual = TEXTUAL.test(contentType);
  return {
    request: { method, target, ...(body !== undefined ? { body } : {}) },
    status: response.status,
    contentType,
    encoding: textual ? 'utf8' : 'base64',
    body: textual ? replacePhotos(buffer.toString('utf8')) : buffer.toString('base64'),
  };
}

// Fetches and saves a recording. Answers that whyNotSaved rejects are passed on but not saved.
async function record(
  upstream: Upstream,
  method: string,
  url: URL,
  body: GraphQLBody | undefined,
  headers: Headers,
  key: string
): Promise<Recording> {
  const rec = await forward(upstream, method, url, body, headers);
  const json = parseJson(rec);
  const refusal = whyNotSaved(upstream, rec.status, json);
  if (refusal) {
    console.warn(`[mock] NOT saved ${rec.status} ${key}: ${refusal}`);
    const previous = unsaved.get(key);
    unsaved.set(key, {
      key,
      status: rec.status,
      reason: refusal,
      kept: store.has(key),
      count: (previous?.count ?? 0) + 1,
      page: headers['x-gbif-site-url'] ?? headers.referer,
      test: headers['x-e2e-test'],
    });
    return rec;
  }
  const file = join(RECORDINGS_DIR, key);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(toStored(rec, json), null, 2) + '\n');
  store.set(key, rec);
  unsaved.delete(key);
  console.log(`[mock] recorded ${rec.status} ${key}`);
  // Expected for a 404; with status 200 a resolver failed, which may be a passing upstream fault.
  if (upstream.kind === 'graphql' && isGraphQLAnswer(json) && Array.isArray(json.errors)) {
    console.warn(`[mock] WARNING ${key} recorded with GraphQL errors; check it before committing`);
  }
  return rec;
}

// JSON with data or errors, as opposed to an HTML page from a proxy in front of the API.
function isGraphQLAnswer(json: unknown): json is { data?: unknown; errors?: unknown } {
  return !!json && typeof json === 'object' && ('data' in json || 'errors' in json);
}

// Why an answer is not saved, or undefined if it is. Server errors, rate limits (429) and the bot
// check's 403 are passing trouble, so in refresh mode the old recording stays. graphql-api answers
// a missing entity with status 404, sometimes next to data, and pages are tested against that.
// Its other 4xx mean the query does not match the deployed API; left unsaved, replay misses.
function whyNotSaved(upstream: Upstream, status: number, json: unknown): string | undefined {
  if (status >= 500 || status === 403 || status === 429) {
    return 'a server error, rate limit or bot check; try again later';
  }
  if (upstream.kind !== 'graphql') return undefined;
  if (!isGraphQLAnswer(json)) return 'not a GraphQL answer';
  if (status >= 400 && status !== 404) return 'the API rejected the query';
  return undefined;
}

// Parallel identical misses share one upstream call and one write.
function recordOnce(
  upstream: Upstream,
  method: string,
  url: URL,
  body: GraphQLBody | undefined,
  headers: Headers,
  key: string
): Promise<Recording> {
  if (!inflight.has(key)) {
    inflight.set(
      key,
      record(upstream, method, url, body, headers, key).finally(() => inflight.delete(key))
    );
  }
  return inflight.get(key) as Promise<Recording>;
}

function prune() {
  const removed = [...store.keys()].filter((key) => !served.has(key));
  for (const key of removed) {
    rmSync(join(RECORDINGS_DIR, key));
    store.delete(key);
  }
  return removed;
}

// A fault only breaks requests made for the test that asked for it. Browser requests carry the
// test id in x-e2e-test. Requests from the gbif.org server carry the page URL in x-gbif-site-url,
// to which test.ts adds e2eTest=<id> for tests with faults. (camelCase, since the server redirects
// kebab-case query parameters to it.) Other requests are never broken.
function testOf(headers: Headers): string | undefined {
  if (headers['x-e2e-test']) return String(headers['x-e2e-test']);
  const page = URL.canParse(String(headers['x-gbif-site-url'])) ? headers['x-gbif-site-url'] : '';
  return page ? (new URL(String(page)).searchParams.get('e2eTest') ?? undefined) : undefined;
}

function findFault(body: GraphQLBody | undefined, headers: Headers): Fault | undefined {
  const test = testOf(headers);
  if (!test) return undefined;
  return faults.find(
    (f) =>
      f.test === test &&
      f.operation === operationName(body) &&
      Object.entries(f.variables ?? {}).every(
        ([name, value]) =>
          stableStringify(((body?.variables ?? {}) as Record<string, unknown>)[name]) ===
          stableStringify(value)
      )
  );
}

function applyFault(rec: Recording, fault: Fault): Recording {
  let response;
  try {
    response = JSON.parse(rec.body);
  } catch {
    // E.g. an HTML error page from a live upstream: nothing to break, so pass it on as it is.
    console.warn(`[mock] fault for ${fault.operation} not applied: the answer is not JSON`);
    return rec;
  }
  const setNull = (path: string[]) => {
    const parent = path.slice(0, -1).reduce((obj, step) => obj?.[step], response.data);
    if (parent && typeof parent === 'object') parent[path[path.length - 1]] = null;
  };
  for (const path of fault.nulls ?? []) setNull(path);
  for (const { path, message = 'e2e fault' } of fault.errors ?? []) {
    setNull(path);
    response.errors = [...(response.errors ?? []), { message, path }];
  }
  return { ...rec, body: JSON.stringify(response) };
}

function reply(res: Response, rec: Recording, fault: Fault | undefined) {
  sendRecording(res, fault ? applyFault(rec, fault) : rec);
}

function graphQLBodyOf(url: URL): GraphQLBody {
  const variables = url.searchParams.get('variables');
  return {
    query: url.searchParams.get('query') ?? undefined,
    ...(variables ? { variables: JSON.parse(variables) } : {}),
  };
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handle(req: IncomingMessage, res: Response) {
  const url = new URL(req.url ?? '/', `http://localhost:${MOCK_PORT}`);
  if (req.method === 'OPTIONS') return send(res, 204, {}, '');

  if (url.pathname === '/__mock/health') return send(res, 200, {}, 'ok');
  if (url.pathname === '/__mock/misses') {
    const test = url.searchParams.get('test');
    const list = test ? misses.filter((m) => m.test === test) : misses;
    return send(res, 200, { 'content-type': 'application/json' }, JSON.stringify(list));
  }
  if (url.pathname === '/__mock/unsaved') {
    const list = [...unsaved.values()];
    return send(res, 200, { 'content-type': 'application/json' }, JSON.stringify(list));
  }
  if (url.pathname === '/__mock/test-started' && req.method === 'POST') {
    tests.started++;
    tests.ids.add(url.searchParams.get('test') ?? 'unknown');
    return send(res, 204, {}, '');
  }
  if (url.pathname === '/__mock/test-passed' && req.method === 'POST') {
    tests.passed++;
    return send(res, 204, {}, '');
  }
  if (url.pathname === '/__mock/prune' && req.method === 'POST') {
    if (!RECORDS) return send(res, 409, {}, 'prune only runs in record or refresh mode');
    if (tests.started === 0 || tests.passed !== tests.started) {
      const message = `not pruning: ${tests.passed} of ${tests.started} started tests passed`;
      return send(res, 409, {}, message);
    }
    // globalTeardown sends the size of the whole suite; fewer distinct tests means a partial run.
    const expected = Number(url.searchParams.get('expected'));
    if (tests.ids.size !== expected) {
      const message = `not pruning: ${tests.ids.size} of the suite's ${expected} tests ran`;
      return send(res, 409, {}, message);
    }
    return send(res, 200, { 'content-type': 'application/json' }, JSON.stringify(prune()));
  }
  if (url.pathname === '/__mock/faults' && req.method === 'POST') {
    faults.push(JSON.parse(await readBody(req)));
    return send(res, 204, {}, '');
  }
  if (url.pathname === '/__mock/faults' && req.method === 'DELETE') {
    faults = faults.filter((f) => f.test !== url.searchParams.get('test'));
    return send(res, 204, {}, '');
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

  // Forces graphQLService to fall back to POST, which carries operation name and variables. GETs
  // with the query text itself (the filter labels) have no fallback, so they are answered as that POST.
  const graphQLGet = upstream.kind === 'graphql' && req.method === 'GET';
  if (graphQLGet && !url.searchParams.has('query')) {
    return send(res, 200, { 'content-type': 'application/json' }, '{"unknownQueryId":true}');
  }

  const method = graphQLGet ? 'POST' : (req.method ?? 'GET');
  const raw = req.method === 'POST' ? await readBody(req) : '';
  const body: GraphQLBody | undefined = raw
    ? JSON.parse(raw)
    : graphQLGet
      ? graphQLBodyOf(url)
      : undefined;
  const key = recordingPath(upstream, method, url, body, req.headers);

  // Recordings are filed by operation name; unnamed queries would all share one folder.
  if (upstream.kind === 'graphql' && !operationName(body)) {
    return miss(
      res,
      upstream,
      method,
      url,
      body,
      req.headers,
      key,
      'unnamed GraphQL operation; give it a name'
    );
  }

  const fault = upstream.kind === 'graphql' ? findFault(body, req.headers) : undefined;
  if (fault?.status) {
    return send(res, fault.status, { 'content-type': 'text/plain' }, 'e2e fault');
  }

  if (LIVE) {
    try {
      return reply(res, await forward(upstream, method, url, body, req.headers), fault);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[mock] live request failed ${key}: ${message}`);
      return send(res, 502, {}, message);
    }
  }

  const existing = store.get(key);
  // Refresh forwards each key once; later identical requests in the run get the fresh recording.
  if (existing && (MODE !== 'refresh' || served.has(key))) {
    served.add(key);
    return reply(res, existing, fault);
  }

  if (RECORDS) {
    try {
      const rec = await recordOnce(upstream, method, url, body, req.headers, key);
      served.add(key);
      return reply(res, rec, fault);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[mock] record failed ${key}: ${message}`);
      return send(res, 502, {}, message);
    }
  }

  return miss(
    res,
    upstream,
    method,
    url,
    body,
    req.headers,
    key,
    'no recording; run npm run e2e:record'
  );
}

// Logs the request for test.ts (misses tagged with its test id fail that test) and globalTeardown
// (any miss fails the run), and answers with an error the page can render.
function miss(
  res: Response,
  upstream: Upstream,
  method: string,
  url: URL,
  body: GraphQLBody | undefined,
  headers: Headers,
  key: string,
  reason: string
) {
  const entry: Record<string, unknown> = {
    key,
    reason,
    method,
    path: url.pathname + url.search,
    page: headers['x-gbif-site-url'] ?? headers.referer,
    // Set by the test fixture on browser requests; server-side requests have none.
    test: headers['x-e2e-test'],
  };
  if (upstream.kind === 'graphql') entry.variables = body?.variables;
  misses.push(entry);
  console.warn(
    `[mock] MISS (${reason}) ${key} ${method} ${entry.path} (page: ${entry.page ?? 'unknown'})`
  );
  if (upstream.kind === 'graphql') {
    const message = `e2e mock: ${key}: ${reason}`;
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
  const source = LIVE
    ? `forwarding to ${GRAPHQL_ORIGIN}, ${API_ORIGIN} and ${CONTENT_ORIGIN}`
    : `${store.size} recordings`;
  console.log(`[mock] ${MODE} mode on :${MOCK_PORT}, ${source}`);
});
