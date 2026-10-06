# es-api

REST wrapper around the GBIF Elasticsearch indices, consumed by graphql-api. GET API shaped like
GBIF API v1 plus a POST API taking the occurrence-download predicate structure.

- Needs the **GBIF VPN**. Cannot run here; verify by reading code and `node --check`.
- `npm start` runs `src/index.js` under nodemon. `.env` not in repo (`README.md`).
- Layout: `src/resources/<index>/`, `requestAdapter/` (params and predicates to ES queries),
  `responseAdapter/` (ES hits to API v1 shape). Plain JavaScript.
- Occurrence predicates are **not validated here**: `src/resources/occurrence/index.js` normalises
  keys to UPPER_SNAKE and posts to API v1 `/occurrence/search/predicate/toesquery`. The field list in
  `occurrence.config.js` governs GET params, facets, and cardinality only. Adding a field:
  `../gbif-org/docs/how-to/add-an-occurrence-filter.md`.
