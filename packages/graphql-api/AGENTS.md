# graphql-api

Express + Apollo in front of the GBIF REST APIs and es-api. `nvm use` and `npm install` here.

| Command | Use |
|---|---|
| `npm run develop` | `tsx watch src/index.ts` |
| `npm test` | ts-mocha, colocated `src/**/*.test.{js,ts}` |
| `npm run build` | `tsc` + alias rewrite to `dist/` |
| `npm run write-enums` | regenerate `src/helpers/enums/enums.json` from the GBIF API |

## Task guides

- `docs/how-to/add-a-resource.md`: field, type, or whole resource.
- `../gbif-org/docs/how-to/add-an-occurrence-filter.md`: occurrence facet or filter. Predicates pass
  through this package unchanged; only facet, cardinality, and stats fields are listed here
  (`src/resources/occurrence/helpers/fields/`).

## Resource pattern

- `src/index.ts` wires the server. `typeDefs.js`, `resolvers.js`, `dataSources.js` aggregate what
  `src/resources/index.ts` registers.
- One directory per resource, `src/resources/<name>/`. Reference: `src/resources/dataset/`.
  `<name>.type.js` (gql, `extend type Query`), `<name>.resolver.js` (exports `Query` and per-type
  resolvers using `dataSources`), `<name>.source.js` (class extending `QueuedRESTDataSource`),
  `index.js` exporting `{ resolver, typeDef: [...], dataSource: {...} }`.
- `src/api-utils/`: plain REST controllers (maps, geometry, blast), not GraphQL.
- Mixed JS and TS, `@/` alias. Match the file you are in.

## Gotchas

- `.env` is **YAML** (`.env.example`), read synchronously by `src/config.js` at import. Tests need it.
- Startup fetches enumerations from the live GBIF API; booting needs network.
- Prettier width 120, trailing commas everywhere (differs from gbif-org). ESLint airbnb + prettier.
- Tests: `describe`/`it` with `node:assert`, colocated.
