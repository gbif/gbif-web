import { createHash } from 'node:crypto';

// Errors reported by browsers on gbif.org (see src/utils/clientErrorReporting.ts), logged so they
// end up in Kibana next to the server logs. The endpoint is public and unauthenticated, so it only
// accepts a fixed set of short fields, and the number of reports logged is capped.

export const CLIENT_ERROR_PATH = '/api/client-error';
export const MAX_BODY_SIZE = '16kb';
// Reports a browser sends per session (it counts in sessionStorage, so reloads don't reset it).
export const MAX_REPORTS_PER_SESSION = 5;
// Shared with the browser so the early error script and the app count together.
export const SESSION_COUNT_KEY = 'gbif-client-errors-sent';

const SOURCES = new Set(['window', 'unhandledrejection', 'recoverable', 'boundary', 'route']);
const LIMITS = {
  name: 100,
  message: 1000,
  stack: 4000,
  componentStack: 2000,
  path: 500,
  graphQLError: 200,
  userAgent: 300,
};
const MAX_GRAPHQL_ERRORS = 5;
const COMMIT_PATTERN = /^[0-9a-f]{7,40}$/i;
// Crawlers and headless browsers (including our own e2e tests) are not users.
const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime/i;
// A URL's query string inside a message or stack: after an absolute URL, or after a path starting
// with / at the start of the text or after a space, bracket or quote.
const URL_QUERY =
  /([a-z][a-z0-9+.-]*:\/\/[^\s?#)'"]+|(?:^|(?<=[\s('"]))\/[^\s?#)'"]*)\?([^\s#)'"]*)/gi;
// Query parameters whose values are secrets or identify someone. Everything else (filters, the
// search text) is kept: it is what the visitor was looking at when the error happened.
const SECRET_PARAMS = new Set([
  'token',
  'code',
  'state',
  'key',
  'apikey',
  'api_key',
  'secret',
  'password',
  'pwd',
  'auth',
  'authorization',
  'session',
  'sid',
  'jwt',
  'signature',
  'sig',
  'email',
  'mail',
  'username',
]);
const SECRET_PARAM_SUFFIX = /(token|secret|password|signature)$/i;

export function shortString(value, max) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

// "taxonKey=1&token=abc" -> "taxonKey=1&token=…"
function redactQuery(query) {
  return query
    .split('&')
    .map((pair) => {
      const [name, ...value] = pair.split('=');
      const secret = SECRET_PARAMS.has(name.toLowerCase()) || SECRET_PARAM_SUFFIX.test(name);
      return secret && value.length ? `${name}=…` : pair;
    })
    .join('&');
}

// Blank secret query parameters in every URL in the text. Fragments are dropped: OAuth flows put
// tokens there too.
function redactUrls(text) {
  return text
    ?.replace(URL_QUERY, (match, url, query) => {
      // In a stack frame the line and column follow the query: "?a=b:1:2".
      const [, params, position] = query.match(/^(.*?)((?::\d+){1,2})?$/);
      return `${url}?${redactQuery(params)}${position ?? ''}`;
    })
    .replace(/(\S)#[^\s)'"]*/g, '$1');
}

// The report as logged, or null if it isn't one. Unknown fields are dropped.
export function parseReport(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const message = redactUrls(shortString(body.message, LIMITS.message));
  if (!message || !SOURCES.has(body.source)) return null;

  const path = redactUrls(shortString(body.path, LIMITS.path));
  const commit = typeof body.commit === 'string' && COMMIT_PATTERN.test(body.commit);
  const graphQLErrors = Array.isArray(body.graphQLErrors)
    ? body.graphQLErrors
        .slice(0, MAX_GRAPHQL_ERRORS)
        .map((error) => redactUrls(shortString(error, LIMITS.graphQLError)))
        .filter(Boolean)
    : [];

  return {
    source: body.source,
    name: shortString(body.name, LIMITS.name) ?? 'Error',
    message,
    stack: redactUrls(shortString(body.stack, LIMITS.stack)),
    componentStack: shortString(body.componentStack, LIMITS.componentStack),
    graphQLErrors: graphQLErrors.length ? graphQLErrors : undefined,
    path: path?.startsWith('/') ? path : undefined,
    commit: commit ? body.commit : undefined,
  };
}

// Remove what differs between occurrences and builds of the same error: content hashes in chunk
// names, and long numbers such as record keys. Short numbers stay, as they often say which error
// it is (React error #418, status 500).
function normalise(text) {
  return text.replace(/-[A-Za-z0-9_-]{8}\.(m?js|css)\b/g, '.$1').replace(/\b\d{4,}\b/g, '#');
}

// Minified identifiers (one to three characters) change between builds. Replace them where common
// messages name one: "Ab is not a function", "Cannot access 'Xk' before initialization".
function withoutMinifiedNames(message) {
  return message
    .replace(/^[\w$]{1,3}(?=(\.[\w$]+)* is not (a function|a constructor|defined|iterable)\b)/, '…')
    .replace(/'[\w$]{1,3}'/g, "'…'");
}

// The file the error was thrown in, from the first stack frame that has one. Only the file:
// function names are minified and change between builds, and so do line and column. Frames of
// built-in functions ("at JSON.parse (<anonymous>)") have no file and are skipped.
function topFrameFile(stack) {
  if (!stack) return '';
  const lines = stack.split('\n');
  // V8 frames start with "at"; its first line is the message, which may contain anything.
  const isV8 = lines.some((line) => /^\s+at\s/.test(line));
  for (const line of lines) {
    const frame = line.trim();
    if (isV8 ? !frame.startsWith('at ') : !frame.includes('@')) continue;
    // "at fn (url:1:2)", "at url:1:2", "fn@url:1:2", "global code@url:1:2".
    const location = frame.match(
      /(?:\(|@|^at\s)((?:[a-z][a-z0-9+.-]*:\/\/|\/)[^\s)]*?)(?::\d+){0,2}\)?$/i
    );
    if (location) {
      return location[1].replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, '').split(/[?#]/)[0];
    }
  }
  return '';
}

export function fingerprint(report) {
  return createHash('sha1')
    .update(
      `${report.name}\n${normalise(withoutMinifiedNames(report.message))}\n${normalise(topFrameFile(report.stack))}`
    )
    .digest('hex')
    .slice(0, 16);
}

// Errors we can't act on. The browser filters these too (src/utils/clientErrorReporting.ts), but
// reports from the early error script below skip that.
export function isNoise(report) {
  if (/ResizeObserver loop/.test(report.message)) return true;
  if (report.message === 'Script error.' && !report.stack) return true;
  if (/(chrome|moz|safari(-web)?)-extension:\/\//.test(report.stack ?? '')) return true;
  return false;
}

export function isBot(userAgent) {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

export function shortUserAgent(userAgent) {
  return shortString(userAgent, LIMITS.userAgent);
}

const PRIVATE_ADDRESS =
  /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|f[cd][0-9a-f]{2}:|fe80:|unknown$)/i;

// The visitor's address, for rate limiting only (it is not logged). gbif.org sits behind Varnish,
// which keeps the X-Forwarded-For a request arrives with and appends the address it got the
// request from. So the last entry is the visitor, and earlier entries can be made up.
// If something in front of Varnish (say, whatever terminates TLS) doesn't pass the visitor on, the
// last entry is that machine instead, the same for every visitor. Such machines have private
// addresses, and so does a local run without Varnish. Then there is no visitor to limit by:
// undefined, and only the overall limits apply.
export function clientAddress(req) {
  const forwarded = req.get('X-Forwarded-For');
  const last =
    forwarded
      ?.split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .pop() ||
    req.socket?.remoteAddress ||
    'unknown';
  const address = last.replace(/^::ffff:/i, '').replace(/^(\d+\.\d+\.\d+\.\d+):\d+$/, '$1');
  return PRIVATE_ADDRESS.test(address) ? undefined : address;
}

// Browsers mark requests made by another site's page. Such reports could only be made up.
export function isCrossSite(req) {
  return req.get('Sec-Fetch-Site') === 'cross-site';
}

// Caps what gets logged per minute: overall, per visitor so one person can't use up the budget, and
// per fingerprint so one error hitting every visitor can't crowd out the rest. Fixed one-minute
// windows. Only allowed reports are counted per key, so the maps never hold more than perMinute
// entries. Without a client key (see clientAddress) only the other limits apply.
export function createLimiter({
  perMinute = 100,
  perClientPerMinute = 10,
  perFingerprintPerMinute = 5,
  now = Date.now,
} = {}) {
  let windowStart = now();
  let total = 0;
  let dropped = 0;
  let perFingerprint = new Map();
  let perClient = new Map();

  return {
    // Returns { allowed, droppedInLastWindow }. droppedInLastWindow is set once, on the first call
    // in a new window, if the previous window dropped anything.
    take(fingerprintKey, clientKey) {
      let droppedInLastWindow = 0;
      if (now() - windowStart >= 60_000) {
        droppedInLastWindow = dropped;
        windowStart = now();
        total = 0;
        dropped = 0;
        perFingerprint = new Map();
        perClient = new Map();
      }
      const fingerprintCount = perFingerprint.get(fingerprintKey) ?? 0;
      const clientCount = clientKey === undefined ? 0 : (perClient.get(clientKey) ?? 0);
      if (
        total >= perMinute ||
        fingerprintCount >= perFingerprintPerMinute ||
        clientCount >= perClientPerMinute
      ) {
        dropped += 1;
        return { allowed: false, droppedInLastWindow };
      }
      total += 1;
      perFingerprint.set(fingerprintKey, fingerprintCount + 1);
      if (clientKey !== undefined) perClient.set(clientKey, clientCount + 1);
      return { allowed: true, droppedInLastWindow };
    },
  };
}

// Inline at the top of every gbif.org page, before any of the app's code. Errors from before the
// app has started would otherwise go unseen: a module that throws while loading, or one of the
// app's own scripts failing to load (those fire on the script element, not on window, hence the
// capturing listener; only the first is kept, as one failed chunk makes the scripts that import it
// fail too). They are queued for the app's reporter, which takes them over when it starts. If the
// app never starts, this sends them itself after 10 seconds, within the same per-session limit.
// Kept small and in old-style JS: it runs on every page.
export function renderEarlyErrorScript(nonce) {
  const script = `(function () {
  var q = (window.__GBIF_EARLY_ERRORS__ = []);
  var chunkFailed = false;
  function add(source, error) {
    if (window.__GBIF_EARLY_ERRORS__ === q && q.length < 5) q.push({ source: source, error: error });
  }
  addEventListener('error', function (e) { add('window', e.error || e.message); });
  addEventListener('unhandledrejection', function (e) { add('unhandledrejection', e.reason); });
  addEventListener('error', function (e) {
    var t = e.target;
    if (!chunkFailed && t && (t.tagName === 'SCRIPT' || (t.tagName === 'LINK' && t.rel === 'modulepreload'))) {
      chunkFailed = true;
      add('window', { name: 'ChunkLoadError', message: 'Failed to load ' + String(t.src || t.href).split('?')[0] });
    }
  }, true);
  setTimeout(function () {
    if (window.__GBIF_EARLY_ERRORS__ !== q) return;
    window.__GBIF_EARLY_ERRORS__ = null;
    q.forEach(function (item) {
      var e = item.error || {};
      try {
        var sent = Number(sessionStorage.getItem('${SESSION_COUNT_KEY}')) || 0;
        if (sent >= ${MAX_REPORTS_PER_SESSION}) return;
        sessionStorage.setItem('${SESSION_COUNT_KEY}', String(sent + 1));
      } catch (_) {}
      try {
        navigator.sendBeacon('${CLIENT_ERROR_PATH}', JSON.stringify({
          source: item.source,
          name: String(e.name || 'Error'),
          message: String(e.message || e),
          stack: e.stack ? String(e.stack).slice(0, 4000) : undefined,
          path: location.pathname + location.search,
          commit: window.__GBIF_COMMIT__
        }));
      } catch (_) {}
    });
  }, 10000);
})();`;
  return `<script nonce="${nonce}">${script.replace(/\n\s*/g, ' ')}</script>`;
}
