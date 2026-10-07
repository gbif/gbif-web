# e2e

Playwright against production builds of gbif.org and of the hosted-portal library, with every
`PUBLIC_*` endpoint pointed at a local record/replay mock. Runs offline and deterministically; no
VPN, no `.env`. Three projects: `gbif` (`specs/gbif/`, SSR on `:3100`), and two hosted portals
without SSR: `hp-all-entities` (`specs/hp/`, `hp-sites/all-entities/`, `:3200`) and
`hp-occurrence-only` (`specs/hp-occurrence-only/`, `hp-sites/occurrence-only/`, `:3201`).

```bash
npx playwright install chromium   # once per machine
npm run e2e:build                  # after any source change (~2.5 min); the run refuses a stale build
node e2e/build.mjs gbif|hp         # rebuild one target only
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
- `hp-sites/server.mjs`: serves the e2e library build and one site's `index.html` (`HP_SITE`) for
  every other path, like a portal's Jekyll page. Add a site as a folder with an `index.html`, plus a
  project and a `webServer` entry in `playwright.config.ts`.
- `globalTeardown.ts`: fails the run on misses no test owns (server-side requests), and prunes
  under `E2E_PRUNE=1`. The mock refuses to prune unless every started test passed, so a failed or
  aborted re-record deletes nothing.

## Writing a spec

- New page type: add a row to `specs/gbif/smoke.spec.ts`.
- Put it in the file for its area (`specs/gbif/<area>.spec.ts`); redirects go in `redirects.spec.ts`.
- Assert on content (title, `h1`, visible text). Error boundaries swallow render crashes, so "no
  exceptions" alone does not prove the page works.
- Use roles, text and URLs, not CSS classes, so specs survive refactors.
- Before an action that unmounts what is still loading (switching tabs), `await waitForIdle()`
  (a fixture). Otherwise how much gets requested depends on timing, and replay misses.
- New page or changed query: `npm run e2e:record`, review and commit `recordings/`. A changed query
  is a miss, never a stale replay. `e2e:rerecord` also removes recordings left behind.
- A miss in replay means the page asked for something not recorded. Re-record; never stub it out.
- Every GraphQL operation needs a name (`query DatasetTitle($key: ID!)`). The mock refuses unnamed
  ones in both modes, since recordings are filed by operation name.
- The recorder warns when a GraphQL response contains `errors`; check those before committing.

## Live checks

Not part of `npm run e2e`; they need network access and are meant for a nightly run.

- `npm run e2e:schema-drift` (`live/schema-drift.mjs`): compares the deployed GraphQL schema with
  the repo's (`packages/graphql-api/tools/printSchema.ts`; needs `npm ci` and a `.env` copied from
  `.env.example` there) and validates every `/* GraphQL */` operation against the deployed one.
  Fails on an invalid operation or on something deployed that the repo lacks; undeployed repo
  changes are only listed.
