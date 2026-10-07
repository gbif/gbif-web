# e2e

Playwright against a production build of gbif.org whose every `PUBLIC_*` endpoint points at a
local record/replay mock. Runs offline and deterministically; no VPN, no `.env`.

```bash
npx playwright install chromium   # once per machine
npm run e2e:build                  # after any source change (~1.5 min); the run refuses a stale build
npm run e2e                        # replay recorded upstream data
npm run e2e:record                 # forward unrecorded requests to production GBIF and save them
npm run e2e:rerecord               # full run in record mode, then delete recordings no test used
```

## How it works

- `env.mjs`: the `PUBLIC_*` values baked into the e2e build. Vite inlines them at build time, so
  the e2e build is separate from `npm run build` (`gbif/server.js` reads `GBIF_DIST_DIR`).
  Your local `.env` is ignored by both the build and the server.
  `buildStamp.mjs` fingerprints the build inputs; `globalSetup.ts` compares it before every run.
- `mock/upstream.mjs`: one server for GraphQL, REST and tiles, on `:4020`. GraphQL GETs are
  answered `unknownQueryId`, so the client falls back to POST and the recording is keyed by
  operation, locale, query text and variables: `recordings/graphql/<Operation>/<locale>-<hash>.json`.
  Translations come from the bundled `src/config/fallback/`; tiles and map images are stubbed blank.
- `test.ts`: import `test`/`expect` from here, not from `@playwright/test`. It blocks non-localhost
  requests, waits until the page stops requesting, and fails the test on uncaught errors, React
  hydration errors, the partial-data error toast (a GraphQL response with `errors`) and requests
  without a recording.
- `globalTeardown.ts`: fails the run on misses no test owns (server-side requests), and prunes
  under `E2E_PRUNE=1`.

## Writing a spec

- New page type: add a row to `specs/gbif/smoke.spec.ts`.
- Put it in the file for its area (`specs/gbif/<area>.spec.ts`); redirects go in `redirects.spec.ts`.
- Assert on content (title, `h1`, visible text). Error boundaries swallow render crashes, so "no
  exceptions" alone does not prove the page works.
- Use roles, text and URLs, not CSS classes, so specs survive refactors.
- New page or changed query: `npm run e2e:record`, review and commit `recordings/`. A changed query
  is a miss, never a stale replay. `e2e:rerecord` also removes recordings left behind.
- A miss in replay means the page asked for something not recorded. Re-record; never stub it out.
- Every GraphQL operation needs a name (`query DatasetTitle($key: ID!)`). The mock refuses unnamed
  ones in both modes, since recordings are filed by operation name.
- The recorder warns when a GraphQL response contains `errors`; check those before committing.
