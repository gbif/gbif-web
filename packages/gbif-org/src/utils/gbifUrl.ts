const GBIF_HOSTS = new Set([
  'www.gbif.org',
  'gbif.org',
  'www.gbif-staging.org',
  'gbif-staging.org',
  'www.gbif-uat.org',
  'gbif-uat.org',
  'www.gbif-dev.org',
  'gbif-dev.org',
]);

/**
 * If the URL points at the in-app site (a GBIF host or an already-relative
 * path), return the in-app path. Otherwise return null.
 *
 * Mirrors the `gbifUrlAsRelative` filter from portal16, but does not prepend
 * the locale — DynamicLink/localizeLink handles that.
 */
export function gbifUrlAsRelative(url?: string | null): string | null {
  if (!url) return null;

  // Already a root-relative path — treat as in-app.
  if (url.startsWith('/')) return url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!GBIF_HOSTS.has(parsed.hostname)) return null;

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
