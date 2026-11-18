# AGENTS.md: gbif-mcp

A remote MCP server for asking GBIF questions from any chat client, plus a live "canvas" web page that shows
the charts of a conversation. Read [docs/vision.md](docs/vision.md) for why and
[docs/design-note.md](docs/design-note.md) for the design decisions (settled unless it says otherwise).
Status: early prototype, iteration one.

## Run and test (all from `packages/mcp`)

```bash
npm install
npm test            # offline, mocked GBIF, ~1 s. Run this after every change.
npm run typecheck
npm run dev         # server on http://localhost:3333 (MCP at /mcp, canvas at /canvas/<id>)
npm run smoke       # second terminal: real MCP client against the running server and LIVE GBIF
npm run e2e         # the widget inside a real MCP Apps host (AppBridge) in headless Chromium
npm run build       # what Vercel runs: widget, canvas page, bundled functions in api/
```

`e2e` needs Playwright with Chromium (`require('playwright')` must resolve; locally `npx playwright install chromium`).
`npm run inspect` opens the MCP Inspector for poking at the tools by hand.

Definition of done for a change: `npm test` and `npm run typecheck` pass; if it touches GBIF queries or
output, `npm run smoke` passes against live GBIF; if it touches `src/view/`, `npm run e2e` passes.

## Map

| Path | What |
| --- | --- |
| `src/server.ts` | The MCP server: tools, widget resource, instructions. One server per request. |
| `src/filter.ts` | The `key=value` filter parser. Returns predicate, strict echo (`reuse`), `notApplied`, links. |
| `src/gbif.ts` | All GBIF access. GraphQL for data; REST only for name matching and key lookup. |
| `src/dimensions.ts` | Whitelist of what `chart` can break down by. Add a dimension here. |
| `src/format.ts` | The fixed text layout of tool results (labels and their order never change). |
| `src/canvas.ts` | Canvas ids, store (memory or Upstash Redis REST), `canvas` parameter resolution. |
| `src/http.ts`, `src/entries/`, `src/dev-server.ts` | HTTP glue shared by Vercel functions and local dev. |
| `src/view/` | Browser code: `render.ts` (one SVG renderer), `chart-view.ts` (MCP App), `canvas.ts` (canvas page), HTML templates. |
| `scripts/build.mjs` | Generates `src/generated/`, `public/canvas.*` and `api/*.js`. All gitignored. |
| `scripts/smoke.ts`, `test/` | Smoke script; unit and server tests; `test/e2e/` widget host test. |

## Rules of the house

- **Text first.** Every tool result must work for a small model that sees only text. Widgets are extras.
- **Deterministic.** No model calls in the server. Same input, same query.
- **Never drop input silently.** Anything not understood goes in `Not applied`, saying results are not limited by it.
- **The model never writes GraphQL or URLs.** The server builds every upstream request and every link.
- **Fixed labels, fixed order** in results: Reuse, Not applied, See it, Live view, API, Hint. Tests pin this.
- **Whitelists** for fields, dimensions, chart types. Escape every string that reaches HTML (the renderer does).
- **Tools use flat parameters and few enums.** Avoid open object schemas: `my-gbif` found that some clients drop tools that have them. The server accepts a JSON object as a filter string for the same reason later, not in the schema.
- **Stateless transport.** Each POST builds a new server. State lives in the canvas store, not in memory
  (memory only works for `npm run dev`).
- Pin tool-output behaviour with a test in `test/server.test.ts` (mocked) before relying on it.

## Facts about GBIF, checked against the live endpoints

- Data: `https://graphql.gbif.org/graphql` (`occurrenceSearch(predicate)` with `documents`, `facet`, `cardinality`).
  Predicate keys use API names (`countryCode`, `taxonKey`, `year`); `country` is accepted as an alias.
  An unknown key is a 400 (`INVALID_PREDICATE`), not silently ignored.
- Year and similar ranges: `greaterThanOrEquals` and `lessThanOrEquals` predicates inside an `and`.
- Taxon names: `GET https://api.gbif.org/v2/species/match?scientificName=...` returns the match, `diagnostics.matchType`
  (EXACT, VARIANT, HIGHERRANK, ...), a confidence and alternatives. Keys are GBIF Backbone keys (integers as strings).
  `taxonKey` predicates without a `checklistKey` use the Backbone, which matches gbif.org's default.
- The record field `scientificName` is the publisher's and is often null. Use
  `classification(checklistKey: "<backbone>") { usage { name } }` for the interpreted name (done in `gbif.ts`).
- Facet buckets have `key`, `count` and a localised `label`. `cardinality { <field> }` gives the number of distinct values.
- The site links use snake_case parameters (`taxon_key`, `basis_of_record`); the v1 API uses camelCase.

## Gotchas

- MCP SDK is **1.x** with `@modelcontextprotocol/ext-apps` **1.7.x**. ext-apps 2.x declares SDK 2.x packages as peers (not tried here), and `my-gbif` stayed on 1.x for the same reason. Upgrade them together, if at all.
- The widget is one self-contained HTML string (iframe is sandboxed, cannot fetch). It gets data only from the tool result's `structuredContent`.
- Vercel: the functions are pre-bundled by esbuild into `api/` at build time, so no TypeScript resolution happens on Vercel.
- TypeScript here is 7.x (native); `tsconfig.json` needs `"types": ["node"]`.

## Related work (read before reinventing)

See [docs/related-work.md](docs/related-work.md): earlier experiments in `gbif-web` branch `mgh-one-filter`,
`gbif-ui-guide` (generous filter parsing), `gbif-community-components` (web components) and `my-gbif`
(MCP App over local DuckDB data).

## Next steps

See "What comes next" in [docs/vision.md](docs/vision.md). The open questions to verify are listed at the end of
[docs/design-note.md](docs/design-note.md); when one is answered, note the answer under "Facts about GBIF" above.
