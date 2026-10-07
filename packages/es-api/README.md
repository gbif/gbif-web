# Elasticsearch API wrapper

A wrapper around the GBIF Elasticsearch indices. It exposes an index through a GET API similar to GBIF API v1, plus a POST API that uses the predicate structure from the GBIF occurrence download API. The response format differs from the underlying APIs — results are mapped through a reducer into a shape closer to API v1.

> **Note:** This project does not use the public GBIF APIs. Running it requires access to the GBIF VPN to reach the Elasticsearch instances.

## Requirements

- Node.js as specified in [`.nvmrc`](./.nvmrc). Node versions are managed with [nvm](https://github.com/nvm-sh/nvm) — run `nvm use` to switch to the required version.
- Network access (VPN) to the configured Elasticsearch hosts.

## Quick start

1. Place an `.env` file in the package root. The canonical configuration lives in `gbif-configuration/gbif-web`; [`.env.example`](./.env.example) is the template.

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server (with nodemon):

   ```sh
   npm start
   ```

   To run without nodemon: `node src/index.js --port=4001`.

## API

### GET API

The GET API mirrors the other GBIF APIs and adds a few extensions:

- **`not`** — prefix a filter with an exclamation mark to negate it: `!year=2010`.
- **`isNotNull`** — match records where a field has any value: `publisher=*`.
- **`stats`** — aggregation over numeric fields. `stats=year` returns `min`, `max`, `avg` and `count`.
- **`cardinality`** — distinct-value count, e.g. `cardinality=year`.
- **Nested entities** — query a list of objects by ordered convention and a separator. For example, a list of authors can be queried by first and last name with `authors=Tim__Hansen`.
- **`includeMeta=true`** — returns query metadata: the GET query, the predicate it was transformed into, and the resulting Elasticsearch query.

### POST API (predicates)

The POST API accepts the predicate structure from the GBIF occurrence download API, with two additional predicate types:

- **`nested`** — query a list of objects (such as a list of authors).
- **`range`** — a more compact alternative to `greaterThanOrEquals` / `lessThanOrEquals` etc. from the occurrence API.

## Configuration

Configuration is supplied through an `.env` file (YAML) in the package root. [`.env.example`](./.env.example) documents every setting: secrets, upstream API, one section per Elasticsearch index, and optional load shedding.

### Generating a configuration

Index configurations are generated from the Elasticsearch `_mapping` endpoint on request (not dynamically). It is not perfect, but it is a starting point rather than writing every field by hand.

## Health

`GET /health` reports the live state of the request queues, aligned with the graphql-api `/health`. It is not cached.

Top level:

- `nagiosString` — a flat, greppable status line for Nagios-style checks, e.g. `SERVICE_OPERATIONAL - QUEUE_OCCURRENCE_OPERATIONAL - QUEUE_DATASET_OPERATIONAL - EVENT_LOOP_OK`. One token per subsystem reflecting its current state (`_OPERATIONAL` / `_REDUCED_CAPACITY` / `_OVERLOADED`), so a check can expect to see `QUEUE_OCCURRENCE_OPERATIONAL` (and alert when it disappears) or expect to not see `QUEUE_OCCURRENCE_OVERLOADED`. The `QUEUE_` prefix keeps tokens from being substrings of one another.
- `uptimeSeconds` — seconds since the process started.
- `inflight` — requests being handled across the whole service right now.
- `priorityCounts` — histogram of the `x-client-priority` on incoming requests since startup (e.g. `{ "10": 4268, "50": 31, "unknown": 12 }`), to see which priorities are most common. `unknown` covers a missing or invalid header.
- `rejecting` — true whenever something is being turned away (a gate band is active or a queue is at its hard cap).

Per queue:

- `waiting` (queued, not started), `running` (being processed), `currentQueueSize` (waiting + running), and `largestSeenQueueSize` (high-water mark of `currentQueueSize` since startup).
- `concurrencyLimit` and `maxQueueSize`.
- Cumulative `served` / `failed` / `aborted` (client disconnected) / `rejected` counts.
- For queues with shedding bands, a `shedding` object with `rejecting` (boolean) and `bands` (the current configuration).

Event loop:

- `eventLoop` lag (mean, max, and sticky peak since startup).
- `peakEventLoopMetrics` — a snapshot of inflight, heap and queue sizes captured at the worst stall since startup (also logged when it happens).
- `lastSlowEventLoop` / `slowEventLoopCount` — when the loop was last stalled for over a second, and how often that has happened since startup.

## Docker

Docker images can be built and published to docker hub using the following command

```
docker buildx build . --push --platform linux/amd64,linux/arm64 --tag "$DOCKER_HUB_ORG/es-api:$(git rev-parse --short HEAD)"
```

To run use:

```
docker run -p 4001:4001 --mount type=bind,source="$(pwd)"/.env,target=/usr/src/.env -d <DOCKER_HUB_OR_OR_USER>/es-api
```

## License

Apache 2.0.
