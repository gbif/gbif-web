# graphql-api

GraphQL server (Express + Apollo) in front of the GBIF REST APIs and es-api. gbif-org loads
nearly all its data from here. Run `nvm use` and `npm install` here, not at the repo root.

## Commands

| Command | Use |
|---|---|
| `npm run develop` | `tsx watch src/index.ts` |
| `npm test` | ts-mocha over colocated `src/**/*.test.{js,ts}` |
| `npm run build` | `tsc` plus path-alias rewrite into `dist/` |

## Layout and the resource pattern

- `src/index.ts` wires Express and Apollo. `src/typeDefs.js`, `src/resolvers.js`, and
  `src/dataSources.js` aggregate everything registered in `src/resources/index.ts`.
- One directory per resource under `src/resources/<name>/`. Reference: `src/resources/dataset/`.
  - `<name>.type.js`: `gql` type defs, extending `Query` where needed.
  - `<name>.resolver.js`: exports `Query` and per-type field resolvers that call `dataSources`.
  - `<name>.source.js`: a class extending `QueuedRESTDataSource` (`src/QueuedRESTDataSource.js`),
    one method per upstream endpoint.
  - `index.js`: exports `{ resolver, typeDef: [...], dataSource: {...} }`.
- Adding a resource means creating that directory and registering it in `src/resources/index.ts`.
- `src/api-utils/` holds plain REST controllers (maps, geometry, blast) that are not GraphQL.
- Code is mixed JS and TS with the `@/` alias. Match the language of the file you are in.

## Gotchas

- `.env` is **YAML**, not `KEY=VALUE`. See `.env.example`. `src/config.js` reads it synchronously at
  import, so tests fail without one.
- At startup the server fetches enumerations from the live GBIF API to build part of the schema,
  so booting needs network access.
- Prettier here is width 120 with trailing commas everywhere, which differs from gbif-org. ESLint is
  airbnb plus prettier (`.eslintrc`).
- Tests use `describe`/`it` with `node:assert`. Keep them colocated.
