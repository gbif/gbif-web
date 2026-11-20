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
  // Together with the rest, this keeps a logged report under about 8 KB.
  stack: 3000,
  componentStack: 1500,
  path: 500,
  graphQLError: 200,
  userAgent: 300,
};
const MAX_GRAPHQL_ERRORS = 5;
const COMMIT_PATTERN = /^[0-9a-f]{7,40}$/i;
// Crawlers and headless browsers (including our own e2e tests) are not users.
const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime/i;
// Parameter names whose values are secrets or identify someone: names containing token, secret,
// password, signature, apikey, email, session and the like (accessToken, userEmail,
// password_confirmation, x-api-key), and a few exact names. Exact only for code, state and key, as
// names that merely contain them are GBIF filters (institutionCode, stateProvince, datasetKey).
// Everything else (filters, the search text) is kept: it is what the visitor was looking at when
// the error happened. `code` is blanked although institution and collection search use it as a
// filter: it is also the one-time code in account confirmation and password links (/user/...).
// The parts around a secret word are bounded so the pattern stays linear on hostile input.
const SECRET_NAME =
  '[\\w.-]{0,40}?(?:token|secret|passw(?:or)?d|pwd|signature|api[_-]?key|access[_-]?key|private[_-]?key|e?mail|session|jwt|otp|credential|ticket|nonce)[\\w.-]{0,40}|code|state|key|auth|authorization|sid|sig|pass|username|user_name';
// A secret name=value pair in a query string or fragment, wherever it is: in the page URL, in a URL
// in a message or stack (nested in another URL's parameter too). The value ends where the parameter
// or the URL does. A stack frame's line and column (":12:34" right before ")" or the end of a line)
// are kept; both must be there, so the end of a value such as "12:30" is not mistaken for one.
const SECRET_PARAM = new RegExp(
  `(?<=[?&;#])(${SECRET_NAME})(\\[[^\\]=&]*\\]|%5B[^=&]*?%5D)?=[^&;#\\s"<>()\\[\\]]*?((?::\\d+){2}(?=[)\\n]|$))?(?=[&;#\\s"<>()\\[\\]]|$)`,
  'gi'
);
// The same, URL-encoded once or twice (a URL inside another URL's parameter): "%3Ftoken%3Dabc",
// "%253Ftoken%253Dabc". The value runs to the next encoded separator.
const SECRET_PARAM_ENCODED = new RegExp(
  `(?<=%(?:25)?(?:3F|26|23|3B))(${SECRET_NAME})((?:%(?:25)?5B.*?%(?:25)?5D)?)(%(?:25)?3D)(?:(?!%(?:25)?(?:26|23|3B))[^&;#\\s"<>])*`,
  'gi'
);
// Secrets and personal data outside URLs. Credentials are long: "The Basic Plan" stays.
const BEARER_TOKEN = /\b(Bearer|Basic)\s+[\w~+/.=-]{16,}/gi;
const JWT = /\beyJ[\w-]+\.[\w-]+\.[\w-]*/g;
// An email address, also with the @ URL-encoded (%40, as URLSearchParams writes it, or %2540). The
// domain ends in letters, so package versions (react-dom@18.2.0) and Firefox or Safari stack frames
// ("fn@https://...") are not taken for one. Parts are bounded to keep the pattern linear.
const EMAIL = /[\w.+-]{1,64}(?:@|%(?:25)?40)[\w-]{1,63}(?:\.[\w-]{1,63}){0,8}\.[a-z]{2,24}\b/gi;

export function shortString(value, max) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

// "?taxonKey=1&token=abc" -> "?taxonKey=1&token=…", and the same for tokens and email addresses
// elsewhere in the text.
function redactSecrets(text) {
  return text
    ?.replace(
      SECRET_PARAM,
      (match, name, brackets, position) => `${name}${brackets ?? ''}=…${position ?? ''}`
    )
    .replace(
      SECRET_PARAM_ENCODED,
      (match, name, brackets, equals) => `${name}${brackets}${equals}…`
    )
    .replace(BEARER_TOKEN, '$1 …')
    .replace(JWT, '…')
    .replace(EMAIL, '…@…');
}

// The report as logged, or null if it isn't one. Unknown fields are dropped.
export function parseReport(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const message = redactSecrets(shortString(body.message, LIMITS.message));
  if (!message || !SOURCES.has(body.source)) return null;

  const path = redactSecrets(shortString(body.path, LIMITS.path));
  const commit = typeof body.commit === 'string' && COMMIT_PATTERN.test(body.commit);
  const graphQLErrors = Array.isArray(body.graphQLErrors)
    ? body.graphQLErrors
        .slice(0, MAX_GRAPHQL_ERRORS)
        .map((error) => redactSecrets(shortString(error, LIMITS.graphQLError)))
        .filter(Boolean)
    : [];

  return {
    source: body.source,
    name: shortString(body.name, LIMITS.name) ?? 'Error',
    message,
    stack: redactSecrets(shortString(body.stack, LIMITS.stack)),
    componentStack: shortString(body.componentStack, LIMITS.componentStack),
    graphQLErrors: graphQLErrors.length ? graphQLErrors : undefined,
    // A path on this site. "//x" (a visit to https://www.gbif.org//x) is logged as "/x", so it can't
    // read as a link to another site.
    path: path?.startsWith('/') ? path.replace(/^\/+/, '/') : undefined,
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
// messages name one, so the same error groups across deploys. Names that are not minified, such as
// the property in "reading 'map'", stay: they say which error it is.
const MINIFIED = '[\\w$]{1,3}';
const MINIFIED_NAME_PATTERNS = [
  // "Ab is not a function", "Ab.default is not a function" (Chrome, Firefox, Safari).
  [
    new RegExp(
      `^${MINIFIED}(?=(\\.[\\w$]+)* is not (a function|a constructor|defined|iterable)\\b)`
    ),
    '…',
  ],
  // "(0 , Ab.default) is not a function" (Chrome, for an imported function).
  [new RegExp(`^\\(0\\s*,\\s*${MINIFIED}\\.`), '(0 , ….'],
  // Safari's addition: "(In 'Ab(t)', 'Ab' is undefined)".
  [/\(In '[^']*', '[^']*' is (undefined|null)\)/, '(In …)'],
  // "Cannot access 'Xk' before initialization" (Chrome), "can't access lexical declaration 'Xk'
  // before initialization" (Firefox).
  [new RegExp(`'${MINIFIED}' before initialization`), "'…' before initialization"],
  // "Can't find variable: Ab" (Safari).
  [new RegExp(`^Can't find variable: ${MINIFIED}$`), "Can't find variable: …"],
  // "can't access property "map", e is undefined" (Firefox): the object is a minified expression.
  [/(can't access property "[^"]*"), [\w$.]+ is (undefined|null)/, '$1, … is $2'],
  // "undefined is not an object (evaluating 'e.data.map')" (Safari): keep the property, not the
  // minified object.
  [
    /\(evaluating '([^']*)'\)/,
    (match, expression) =>
      `(evaluating '…${expression.includes('.') ? expression.slice(expression.lastIndexOf('.')) : ''}')`,
  ],
];

function withoutMinifiedNames(message) {
  return MINIFIED_NAME_PATTERNS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    message
  );
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
  if (PRIVATE_ADDRESS.test(address)) return undefined;
  return address.includes(':') ? ipv6Network(address) : address;
}

// One IPv6 connection usually has a whole /64 network to itself, so a visitor could pick a new
// address for every request. Count the network: the first four groups.
function ipv6Network(address) {
  const [head, tail] = address.replace(/^\[|\](:\d+)?$/g, '').split('::');
  const headGroups = head ? head.split(':') : [];
  const tailGroups = tail !== undefined && tail !== '' ? tail.split(':') : [];
  const missing = Math.max(0, 8 - headGroups.length - tailGroups.length);
  const groups = [...headGroups, ...Array(missing).fill('0'), ...tailGroups];
  return `${groups
    .slice(0, 4)
    .map((group) => group.toLowerCase().replace(/^0+(?=.)/, ''))
    .join(':')}::/64`;
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
  // Browsers send at most MAX_REPORTS_PER_SESSION per session; more than this is not a visitor.
  perClientPerMinute = 3,
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
// capturing listener). Only the app's own chunks count (other sites' scripts, such as the status
// page widget, are blocked by many ad blockers), and only the first, as one failed chunk makes the
// scripts that import it fail too.
// The errors are queued for the app's reporter, which takes them over when it starts. Until then
// this sends them itself, within the same per-session limit: after 10 seconds, or when the visitor
// leaves the page, which is what someone on a page whose app never started does. It keeps
// listening after sending, until the app takes over. Kept small and in old-style JS: it runs on
// every page.
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
    var url = t && (t.tagName === 'SCRIPT' || (t.tagName === 'LINK' && t.rel === 'modulepreload')) ? String(t.src || t.href) : '';
    if (!chunkFailed && url.indexOf(location.origin + '/assets/') === 0) {
      chunkFailed = true;
      add('window', { name: 'ChunkLoadError', message: 'Failed to load ' + url.split('?')[0] });
    }
  }, true);
  function flush() {
    if (window.__GBIF_EARLY_ERRORS__ !== q) return;
    q.splice(0).forEach(function (item) {
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
  }
  setTimeout(flush, 10000);
  addEventListener('pagehide', flush);
})();`;
  return `<script nonce="${nonce}">${script.replace(/\n\s*/g, ' ')}</script>`;
}
