const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'ftp:']);

// Only used to resolve relative URLs so we can read their protocol. A relative
// URL inherits the page's protocol, which is always http(s) on our sites.
const BASE = 'https://www.gbif.org';

/**
 * Returns the URL if it is safe to use as a link target, otherwise undefined.
 *
 * Safe means http:, https:, mailto: or ftp:, or a relative URL. Anything else
 * (javascript:, data:, vbscript: and so on) is dropped, as React still renders
 * those and they run script when clicked. Use this for any href that comes
 * from publishers, users or other data we don't control.
 */
export function safeHref(url?: string | null): string | undefined {
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (trimmed === '') return undefined;

  try {
    // The URL parser ignores the same leading control characters, tabs and
    // newlines that browsers do, so "java\nscript:" is caught here too.
    const { protocol } = new URL(trimmed, BASE);
    return ALLOWED_PROTOCOLS.has(protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}
