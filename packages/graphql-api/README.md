# GraphQL API

A GraphQL layer over the GBIF REST and Elasticsearch APIs. It composes and resolves data from the underlying GBIF services into a single, typed graph that powers gbif.org and the hosted portals.

> **Note:** This is not a stable, public API and is not intended for use in production systems outside of GBIF Secretariat.

## Requirements

- Node.js `>=20` (see [`.nvmrc`](./.nvmrc)). Node versions are managed with [nvm](https://github.com/nvm-sh/nvm) — run `nvm use` to switch to the required version.
- A running [es-api](https://github.com/gbif/gbif-web/tree/master/packages/es-api), either locally or a deployed instance, that the service can point to.

## Quick start

1. Place an `.env` file in the package root. The canonical configuration lives in `gbif-configuration/gbif-web`, and [`.env.example`](./.env.example) documents the available settings.

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server (watch mode):

   ```sh
   npm run develop
   ```

Once running, the server is available at `http://localhost:<port>/graphql` (the port is configured in your `.env`). Opening that URL in a browser serves a self-hosted GraphiQL sandbox for exploring the schema and running queries.

## Scripts

| Script | Description |
| --- | --- |
| `npm run develop` | Start the server in watch mode for local development. |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm start` | Run the compiled server from `dist/`. |
| `npm test` | Run the test suite with ts-mocha. Needs a `.env` file (see [Configuration](#configuration)). |
| `npm run write-enums` | Regenerate `src/helpers/enums/enums.json` from the GBIF enumeration API. |
| `npm run write-interpretation-remark` | Regenerate interpretation remark definitions. |
| `npx tsx tools/printSchema.ts <file>` | Write the schema in this repository to a file as SDL. Used by the schema drift check in gbif-org (`npm run e2e:schema-drift`). |

## Code layout

The server is built with Express and Apollo Server. The code is a mix of JavaScript and TypeScript,
with `@/` as an alias for `src/`.

- `src/index.ts` sets up the server. `typeDefs.js`, `resolvers.js` and `dataSources.js` collect
  everything registered in `src/resources/index.ts`.
- Each resource has its own folder, `src/resources/<name>/`; `src/resources/dataset/` is a good
  example to follow. A resource folder usually contains:
  - `<name>.type.js`: the GraphQL type definitions, extending `Query`.
  - `<name>.resolver.js`: the `Query` resolvers and any per-type resolvers, which fetch data
    through `dataSources`.
  - `<name>.source.js`: a data source class extending `QueuedRESTDataSource`.
  - `index.js`: exports `{ resolver, typeDef: [...], dataSource: {...} }`.
- `src/api-utils/` holds a few plain REST endpoints (maps, geometry, BLAST) that are not part of
  the GraphQL schema.
- Tests sit next to the code they test (`*.test.js` / `*.test.ts`) and use `describe`/`it` with
  `node:assert`.
- Formatting uses Prettier with a line width of 120 and trailing commas, which differs from
  gbif-org. ESLint uses the Airbnb configuration.

For a step-by-step walkthrough, see [Add a resource](docs/how-to/add-a-resource.md). Adding an
occurrence filter is covered in
[Add an occurrence search filter](../gbif-org/docs/how-to/add-an-occurrence-filter.md). Occurrence
predicates pass through this package unchanged; only the fields used for facets, cardinality and
statistics are listed here, in `src/resources/occurrence/helpers/fields/`.

## Configuration

Configuration is supplied through the `.env` file in the package root. It defines the upstream endpoints (REST v1/v2, Elasticsearch, translations, image/thumbor, etc.), service credentials, and operational limits. See [`.env.example`](./.env.example) for the full set of options, including:

- **Request pools** (`requestPools`) — per-upstream concurrency limits and timeouts that prevent a slow upstream from stalling the single-process service. See `src/requestPools.ts`.
- **Overload protection** (`overloadProtection`) — a pre-Apollo guard that sheds load with a fast `503` based on event-loop lag and heap usage. See `src/overloadGuard.ts`.

The schema is partly generated at startup from the live GBIF enumeration API, so the service requires network access to its configured upstreams when it boots.

Despite its name, the `.env` file is YAML. It is read by `src/config.js` as soon as that module is imported, so the tests need it too.

If you don't have access to the private configuration, you can run against the production endpoints as described in [Run locally](../gbif-org/docs/how-to/run-locally.md). Fields backed by Elasticsearch will then return 403 errors: `hp-search.gbif.org` is public, but the `apiEsKey` secret is missing.

## Translation of resources (Contentful data)

To translate content sourced from Contentful, send an HTTP header named `locale` with the desired language code. Supported languages and their fallbacks:

| Language | Code | Fallback |
| --- | --- | --- |
| U.K. English (default) | `en-GB` | none |
| Russian | `ru` | `en-GB` |
| Spanish | `es` | `en-GB` |
| Arabic | `ar` | `en-GB` |
| French | `fr` | `en-GB` |
| Portuguese | `pt` | `en-GB` |
| Chinese (Simplified) | `zh-Hans` | `en-GB` |
| Dutch | `nl` | `en-GB` |
| Chinese (Traditional) | `zh-Hant` | `en-GB` |
| Japanese | `ja` | `en-GB` |
| Korean | `ko` | `en-GB` |
| Ukrainian | `uk` | `en-GB` |
| Polish | `pl` | `en-GB` |

## Docker

Docker images can be built and published to docker hub using the following command
```
docker buildx build . --push --platform linux/amd64,linux/arm64 --tag "$DOCKER_HUB_ORG/graphql-api:$(git rev-parse --short HEAD)"
```

To run use:
```
docker run -p 4000:4000 --mount type=bind,source="$(pwd)"/.env,target=/usr/src/.env -d <DOCKER_HUB_OR_OR_USER>/graphql-api
```

## License

Apache 2.0. See [LICENSE](./LICENSE).
