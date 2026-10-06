# How to add a resource or field

A resource is one directory under `src/resources/<name>/` that bundles a GraphQL type definition,
its resolvers, and the data source that talks to the upstream API. Everything registered in
`src/resources/index.ts` is merged automatically by `src/typeDefs.js`, `src/resolvers.js`, and
`src/dataSources.js`.

**Reference example to copy:** `src/resources/dataset/`.

## Add a field to an existing type

1. Add the field to the `gql` block in `<name>.type.js`.
2. If the field is already present in the upstream REST response, nothing else is needed; Apollo
   resolves it from the parent object.
3. Otherwise add a resolver in `<name>.resolver.js` under the type name, e.g.
   `Dataset: { foo: (parent, args, { dataSources }) => dataSources.datasetAPI.getFoo(parent.key) }`.
4. If it needs a new upstream call, add a method to the `<name>.source.js` class that uses
   `this.get(path, queryString)`.
5. Start the server (`npm run develop`) and run the query in the Apollo sandbox.

## Add a new resource

1. Create `src/resources/<name>/` with:
   - `<name>.type.js`: `import { gql } from 'graphql-tag'` and a `typeDef` that uses
     `extend type Query { ... }` for root fields plus the new types.
   - `<name>.resolver.js`: `export const Query = { ... }` and one export per type that needs field
     resolvers. Signature is `(parent, args, { dataSources }) => ...`.
   - `<name>.source.js`: a class extending `QueuedRESTDataSource` (`src/QueuedRESTDataSource.js`).
     Set `this.baseURL` from the `config` passed to the constructor (`config.apiv1`, `config.apiEs`,
     ...). Copy `willSendRequest` from the dataset source so request headers (user agent, request
     id, client ip) are forwarded.
   - `index.js`: `export default { resolver, typeDef: [typeDef], dataSource: { fooAPI } }`.
2. Register it: `export { default as foo } from './foo';` in `src/resources/index.ts`.
3. Restart `npm run develop` and check the schema in the sandbox.

## Caveats

- **Data source instances are per request.** Export the class, not an instance, from `index.js`.
  Apollo instantiates it per request so caching and context do not leak between users.
- **Enums come from the live GBIF API.** `src/helpers/enums` builds enum types at startup from the
  enumeration endpoint. To use a new GBIF enum, regenerate with `npm run write-enums` rather than
  typing values by hand. Vocabulary-backed values are a separate resource (`src/resources/vocabulary`).
- **Return `NotFoundError`** (`src/helpers/GraphQL404Error`) for an invalid or missing key so the
  frontend's `throwCriticalErrors` can turn it into a 404.
- **Search endpoints** should attach the original query to the response (`response._query = query`)
  as the dataset source does; facet and count resolvers read it back.
- **Concurrency.** Pass `concurrency` to the `QueuedRESTDataSource` constructor for sources that
  fan out (one search result list resolving many keys) so one operation cannot flood the upstream.
- **HTML in upstream data** must go through `getHtml` / `excerpt` in `src/helpers/utils` so it is
  sanitised before reaching the client.
- **Mixed JS and TS.** Match the language of the neighbouring files. Prettier width is 120 here.
- **Tests** are colocated `*.test.js|ts` with `describe`/`it` and `node:assert`, run by `npm test`.
  They need a YAML `.env` (see `.env.example`) because `src/config.js` reads it at import.
