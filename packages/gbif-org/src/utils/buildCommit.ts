declare global {
  // The commit of the build being served. gbif/server.js sets it on the server and inlines it into
  // each page for the browser, so both report the same commit.
  // eslint-disable-next-line no-var
  var __GBIF_COMMIT__: string | undefined;
}

// Baked in by hp/vite.config.ts for hosted portals only. Not defined in the gbif.org builds, so the
// commit never ends up in their bundles (that would re-hash every chunk on every commit).
declare const __HP_BUILD_COMMIT__: string | undefined;

// The commit this code was built from, sent with requests (and later error reports) so they can be
// tied to a build.
export function getBuildCommit(): string | undefined {
  if (globalThis.__GBIF_COMMIT__) return globalThis.__GBIF_COMMIT__;
  if (typeof __HP_BUILD_COMMIT__ !== 'undefined' && __HP_BUILD_COMMIT__) return __HP_BUILD_COMMIT__;
  return undefined;
}
