const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'ftp:']);

// Only used to resolve relative URLs so we can read their protocol.
const BASE = 'https://www.gbif.org';

// Keys in CMS content that hold link targets: url, link, href, alias and names ending in them
// (primaryUrl, urlAlias, ...). urlAlias is used as a link target in gbif-org.
const URL_KEY = /(url|link|href|alias)$/i;

/**
 * Returns the URL if it is safe to use as a link target, otherwise undefined.
 * Safe means http:, https:, mailto: or ftp:, or a relative URL. Anything else
 * (javascript:, data:, vbscript: and so on) is dropped. Mirrors safeHref in gbif-org.
 */
export function safeUrl(url) {
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (trimmed === '') return undefined;
  try {
    // The WHATWG parser ignores leading control characters and tabs/newlines the way browsers do.
    const { protocol } = new URL(trimmed, BASE);
    return ALLOWED_PROTOCOLS.has(protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

export function isUrlKey(key) {
  return URL_KEY.test(key);
}

/**
 * For string values stored under URL-like keys: returns the safe URL, or an
 * empty string when it isn't safe. An empty string rather than null, because
 * several of these fields are non-nullable in the schema (Link.url: String!).
 */
export function sanitizeUrlField(key, value) {
  if (typeof value !== 'string' || !isUrlKey(key)) return value;
  return safeUrl(value) ?? '';
}
