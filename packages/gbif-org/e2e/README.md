# e2e

Playwright against a production build of gbif.org whose every `PUBLIC_*` endpoint points at a
local record/replay mock. Runs offline and deterministically; no VPN, no `.env`.

```bash
npm run e2e:build    # once, and after source changes: builds into dist/e2e (~2-3 min)
npm run e2e          # replay recorded upstream data
npm run e2e:record   # forward unrecorded requests to production GBIF and save them
```

## How it works

- `env.mjs`: the `PUBLIC_*` values baked into the e2e builds. Vite inlines them at build time, so
  the e2e build is separate from `npm run build` (`gbif/server.js` reads `GBIF_DIST_DIR`).
- `mock/upstream.mjs`: one server for GraphQL, translations, REST and tiles, on `:4020`. GraphQL
  GETs are answered `unknownQueryId`, so the client falls back to POST and the recording is keyed
  by operation, locale and variables: `recordings/graphql/<Operation>/<locale>-<hash>.json`.
  Tiles and map images are stubbed blank.
- `test.ts`: import `test`/`expect` from here, not from `@playwright/test`. It blocks non-localhost
  requests, fails the test on uncaught errors and React hydration errors, and waits for network
  idle so late client fetches are recorded.
- `globalTeardown.ts`: fails the run if any request had no recording.

## Writing a spec

- Assert on content (title, `h1`, visible text). Error boundaries swallow render crashes, so "no
  exceptions" alone does not prove the page works.
- Use roles, text and URLs, not CSS classes, so specs survive refactors.
- New page or changed query: `npm run e2e:record`, review and commit `recordings/`.
- A miss in replay means the page asked for something not recorded. Re-record; never stub it out.
