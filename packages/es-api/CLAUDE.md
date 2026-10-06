# es-api

Thin REST wrapper around the GBIF Elasticsearch indices, consumed by graphql-api. Exposes a GET API
shaped like GBIF API v1 and a POST API that takes the occurrence-download predicate structure.

- Needs the **GBIF VPN** to reach Elasticsearch. It cannot be run or integration-tested from an
  unprivileged environment; limit verification to reading code and `node --check`.
- `npm start` runs `src/index.js` under nodemon. `.env` is not in the repo (see `README.md`).
- Layout: `src/resources/` per index, with `requestAdapter/` translating query params and predicates
  into ES queries and `responseAdapter/` reducing ES hits toward the API v1 shape.
- Plain JavaScript, no TypeScript.
- Occurrence predicates are not validated here. `src/resources/occurrence/index.js` normalises keys
  to UPPER_SNAKE and posts them to API v1 `/occurrence/search/predicate/toesquery`. The field list
  in `occurrence.config.js` governs GET params, facets, and cardinality only. For adding a field see
  `../gbif-org/docs/how-to/add-an-occurrence-filter.md`.
