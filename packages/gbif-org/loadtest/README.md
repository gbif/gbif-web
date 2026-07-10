# SSR load testing & profiling (gbif-org taxon pages)

A self-contained harness to benchmark **server-side rendering** of `/taxon/:key` under sustained
load and to flamegraph where a request spends its time — **without straining the real GBIF API**.

How it works:

- Every request to the SSR server runs a full `render(req)` (there is no rendered-HTML cache), so
  hitting `/taxon/<id>` with many **different** ids guarantees a fresh SSR render per request.
- A local **mock proxy** (`mock-server.mjs`, port `:4010`) returns the **same** taxon response for
  **every** id, so nothing is cacheable by id and the real API is contacted only once (recording).
- `.env.loadtest` (at the repo root) repoints every `PUBLIC_*` upstream at the mock. Because Vite
  statically inlines `import.meta.env.PUBLIC_*` at **build time**, you must **build** with this env
  in place — and build with `--mode loadtest` so Vite actually loads `.env.loadtest` (the default
  `production` build mode would not). The build still keeps prod characteristics.

## Files

| File | What it is |
|---|---|
| `mock-server.mjs` | Record/replay mock for all upstreams (`:4010`). |
| `load-test.mjs` | autocannon driver; configurable RPS, varies the taxon id per request. |
| `.env.loadtest` | Endpoint overlay pointing every `PUBLIC_*` upstream at `:4010`. |
| `recordings/` | Captured upstream responses (committed for reproducibility). |
| `profiles/` | `.cpuprofile` output (git-ignored). |

npm scripts (run from `packages/gbif-org`):

| Script | Purpose |
|---|---|
| `npm run loadtest:mock` | Start the mock in **replay** mode (default). |
| `npm run loadtest:mock:record` | Start the mock in **record** mode (forwards to real GBIF once). |
| `npm run start:loadtest` | Start the production SSR server (profiling **off**). |
| `npm run start:profile` | Start the SSR server with the CPU profiler **on** (`--cpu-prof`). |
| `npm run loadtest:run` | Run the load test. |

## One-time setup

```bash
cd packages/gbif-org

# 1. Put the loadtest endpoint overlay at the repo root as .env.loadtest
#    (it takes precedence over .env; secrets/API keys still come from .env).
cp loadtest/.env.loadtest .env.loadtest

# 2. Install deps (adds autocannon) and build with the mock endpoints baked in.
#    --mode loadtest is what makes Vite load .env.loadtest (plain `npm run build` would not).
npm install
npx vite build --config gbif/vite.config.ts --mode loadtest --ssrManifest
npx vite build --config gbif/vite.config.ts --mode loadtest --outDir ./dist/gbif/server --ssr ./src/gbif/entry.server.tsx
```

## Record the upstream responses (once)

The mock needs a captured taxon page to replay. Record forwards to **production GBIF** by default
(override with `REAL_GRAPHQL_ENDPOINT`, `REAL_API`, `REAL_TRANSLATIONS`, …).

```bash
# Terminal A — mock in record mode
npm run loadtest:mock:record

# Terminal B — SSR server
npm run start:loadtest

# Terminal C — load exactly one taxon page so the mock captures everything SSR needs
curl -s http://localhost:3000/taxon/2476674 > /dev/null
```

You should see `[record] ... saved gql.POST.TaxonKey` (or `gql.GET.<hash>`), plus header and
translations recordings. Confirm files exist:

```bash
ls loadtest/recordings/
```

Stop terminals A and B. The recordings are now reusable forever; commit them if you want the
benchmark to be reproducible on other machines.

## Run the benchmark (replay — no real API traffic)

```bash
# Terminal A — mock in replay mode
npm run loadtest:mock

# Terminal B — SSR server
npm run start:loadtest

# Terminal C — drive load (tune via env)
RPS=50 DURATION=30 CONNECTIONS=20 npm run loadtest:run

# …or measure MAX sustainable throughput (uncapped — no RPS pacing, closed-loop at CONNECTIONS):
MAX=1 CONNECTIONS=50 DURATION=30 npm run loadtest:run
```

Output is a latency report (min/mean/p50/p90/p99/p99.9/max), throughput, and status-code
breakdown. The mock logs only `replay HIT/MISS` — no outbound calls — confirming the real API is
untouched. Re-run with different `RPS` to find where latency degrades; this is your benchmark.

Driver knobs (env): `TARGET` (default `http://localhost:3000`), `RPS`, `DURATION`, `CONNECTIONS`,
`ID_MIN`/`ID_MAX`, `PATH_PREFIX` (e.g. `/es` for a locale).

## Profile a request (flamegraph — toggleable)

The profiler is toggled by **which server script you run**: `start:loadtest` (off) vs
`start:profile` (on). `--cpu-prof` writes a `.cpuprofile` into `loadtest/profiles/` when the
process exits.

```bash
# Terminal A — mock (replay)
npm run loadtest:mock

# Terminal B — SSR server WITH profiling
npm run start:profile

# Terminal C — generate load to profile
RPS=30 DURATION=30 npm run loadtest:run

# Then stop the server in Terminal B with Ctrl-C  → the .cpuprofile is flushed on exit.
ls -t loadtest/profiles/*.cpuprofile | head -1
```

Open the newest `*.cpuprofile`:

- **Chrome/Edge DevTools** → Performance tab → "Load profile…" → pick the file → flame chart.
- **VS Code** → just open the `.cpuprofile` file (built-in flame-chart viewer).

Reading it: look for time under `renderToString`, route loaders, `GraphQLService`, JSON parsing,
and the i18n/intl machinery. Profiling adds overhead, so turn it off (use `start:loadtest`) for
real benchmark numbers.

Tips:
- An **aggregate-under-load** profile (moderate RPS for ~30s) gives the cleanest signal. A
  single-request profile is polluted by process startup/module loading.
- The SSR server already logs per-request `durationMs` (see `gbif/middleware/requestLogger.mjs`).
  Grep the logs for high `durationMs` to find slow outliers, then profile.

## Cleanup

```bash
# Remove the loadtest overlay when finished, then rebuild normally for your env.
rm .env.loadtest
```

> Note: the loadtest overlay only takes effect when you build/start with `--mode loadtest`; a normal
> `npm run build` / `npm start` ignores `.env.loadtest` entirely, so it can sit in the repo root
> without affecting your regular workflow. For the loadtest, the build bakes the SSR endpoints from
> `.env.loadtest`; the runtime SSR server reads them from the baked bundle.
