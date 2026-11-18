# Related work

Four earlier experiments touch these ideas. None is a dependency; they are sources of ideas and proven details.

## `gbif-web`, branch `mgh-one-filter` (`packages/graphql-api/src/mcp/`, `packages/mcp/`)

An LLM-driven take. The model writes GraphQL and a jq expression, the server runs both and returns a Vega-Lite
spec. Charts are kept in an in-memory cache with a 20 minute TTL, keyed by a query id. A separate stdio server in
`packages/mcp` wraps GBIF APIs as tools (species match, occurrence search, and more).
Useful: `handlers/speciesUtils.js` (name matching strategies), the chart guide text, Vega-Lite as an alternative
chart format. Different from this package: the model never writes GraphQL or jq here, and jq is not run by
shelling out (`node-jq` does).

## `gbif-ui-guide` (MortenHofft)

Deterministic "structured query" parsing for occurrence search (`src/structured/`), multilingual field and value
labels, recognised entities with a reason, recommendations, and a large test corpus (`data/test_cases*.json`).
It uses local copies of data (a 658 MB name index, registry index); the plan here is to use GBIF's APIs instead
and treat every case the APIs cannot answer as a concrete API improvement. A hosted decision model (Jev) is used
only in its free-text path. Port selectively, with the tests.

## `gbif-community-components` (MortenHofft)

Lit web components (taxon card, occurrence map, table, gallery, search, record views) with a shared throttled
API client. Candidate for richer canvas and widget views later; no chart elements yet.

## `my-gbif` (MortenHofft)

A local explorer over a GBIF download with DuckDB, with an MCP server and an MCP App widget. Worked out the
MCP Apps mechanics this package reuses: ext-apps 1.x with SDK 1.x, a single-file widget, data only through tool
results (an app-only `query` tool for follow-up queries), a CSP declared on the resource, an e2e test with
`AppBridge`, and generous repair of tool arguments (`mcp-repair.ts`, worth reading before building the
generous parser here).
