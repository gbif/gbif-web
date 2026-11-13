// Only used to resolve a path so its origin can be compared. Never a real host.
const BASE = 'https://local.invalid';

/**
 * Turn the request target of an incoming request into a path on this site.
 *
 * The request target is normally a path, but "//evil.com/x" and "/\evil.com/x" are valid ones too,
 * and so is the absolute form "http://evil.com/x" that proxies may pass on. Resolved against our
 * origin, or sent back in a Location header, those all point at another site. Leading slashes and
 * backslashes are collapsed into one slash, so the result always starts with a single "/".
 *
 * @param {string | undefined} target
 * @returns {string}
 */
export function toLocalPath(target) {
  return `/${(target ?? '').replace(/^[/\\]+/, '')}`;
}

/**
 * Return a returnUrl-style value if it is a path on this site, otherwise undefined.
 *
 * Only paths starting with a single "/" are accepted. "//evil.com", "/\evil.com", "https://evil.com"
 * and "javascript:..." are all rejected. The path is returned the way the URL parser reads it, so
 * what is checked is what the browser navigates to.
 *
 * @param {unknown} value
 * @returns {string | undefined}
 */
export function toSafeReturnPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/')) return undefined;
  try {
    const url = new URL(value, BASE);
    // a path like //host would be read as another site by the browser
    if (url.origin !== BASE || /^\/[/\\]/.test(url.pathname)) return undefined;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
}

/**
 * Check a Location the server is about to send. Absolute http(s) URLs are kept, as those are
 * built by our own code (GRSciColl, the status page, gbif.org for disabled pages). Anything else
 * must be a path on this site, otherwise the fallback is used. This catches paths that only become
 * //evil.com once the browser resolves dot segments, like /a/..//evil.com.
 *
 * @param {unknown} location
 * @param {string} [fallback]
 * @returns {string}
 */
export function toSafeLocation(location, fallback = '/') {
  if (typeof location !== 'string') return fallback;
  if (/^https?:\/\//i.test(location)) return location;
  return toSafeReturnPath(location) ?? fallback;
}
