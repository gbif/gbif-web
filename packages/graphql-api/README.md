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
| `npm test` | Run the test suite. |
| `npm run write-enums` | Regenerate the enum type definitions from the GBIF enumeration API. |
| `npm run write-interpretation-remark` | Regenerate interpretation remark definitions. |

## Configuration

Configuration is supplied through the `.env` file in the package root. It defines the upstream endpoints (REST v1/v2, Elasticsearch, translations, image/thumbor, etc.), service credentials, and operational limits. See [`.env.example`](./.env.example) for the full set of options, including:

- **Request pools** (`requestPools`) — per-upstream concurrency limits and timeouts that prevent a slow upstream from stalling the single-process service. See `src/requestPools.ts`.
- **Overload protection** (`overloadProtection`) — a pre-Apollo guard that sheds load with a fast `503` based on event-loop lag and heap usage. See `src/overloadGuard.ts`.

The schema is partly generated at startup from the live GBIF enumeration API, so the service requires network access to its configured upstreams when it boots.

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
