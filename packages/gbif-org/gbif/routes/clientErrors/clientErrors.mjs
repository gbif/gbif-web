import { createHash } from 'node:crypto';

// Errors reported by browsers on gbif.org (see src/utils/clientErrorReporting.ts), logged so they
// end up in Kibana next to the server logs. The endpoint is public and unauthenticated, so it only
// accepts a fixed set of short fields, and the number of reports logged is capped.

export const CLIENT_ERROR_PATH = '/api/client-error';
export const MAX_BODY_SIZE = '16kb';

const SOURCES = new Set(['window', 'unhandledrejection', 'recoverable', 'boundary', 'route']);
const LIMITS = {
  name: 100,
  message: 1000,
  stack: 4000,
  componentStack: 2000,
  path: 500,
  graphQLError: 200,
};
const MAX_GRAPHQL_ERRORS = 5;
const COMMIT_PATTERN = /^[0-9a-f]{7,40}$/i;
// Crawlers and headless browsers (including our own e2e tests) are not users.
const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime/i;

function shortString(value, max) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

// The report as logged, or null if it isn't one. Unknown fields are dropped.
export function parseReport(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const message = shortString(body.message, LIMITS.message);
  if (!message || !SOURCES.has(body.source)) return null;

  // Only the path: query strings can hold tokens, search terms or other personal data.
  const path = shortString(body.path, LIMITS.path)?.split(/[?#]/)[0];
  const commit = typeof body.commit === 'string' && COMMIT_PATTERN.test(body.commit);
  const graphQLErrors = Array.isArray(body.graphQLErrors)
    ? body.graphQLErrors
        .slice(0, MAX_GRAPHQL_ERRORS)
        .map((error) => shortString(error, LIMITS.graphQLError))
        .filter(Boolean)
    : [];

  return {
    source: body.source,
    name: shortString(body.name, LIMITS.name) ?? 'Error',
    message,
    stack: shortString(body.stack, LIMITS.stack),
    componentStack: shortString(body.componentStack, LIMITS.componentStack),
    graphQLErrors: graphQLErrors.length ? graphQLErrors : undefined,
    path: path?.startsWith('/') ? path : undefined,
    commit: commit ? body.commit : undefined,
  };
}

// Strip what differs between builds and occurrences of the same error, so it groups in Kibana:
// content hashes in chunk names, line:column positions, query strings, and numbers in messages.
function normalise(text) {
  return text
    .replace(/-[A-Za-z0-9_-]{8}\.(m?js|css)/g, '.$1')
    .replace(/\?[^\s)]*/g, '')
    .replace(/:\d+:\d+/g, '')
    .replace(/\b\d+\b/g, '#');
}

function topFrame(stack) {
  if (!stack) return '';
  // V8 ("    at fn (url:1:2)") and Firefox/Safari ("fn@url:1:2") frames.
  const frame = stack
    .split('\n')
    .find((line) => /^\s+at\s/.test(line) || /^[^\s@]*@\S+:\d+:\d+$/.test(line.trim()));
  return frame ? frame.trim() : '';
}

export function fingerprint(report) {
  return createHash('sha1')
    .update(`${report.name}\n${normalise(report.message)}\n${normalise(topFrame(report.stack))}`)
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

// Caps what gets logged per minute: overall, and per fingerprint so one error hitting every visitor
// can't crowd out the rest. Fixed one-minute windows; counts only, so memory stays small.
export function createLimiter({
  perMinute = 100,
  perFingerprintPerMinute = 5,
  now = Date.now,
} = {}) {
  let windowStart = now();
  let total = 0;
  let dropped = 0;
  let perFingerprint = new Map();

  return {
    // Returns { allowed, droppedInLastWindow }. droppedInLastWindow is set once, on the first call
    // in a new window, if the previous window dropped anything.
    take(key) {
      let droppedInLastWindow = 0;
      if (now() - windowStart >= 60_000) {
        droppedInLastWindow = dropped;
        windowStart = now();
        total = 0;
        dropped = 0;
        perFingerprint = new Map();
      }
      const count = perFingerprint.get(key) ?? 0;
      if (total >= perMinute || count >= perFingerprintPerMinute) {
        dropped += 1;
        return { allowed: false, droppedInLastWindow };
      }
      total += 1;
      perFingerprint.set(key, count + 1);
      return { allowed: true, droppedInLastWindow };
    },
  };
}

// Inline at the top of every gbif.org page, before any of the app's code. Errors thrown before the
// app has started (a module that throws while loading, say) would otherwise go unseen. They are
// queued for the app's reporter, which takes them over when it starts. If the app never starts,
// this sends them itself after 10 seconds. Kept small and in old-style JS: it runs on every page.
export function renderEarlyErrorScript(nonce) {
  const script = `(function () {
  var q = (window.__GBIF_EARLY_ERRORS__ = []);
  function add(source, error) {
    if (window.__GBIF_EARLY_ERRORS__ === q && q.length < 5) q.push({ source: source, error: error });
  }
  addEventListener('error', function (e) { add('window', e.error || e.message); });
  addEventListener('unhandledrejection', function (e) { add('unhandledrejection', e.reason); });
  setTimeout(function () {
    if (window.__GBIF_EARLY_ERRORS__ !== q) return;
    window.__GBIF_EARLY_ERRORS__ = null;
    q.forEach(function (item) {
      var e = item.error || {};
      try {
        navigator.sendBeacon('${CLIENT_ERROR_PATH}', JSON.stringify({
          source: item.source,
          name: String(e.name || 'Error'),
          message: String(e.message || e),
          stack: e.stack ? String(e.stack).slice(0, 4000) : undefined,
          path: location.pathname,
          commit: window.__GBIF_COMMIT__
        }));
      } catch (_) {}
    });
  }, 10000);
})();`;
  return `<script nonce="${nonce}">${script.replace(/\n\s*/g, ' ')}</script>`;
}
