import { describe, expect, it } from 'vitest';
import createGetRedirect from './redirects.mjs';

// Drives the real factory against the real redirect table (redirects.json + newRedirects).
// Focus: the query-param redirect path that the findQueryParamRedirect optimization touches,
// plus regression guards for the path-only and no-redirect branches.
const getRedirect = createGetRedirect({});

// getRedirect reads req.originalUrl (path/query split) and req.url (legacy query casing fixup).
// res is only used on branches not exercised here, so a bare object is enough.
const run = (originalUrl) => getRedirect({ originalUrl, url: originalUrl, method: 'GET' }, {});

describe('getRedirect — query-param redirects', () => {
  it('resolves a query-param redirect and forces it', () => {
    expect(run('/resource/search?contentType=literature')).toEqual({
      redirectTo: '/literature/search',
      force: true,
    });
  });

  it('keeps unmatched query params and merges them onto the target', () => {
    expect(run('/resource/search?contentType=literature&q=birds')).toEqual({
      redirectTo: '/literature/search?q=birds',
      force: true,
    });
  });

  it('preserves the locale prefix on the redirect target', () => {
    expect(run('/fr/resource/search?contentType=literature')).toEqual({
      redirectTo: '/fr/literature/search',
      force: true,
    });
  });

  it('picks the correct candidate when many query redirects share a path (first-match)', () => {
    // /orc/?doc_id=* are 362 entries all under the same path "/orc/"; the index must still
    // return the entry whose params actually match, not merely the first under that path.
    expect(run('/orc/?doc_id=1205')).toEqual({
      redirectTo: '/document/80499/_redirect',
      force: true,
    });
    expect(run('/orc/?doc_id=1212')).toEqual({
      redirectTo: '/document/80502/_redirect',
      force: true,
    });
  });
});

describe('getRedirect — non-query paths (regression guards)', () => {
  it('still serves a path-only redirect (not via the query index)', () => {
    expect(run('/governance/governing-board')).toEqual({
      redirectTo: '/governance',
      force: false,
    });
  });

  it('returns no redirect for a hot path with no match', () => {
    expect(run('/taxon/123')).toEqual({ redirectTo: undefined, force: false });
  });
});
