declare global {
  // The commit of the build being served. gbif/server.js sets it on the server and inlines it into
  // each page for the browser, so both report the same commit.
  // eslint-disable-next-line no-var
  var __GBIF_COMMIT__: string | undefined;
}

// The commit this code was built from, sent with requests (and later error reports) so they can be
// tied to a build. On gbif.org it comes from the server, so it is never baked into the JS bundles.
// Hosted portals have no gbif.org server and bake it in at build time (hp/vite.config.ts).
export function getBuildCommit(): string | undefined {
  return globalThis.__GBIF_COMMIT__ || import.meta.env.PUBLIC_GIT_COMMIT || undefined;
}
