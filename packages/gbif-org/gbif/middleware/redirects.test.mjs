import { describe, expect, it } from 'vitest';
import { createGetPostRenderRedirect, createGetPreRenderRedirect } from './redirects.mjs';

// Drives the real factory against the real redirect table (redirects.json + newRedirects).
// Focus: the query-param redirect path that the findQueryParamRedirect optimization touches,
// plus regression guards for the path-only and no-redirect branches.
const getPostRenderRedirect = createGetPostRenderRedirect({});

// getPostRenderRedirect reads req.originalUrl (path/query split) and req.url (legacy query casing
// fixup). res is only used on branches not exercised here, so a bare object is enough.
const run = (originalUrl) =>
  getPostRenderRedirect({ originalUrl, url: originalUrl, method: 'GET' }, {});

describe('getPostRenderRedirect — query-param redirects', () => {
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

describe('getPostRenderRedirect — non-query paths (regression guards)', () => {
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

// 302 to the GRSciColl hosted portal with path and query preserved, except the bare prefix which
// goes to /about (it used to serve an article whose replacement lives there).
// See https://github.com/gbif/gbif-web/issues/1906
describe('getPreRenderRedirect — GRSciColl moved to its own domain', () => {
  const grscicoll = 'https://scientific-collections.gbif.org';
  const getPreRenderRedirect = createGetPreRenderRedirect({ PUBLIC_GRSCICOLL: grscicoll });
  const runPreRender = (originalUrl) => getPreRenderRedirect({ originalUrl });

  it('redirects the bare prefix to the about page', () => {
    expect(runPreRender('/grscicoll')).toBe(`${grscicoll}/about`);
    expect(runPreRender('/grscicoll/')).toBe(`${grscicoll}/about`);
  });

  it('preserves the remaining path', () => {
    expect(runPreRender('/grscicoll/institution/d15fbdb2-1752-49d6-97aa-aef95b28a2d4')).toBe(
      `${grscicoll}/institution/d15fbdb2-1752-49d6-97aa-aef95b28a2d4`
    );
  });

  it('preserves the query string', () => {
    expect(runPreRender('/grscicoll/collection/search?q=test&country=DK')).toBe(
      `${grscicoll}/collection/search?q=test&country=DK`
    );
  });

  it('keeps locales that exist on the target site', () => {
    expect(runPreRender('/es/grscicoll/institution/search')).toBe(
      `${grscicoll}/es/institution/search`
    );
    expect(runPreRender('/es/grscicoll')).toBe(`${grscicoll}/es/about`);
  });

  it('drops locales the target site does not have', () => {
    expect(runPreRender('/fr/grscicoll/collection/search')).toBe(`${grscicoll}/collection/search`);
    expect(runPreRender('/en/grscicoll')).toBe(`${grscicoll}/about`);
  });

  it('does not match other paths', () => {
    expect(runPreRender('/grscicollections')).toBeUndefined();
    expect(runPreRender('/occurrence/search')).toBeUndefined();
    expect(runPreRender('/')).toBeUndefined();
  });

  it('is disabled when the target domain is not configured', () => {
    const noEnv = createGetPreRenderRedirect({});
    expect(noEnv({ originalUrl: '/grscicoll' })).toBeUndefined();
  });
});
