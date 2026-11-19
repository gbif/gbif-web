// Defaults are GBIF's production endpoints, the same ones gbif.org uses.
export const config = {
  userAgent: 'gbif-mcp (+https://github.com/gbif/gbif-web)',
  graphqlUrl: process.env.GBIF_GRAPHQL_URL ?? 'https://graphql.gbif.org/graphql',
  apiUrl: process.env.GBIF_API_URL ?? 'https://api.gbif.org',
  siteUrl: 'https://www.gbif.org',
  /** The checklist GBIF's occurrence search uses when none is given (the GBIF Backbone). */
  defaultChecklistKey: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  /** Hard cap on sample records returned to the model. */
  maxSample: 20,
  timeoutMs: 20_000,
};
