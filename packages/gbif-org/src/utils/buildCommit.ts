declare global {
  // The commit of the build being served. gbif/server.js sets it on the server and inlines it into
  // each page for the browser, so both report the same commit.
  // eslint-disable-next-line no-var
  var __GBIF_COMMIT__: string | undefined;
}

// The commit gbif.org is running, sent with requests (and later error reports) so they can be tied
// to a build. Undefined on hosted portals: baking the commit into their bundle would make visitors
// download most of it again after every deploy.
export function getBuildCommit(): string | undefined {
  return globalThis.__GBIF_COMMIT__ || undefined;
}
