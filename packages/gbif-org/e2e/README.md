# e2e

Playwright against production builds of gbif.org and of the hosted-portal library. Every upstream
they call is a local mock that replays recorded responses, so the suite runs offline, gives the same
result every time and needs no VPN or `.env`.

```bash
npx playwright install chromium   # once per machine
npm run e2e:build                  # after any source change; a run refuses an out-of-date build
npm run e2e                        # replay recorded upstream data
npm run e2e:record                 # record what is missing from production, keep the rest
npm run e2e:rerecord               # re-fetch every recording from production, delete unused ones
npm run e2e:live                   # no recordings: talk to production, test, dev or a local API
npm run e2e:schema-drift           # scheduled check, see the last section
```

## Terms

- **Mock**: `mock/upstream.mjs`, a local server that stands in for every GBIF API during tests.
- **Recording**: one upstream response saved as a JSON file in `recordings/`, replayed by the mock.
- **Key**: what identifies a recording, and also its file name; built from the request (for
  GraphQL: operation name, language, query text and variables).
- **Miss**: a request the mock has no recording for. In replay it fails the test or the run.
- **Mode**: what the mock does with a request, set by `E2E_MODE`: `replay` recordings (the
  default), `record` missing ones, `refresh` all of them, or go `live` and save nothing. See
  [The mock](#the-mock).
- **Stamp**: a hash of the files the e2e build is made from, saved next to the build. If the files
  have changed since, the build is **stale** and the run stops until you rebuild.
- **Pruning**: deleting the recordings a run did not use (see [Pruning](#pruning)).
- **Fault**: a broken answer a spec asks the mock for, to test error handling (see
  [Testing error handling](#testing-error-handling)).
- **Fixture**: the wrapper in `test.ts` that every test runs inside; it checks for errors and misses.
- **Project**: a Playwright test group with its own folder in `specs/` and its own site to test.

## Layout

```
playwright.config.ts   test projects, the servers to start, globalSetup and globalTeardown
e2e/
  env.mjs              ports, output folders and the PUBLIC_* values baked into the e2e build
  build.mjs            npm run e2e:build: builds gbif.org and the portal library into dist/e2e/
  buildStamp.mjs       computes the stamp; build.mjs saves it, globalSetup compares it
  globalSetup.ts       before all tests: stops if the build is missing or stale, or if pruning
                       is asked for in a run that only runs some of the tests
  globalTeardown.ts    after all tests: prunes if asked, then fails the run if there was any miss
  test.ts              the fixture: every spec imports test from here
  pageRows.ts          table-driven page checks shared by the smoke and portal specs
  mock/upstream.mjs    the upstream mock: replay, record, refresh or live
  hp-sites/            stand-ins for hosted-portal websites, one folder per site, and their server
  specs/               gbif/, hp/ and hp-occurrence-only/, one folder per Playwright project
  recordings/          committed upstream responses, written by the mock
  checks/              scripts that run against production on a schedule, outside npm run e2e
  logs/, .results/     server logs and Playwright output, git-ignored
```

## How a run works

```
 npm run e2e:build                     src/, public/, env.mjs
   build.mjs ──────────────────────────────────┐
                                               ▼
                    dist/e2e/gbif  +  dist/e2e/hp  +  build-stamp.txt
                                               │
 npm run e2e                                   │ globalSetup: stamp matches the source?
   playwright.config.ts starts the servers     ▼
                                     ┌──────────────────────┐
  spec (test.ts fixture)             │ gbif/server.js :3100 │──┐ server-side rendering
  drives Chromium ──── page ────────▶│ hp-sites :3200, 3201 │  │ (gbif.org only; the
        │                            └──────────────────────┘  │ portals are static)
        │ client-side requests                                 │
        ▼                                                      ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │ mock/upstream.mjs :4020                                         │
  │   replay ◀── e2e/recordings/  (record, refresh: writes to it)   │
  │   record, refresh, live ──▶ GBIF APIs (prod; live: test, dev)   │
  │   misses ──▶ test.ts fails the test, globalTeardown the run     │
  └─────────────────────────────────────────────────────────────────┘
```

Steps in order:

1. **Build** (`npm run e2e:build`, `build.mjs`). Builds gbif.org (client and server) and the
   hosted-portal library into `dist/e2e/`, with every `PUBLIC_*` endpoint from `env.mjs` pointing at
   the mock (`http://localhost:4020/<prefix>`). Vite reads `.env` from `e2e/`, which has none, so a
   developer's own settings stay out. Next to each build it writes `build-stamp.txt`, a hash of the
   inputs listed in `buildStamp.mjs`.
2. **Servers** (`playwright.config.ts`). Playwright starts four servers and waits until they answer:
   - the mock, `mock/upstream.mjs`, on `:4020`;
   - the gbif.org server, `gbif/server.js` on the e2e build, on `:3100`, with dummy secrets;
   - two portal sites, `hp-sites/server.mjs` with `HP_SITE=all-entities` on `:3200` and
     `HP_SITE=occurrence-only` on `:3201`. Each serves the library and its site's `index.html`, the
     way a portal's Jekyll page mounts it.
3. **globalSetup** compares the stamp with the current source and stops the run if they differ.
4. **Tests** run in three projects: `gbif` against `:3100`, `hp-all-entities` against `:3200` and
   `hp-occurrence-only` against `:3201`. Every spec imports `test` from `test.ts`, whose fixture:
   - blocks requests that leave localhost (external images get a grey placeholder);
   - tags each request to the mock with the test id, so a miss is charged to the test that caused it;
   - watches for page errors, React hydration errors and the partial-data toast, which means a
     GraphQL response had `errors`;
   - after the test, waits for the page to stop requesting, then fails the test on any of the
     above or on a miss with its test id;
   - reports started and passed tests to the mock, which only prunes after a fully passing run.
5. **Every upstream call** from the gbif.org server or the browser lands on the mock (next
   section).
6. **globalTeardown**, under `E2E_PRUNE=1`, asks the mock to delete recordings the run did not use
   (see [Pruning](#pruning)).
   Then it fails the run if the mock logged any miss. That catches the ones without a test id:
   requests the gbif.org server made while rendering, which no single test can be charged with.

## The mock

`mock/upstream.mjs` handles a request in this order:

1. `/__mock/*`: control endpoints for the fixture and teardown (misses, test counts, prune, faults).
2. Pick the upstream by path prefix: `/graphql`, `/api/v1`, `/content`, … Map tiles and analytics
   images are answered blank. Translations come from the bundled `src/config/fallback/`, so they
   match the repo and do not need recording.
3. GraphQL GETs are answered `{"unknownQueryId":true}`, so the client retries as a POST, which
   carries the operation name, query text and variables.
4. Compute the key, which is also the file name: `recordings/graphql/<Operation>/<locale>-<hash>.json`
   (hash of query text and variables) or `recordings/rest/<prefix>/<METHOD>-<path>-<hash>.json`
   (hash of the sorted query string). Any change to a query makes a new key, so an old recording is
   never replayed for a new query. Unnamed GraphQL operations are refused in every mode.
5. Answer according to `E2E_MODE`:

| Mode                               | Has a recording             | Has none                           | Saves                               |
| ---------------------------------- | --------------------------- | ---------------------------------- | ----------------------------------- |
| `replay` (default, `npm run e2e`)  | serves it                   | logs a miss, answers with an error | nothing                             |
| `record` (`npm run e2e:record`)    | serves it                   | fetches from production            | new responses                       |
| `refresh` (`npm run e2e:rerecord`) | fetches again, once per run | fetches from production            | everything, then [prunes](#pruning) |
| `live` (`npm run e2e:live`)        | ignored                     | fetches from `E2E_UPSTREAM`        | nothing                             |

6. If the request matches a fault, break the answer before sending it; see
   [Testing error handling](#testing-error-handling).

When recording, contact photos are replaced with one small grey image, since they are several MB
each and no spec checks them. Responses with a server error are passed on but not saved. A GraphQL
response with `errors` is saved with a warning; check it before committing.

### Pruning

Pruning deletes the recordings a run did not use. A changed query gets a new key and so a new
file, but nothing removes the old one; the same goes for removed tests and requests a page no longer
makes. Without pruning, `recordings/` collects files that nothing reads.

The mock remembers every key it served during the run. With `E2E_PRUNE=1`, `globalTeardown` asks
the mock (`POST /__mock/prune`) to delete every recording it did not serve. `npm run e2e:rerecord`
sets it; `E2E_PRUNE=1 npm run e2e:record` prunes after recording only what was missing.

A recording counts as unused if no test in the run requested it, so a partial run would delete the
recordings of every test it skipped. Two guards prevent that:

- `globalSetup` refuses `E2E_PRUNE=1` with arguments that run only some tests (spec files,
  `--grep`, `--project`, …), and `playwright.config.ts` refuses `test.only`.
- The mock prunes only in record and refresh mode, and only if every test that started also passed.

Still review the deleted files before committing: a request a page makes only sometimes, depending
on timing, can be unused in one run and needed in the next.

## Writing a spec

- New page type: add a row to `specs/gbif/smoke.spec.ts`. Otherwise use the file for its area
  (`specs/gbif/<area>.spec.ts`); redirects go in `redirects.spec.ts`.
- Assert on content (title, `h1`, visible text). Error boundaries swallow render crashes, so "no
  errors" alone does not prove the page works.
- Use roles, text and URLs, not CSS classes, so specs survive refactors.
- Before an action that unmounts what is still loading (switching tabs), `await waitForIdle()`.
  Otherwise how much gets requested depends on timing, and replay misses.
- New page or changed query: `npm run e2e:record`, review and commit `recordings/`.
- A miss in replay means the page asked for something not recorded. Re-record; never stub it out.
- Every GraphQL operation needs a name (`query DatasetTitle($key: ID!)`): recordings are filed by it.
- `npm run e2e:rerecord` replaces every recording with today's production response. Specs assert
  titles and counts from the recordings, so it can fail rows where editors changed content. That
  is not a regression; update the expected text. It needs a full run: `globalSetup` refuses it
  with arguments that run only some tests, and the mock refuses to prune after any failure.

## Testing error handling

The fixture fails a test on any error, so error handling needs specs that cause errors on purpose:
`specs/gbif/error-handling.spec.ts` and `specs/hp/error-handling.spec.ts`. They check that a small
GraphQL error leaves the page usable and shows the partial-data toast, and that a critical one
shows the error page (status 500 on gbif.org) or the 404 page. `src/routes/rootErrorPage.test.ts`
unit-tests the rules that decide between them (`is404`, `throwCriticalErrors`).

A spec breaks answers with the `mockFault` fixture, and lists the errors it expects:

```ts
test.use({ expectedErrors: [/^partial-data toast/] }); // these no longer fail the test

test('a failed secondary field shows a toast', async ({ page, mockFault }) => {
  await mockFault({
    operation: 'Dataset', // GraphQL operation name
    variables: { key: DATASET }, // optional: only requests with these variables
    errors: [{ path: ['literatureSearch'] }], // add an error there and null its data
  });
  await page.goto(`/dataset/${DATASET}`);
  await expect(page.getByTestId('partial-data-error')).toBeVisible();
});
```

Besides `errors`, a fault can set `nulls` (null the data without an error) or `status` (answer
with that HTTP status and no data, as if graphql-api were down). The mock applies it to whatever it
would have sent, in any mode, and never saves it. Faults are cleared when the test ends.

A fault only breaks requests made for the test that asked for it, so tests with faults can run in
parallel and share keys. Browser requests carry the test id in a header. For requests from the
gbif.org server (page loaders during server-side rendering), the fixture adds `e2eTest=<test id>`
to the URL of every page the test opens after `mockFault`; the server passes the page URL on to
the mock in `x-gbif-site-url`. Call `mockFault` before `page.goto`, and expect the page URL to
carry the extra `e2eTest` parameter.

## Running against test, dev or a local API

For a feature whose API is not in production yet, run your spec live:

```bash
E2E_UPSTREAM=dev npm run e2e:live -- e2e/specs/gbif/my-feature.spec.ts       # prod (default), test, dev
E2E_GRAPHQL_ORIGIN=http://localhost:4123 npm run e2e:live -- e2e/specs/gbif/my-feature.spec.ts
```

`E2E_API_ORIGIN` overrides the REST API the same way. Record and refresh only run against
production, so recordings never come from other environments. Run only the specs you are working
on: the rest assert production content, and the build still uses production checklist keys. Once
the API is in production, run `npm run e2e:record` and commit. Until then the spec fails in replay,
which is intended: the frontend should not merge before the API it needs is deployed.

The test and dev hosts sit behind a bot check. The mock passes on each request's user agent, so
requests the browser makes get through, but those from the gbif.org server (server-side rendering,
cache warm-up) get an HTML 403 page. Ask for a header the bot check accepts and pass it with
`E2E_UPSTREAM_HEADERS='{"x-name":"value"}'`. A local graphql-api has no bot check.

## Scheduled checks

Not part of `npm run e2e`; they need network access and are meant for a nightly run.

- `npm run e2e:schema-drift` (`checks/schema-drift.mjs`): compares the deployed GraphQL schema with
  the repo's and validates every `/* GraphQL */` operation against the deployed one. Fails on an
  invalid operation or on something deployed that the repo lacks; repo changes not yet deployed
  are only listed. Needs `npm ci` and a `.env` copied from `.env.example` in
  `packages/graphql-api`. `SCHEMA_DRIFT_ENDPOINT` points it elsewhere than production.
