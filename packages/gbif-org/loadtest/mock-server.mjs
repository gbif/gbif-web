// Mock upstream proxy for SSR load testing.
//
// Purpose: stand in for every PUBLIC_* upstream (GraphQL, translations, REST) so the gbif-org
// SSR server can be load-tested without touching the real GBIF API, and so that hitting
// /taxon/<id> with many *different* ids still returns the *same* taxon body every time (forcing
// a fresh server-side render per request while nothing is cacheable by id).
//
// Two modes (env MODE):
//   record  - forward each request to the real upstream ONCE, return the real response to
//             gbif-org, and persist it under recordings/. Run this against one taxon page to
//             capture everything SSR needs. Contacts the real API only a handful of times.
//   replay  - (default) serve the recorded responses for every request, for every id. No
//             outbound traffic to the real API at all.
//
// Zero dependencies: Node built-ins only. Listens on PORT (default 4010), matching
// loadtest/.env.loadtest which repoints every PUBLIC_* endpoint at http://localhost:4010.
//
// See loadtest/README.md for the full runbook.

import { createServer } from 'node:http';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECORDINGS_DIR = join(__dirname, 'recordings');

const PORT = parseInt(process.env.PORT || '4010', 10);
const MODE = (process.env.MODE || 'replay').toLowerCase(); // 'record' | 'replay'

// Real upstreams used only in record mode. Overridable via env. Defaults point at production
// GBIF so a one-time recording always works.
const REAL = {
  graphql: process.env.REAL_GRAPHQL_ENDPOINT || 'https://graphql.gbif.org/graphql',
  translations:
    process.env.REAL_TRANSLATIONS || 'https://react-components.gbif-dev.org/lib/translations',
  webUtils: process.env.REAL_WEB_UTILS || 'https://graphql.gbif.org/unstable-api',
  forms: process.env.REAL_FORMS || 'https://graphql.gbif.org/forms',
  content: process.env.REAL_CONTENT || 'https://graphql.gbif.org/content',
  apiV2: process.env.REAL_API_V2 || 'https://api.gbif.org/v2',
  apiV1: process.env.REAL_API_V1 || 'https://api.gbif.org/v1',
  api: process.env.REAL_API || 'https://api.gbif.org',
  tile: process.env.REAL_TILE || 'https://tile.gbif.org',
};

// Local mount prefix -> real upstream base. Longest prefix wins (so /api/v2 beats /api).
const PREFIXES = [
  { prefix: '/graphql', base: REAL.graphql, graphql: true },
  { prefix: '/translations', base: REAL.translations },
  { prefix: '/unstable-api', base: REAL.webUtils },
  { prefix: '/forms', base: REAL.forms },
  { prefix: '/content', base: REAL.content },
  { prefix: '/api/v2', base: REAL.apiV2 },
  { prefix: '/api/v1', base: REAL.apiV1 },
  { prefix: '/api', base: REAL.api },
  { prefix: '/tile', base: REAL.tile },
].sort((a, b) => b.prefix.length - a.prefix.length);

function matchPrefix(pathname) {
  return PREFIXES.find((p) => pathname === p.prefix || pathname.startsWith(p.prefix + '/'));
}

// ---------------------------------------------------------------------------
// Recording store
// ---------------------------------------------------------------------------

function shortHash(str) {
  return createHash('sha1').update(str).digest('hex').slice(0, 16);
}

function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 120);
}

// In-memory index: signature -> recording object. Loaded at startup (replay) and populated
// during a record session.
const store = new Map();

function loadRecordings() {
  if (!existsSync(RECORDINGS_DIR)) return;
  for (const file of readdirSync(RECORDINGS_DIR)) {
    if (!file.endsWith('.json')) continue;
    try {
      const rec = JSON.parse(readFileSync(join(RECORDINGS_DIR, file), 'utf8'));
      if (rec.signature) store.set(rec.signature, rec);
    } catch (err) {
      console.error(`[mock] failed to read recording ${file}:`, err.message);
    }
  }
}

function saveRecording(rec) {
  if (!existsSync(RECORDINGS_DIR)) mkdirSync(RECORDINGS_DIR, { recursive: true });
  store.set(rec.signature, rec);
  writeFileSync(join(RECORDINGS_DIR, `${sanitize(rec.signature)}.json`), JSON.stringify(rec, null, 2));
}

// ---------------------------------------------------------------------------
// Request signatures — collapse different taxon ids to one recording
// ---------------------------------------------------------------------------

function operationNameFromBody(body) {
  if (body && typeof body === 'object' && typeof body.operationName === 'string') {
    return body.operationName;
  }
  const query = body && typeof body.query === 'string' ? body.query : '';
  const m = /\b(?:query|mutation|subscription)\s+(\w+)/.exec(query);
  if (m) return m[1];
  return query ? `anon-${shortHash(query)}` : 'anon';
}

// Returns { signature, kind } where kind is 'gqlGet' | 'gqlPost' | 'rest'.
function signatureFor({ match, method, url, parsedBody }) {
  if (match.graphql) {
    if (method === 'GET') {
      // queryId is a hash of the query text only — identical for every taxon id.
      const queryId = url.searchParams.get('queryId') || shortHash(url.search);
      return { signature: `gql.GET.${queryId}`, kind: 'gqlGet' };
    }
    return { signature: `gql.POST.${operationNameFromBody(parsedBody)}`, kind: 'gqlPost' };
  }
  // REST/translations: key by method + path (ignoring query string so ids collapse).
  return { signature: `rest.${method}.${sanitize(url.pathname)}`, kind: 'rest' };
}

// ---------------------------------------------------------------------------
// Replay
// ---------------------------------------------------------------------------

function sendRecording(res, rec, label) {
  const body = rec.encoding === 'base64' ? Buffer.from(rec.body, 'base64') : rec.body;
  res.writeHead(rec.status || 200, {
    'content-type': rec.contentType || 'application/json; charset=utf-8',
    'x-mock': label,
  });
  res.end(body);
}

function sendJson(res, status, obj, label) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'x-mock': label });
  res.end(JSON.stringify(obj));
}

// Find a REST recording for the same first path segment when the exact path wasn't recorded
// (so any id under e.g. /api/v1/species/<id> collapses to the recorded one).
function restFallback(pathname) {
  const firstSeg = pathname.split('/').slice(0, 3).join('/'); // e.g. /api/v1
  for (const rec of store.values()) {
    if (rec.kind === 'rest' && rec.pathname && rec.pathname.startsWith(firstSeg)) return rec;
  }
  return undefined;
}

function replay({ match, method, url, sig, res }) {
  const exact = store.get(sig.signature);
  if (exact) {
    sendRecording(res, exact, `replay HIT ${sig.signature}`);
    return;
  }

  if (sig.kind === 'gqlGet') {
    // No GET-data recording: force the client to fall back to POST.
    sendJson(res, 200, { unknownQueryId: true }, `replay GET-miss ${sig.signature}`);
    return;
  }
  if (sig.kind === 'gqlPost') {
    sendJson(res, 200, { data: {} }, `replay POST-miss ${sig.signature}`);
    return;
  }
  // REST
  const fb = restFallback(url.pathname);
  if (fb) {
    sendRecording(res, fb, `replay REST-fallback ${url.pathname} -> ${fb.signature}`);
    return;
  }
  sendJson(res, 200, {}, `replay REST-miss ${url.pathname}`);
}

// ---------------------------------------------------------------------------
// Record
// ---------------------------------------------------------------------------

function upstreamUrlFor(match, url) {
  if (match.graphql) return match.base + url.search; // graphql endpoint is exact + query string
  const rest = url.pathname.slice(match.prefix.length); // path after the local prefix
  return match.base + rest + url.search;
}

const TEXTUAL = /(json|text|javascript|xml|html|graphql)/i;

async function record({ match, method, url, sig, headers, rawBody, res }) {
  // Avoid re-hitting the real API for something already captured this session.
  const existing = store.get(sig.signature);
  if (existing) {
    sendRecording(res, existing, `record cached ${sig.signature}`);
    return;
  }

  const target = upstreamUrlFor(match, url);
  const fwdHeaders = {};
  for (const h of ['content-type', 'accept', 'locale', 'preview', 'authorization', 'x-gbif-site-url', 'user-agent']) {
    if (headers[h]) fwdHeaders[h] = headers[h];
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers: fwdHeaders,
      body: method === 'GET' || method === 'HEAD' ? undefined : rawBody,
    });
  } catch (err) {
    console.error(`[record] upstream FAILED ${method} ${target}:`, err.message);
    sendJson(res, 502, { error: 'upstream fetch failed', target, message: err.message }, 'record-error');
    return;
  }

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  const isText = TEXTUAL.test(contentType);
  const buf = Buffer.from(await upstream.arrayBuffer());
  const bodyText = isText ? buf.toString('utf8') : buf.toString('base64');

  // Don't persist GraphQL GET "miss" markers — replay synthesises those itself.
  let persist = true;
  if (sig.kind === 'gqlGet' && isText) {
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed.unknownQueryId === true || parsed.unknownVariablesId === true) persist = false;
    } catch {
      /* not JSON — keep */
    }
  }

  const rec = {
    signature: sig.signature,
    kind: sig.kind,
    method,
    pathname: url.pathname,
    upstream: target,
    status: upstream.status,
    contentType,
    encoding: isText ? 'utf8' : 'base64',
    body: bodyText,
  };

  if (persist) {
    saveRecording(rec);
    console.log(`[record] ${method} ${target} -> ${upstream.status}  saved ${sig.signature}`);
  } else {
    console.log(`[record] ${method} ${target} -> ${upstream.status}  (GET miss, not saved; forcing POST)`);
  }

  // Return the real response to gbif-org so SSR completes with real data.
  sendRecording(res, rec, `record ${sig.signature}`);
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/__mock/health') {
    sendJson(res, 200, { mode: MODE, recordings: store.size }, 'health');
    return;
  }

  const match = matchPrefix(url.pathname);
  if (!match) {
    sendJson(res, 404, { error: 'no mock prefix for path', path: url.pathname }, 'no-prefix');
    return;
  }

  const rawBody = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req);
  let parsedBody;
  if (rawBody && rawBody.length) {
    try {
      parsedBody = JSON.parse(rawBody.toString('utf8'));
    } catch {
      /* non-JSON body */
    }
  }

  const sig = signatureFor({ match, method: req.method, url, parsedBody });

  try {
    if (MODE === 'record') {
      await record({ match, method: req.method, url, sig, headers: req.headers, rawBody, res });
    } else {
      replay({ match, method: req.method, url, sig, res });
    }
  } catch (err) {
    console.error('[mock] handler error:', err);
    if (!res.headersSent) sendJson(res, 500, { error: err.message }, 'handler-error');
  }
});

loadRecordings();
server.listen(PORT, () => {
  console.log(
    `[mock] listening on http://localhost:${PORT}  mode=${MODE}  recordings=${store.size}` +
      (MODE === 'record' ? `  (forwarding to real upstreams)` : '')
  );
  if (MODE === 'replay' && store.size === 0) {
    console.warn('[mock] WARNING: no recordings found. Run `npm run loadtest:mock:record` first.');
  }
});
