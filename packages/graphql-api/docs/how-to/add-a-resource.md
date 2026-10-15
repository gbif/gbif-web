# How to add a resource or field

A resource is `src/resources/<name>/`: type defs, resolvers, and the data source for the upstream
API. `src/typeDefs.js`, `resolvers.js`, `dataSources.js` merge everything registered in
`src/resources/index.ts`.

**Reference:** `src/resources/dataset/`.

## Add a field to an existing type

1. Add it to the `gql` block in `<name>.type.js`.
2. If the upstream REST response already has it, done; Apollo resolves from the parent.
3. Otherwise add a resolver under the type in `<name>.resolver.js`:
   `Dataset: { foo: (parent, args, { dataSources }) => dataSources.datasetAPI.getFoo(parent.key) }`.
4. New upstream call: a method on the `<name>.source.js` class using `this.get(path, queryString)`.
5. `npm run develop`; query it in the Apollo sandbox.

## Add a resource

1. `src/resources/<name>/`:
   - `<name>.type.js`: `import { gql } from 'graphql-tag'`; `extend type Query { ... }` + new types.
   - `<name>.resolver.js`: `export const Query = { ... }` and one export per type needing field
     resolvers; signature `(parent, args, { dataSources })`.
   - `<name>.source.js`: class extending `QueuedRESTDataSource` (`src/QueuedRESTDataSource.js`);
     `this.baseURL` from the constructor `config` (`config.apiv1`, `config.apiEs`, ...). Copy
     `willSendRequest` from the dataset source to forward headers.
   - `index.js`: `export default { resolver, typeDef: [typeDef], dataSource: { fooAPI } }`.
2. `export { default as foo } from './foo';` in `src/resources/index.ts`.
3. Restart `npm run develop`; check the schema in the sandbox.

## Caveats

- **Data sources are per request.** Export the class, not an instance.
- **Enums come from the live API** (`src/helpers/enums`). New GBIF enum: `npm run write-enums`, never
  hand-typed. Vocabulary values are a separate resource (`src/resources/vocabulary`).
- **Throw `NotFoundError`** (`src/helpers/GraphQL404Error`) for invalid or missing keys so the
  frontend's `throwCriticalErrors` yields a 404.
- **Search sources attach the query** (`response._query = query`); facet and count resolvers read it.
- **`concurrency`** in the `QueuedRESTDataSource` constructor for sources that fan out.
- **Upstream HTML** goes through `getHtml` / `excerpt` (`src/helpers/utils`) before the client.
- **Mixed JS/TS**; match neighbours. Prettier width 120.
- **Tests**: colocated `*.test.js|ts`, `describe`/`it`, `node:assert`, `npm test`. Need the YAML `.env`.
