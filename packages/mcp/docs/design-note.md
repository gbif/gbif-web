# GBIF Remote MCP: design note for implementation

Nov 18, 2026 · @Morten Work

## Goal and context

Build a remote MCP server that lets any chat client or coding agent query GBIF, where a plain-text answer is the baseline and richer views are optional upgrades. Users bring their own LLM (Claude, Gemini, local models); GBIF hosts no model and pays for none.

Chat, either on gbif.org or in a desktop LLM client, is expected to become a common entry point. gbif.org search and entity pages stay the place to go deeper, so every answer links back to the site.

The reader of every tool result is a model, often a small local one, not code. Clients differ: some render MCP Apps, many do not. Each answer is therefore built in layers that all degrade to text:

1. A short text answer with counts, names, keys, dataset, publisher and license.
2. Links to the matching search or entity page on gbif.org.
3. A link to a live canvas page that shows charts and maps for this conversation.
4. The exact API call behind the numbers, so a coding agent can rerun it and fetch more.
5. An MCP App widget, only when the client supports it.

## Design principles

These decisions are settled and shape everything below.

- **Text first.** Every tool returns plain text a small local model can use. Widgets and the live canvas are extras the model never has to decide about.
- **Reads and writes are separate.** Tools that look things up are pure reads. The server, not the model, decides what gets appended to the canvas.
- **Few tools, flat parameters.** Eight tools or fewer, short enums, and every parameter except the main one optional. Small models handle long enums and nested unions badly.
- **One filter string.** Filters are a single free-form string read by a generous server-side parser. See the filter section.
- **Heavy data never passes through the model.** Tools return summaries, small samples and links. Large data goes through the API call in the result or a download with a citable DOI.
- **Tell the model what was inferred.** Every loose input is answered with what it was read as and the strict form to reuse.
- **State completeness.** Every result says whether the numbers are exact, approximate, sampled or truncated.
- **Deterministic server.** No LLM calls inside the MCP. The same input always produces the same query.
- **GraphQL stays private.** The existing GraphQL server with nested aggregations is the compile target for charts. Agents never write GraphQL.
- **Attribution is built in.** Results carry dataset and publisher names and license so the model can cite them. Reusable or publishable extracts point to the download flow.

## V1 tools

Seven tools ship in V1, and an eighth, `create_download`, follows once OAuth is in place. Parameter names are a starting point, not a contract.

| Tool | Use it for | Parameters (all optional except the first) |
| --- | --- | --- |
| `match_taxon` | Resolving a species or group name to a taxon key, and disambiguating when the filter parser reports ambiguity | `name`, `rank`, `canvas` |
| `search_occurrences` | Counts, an optional facet breakdown, and a small sample of records with chosen fields | `filter`, `fields`, `limit` (0 = count only, hard cap about 100), `sort_by`, `sort_order`, `facet`, `canvas` |
| `chart` | Aggregates over all matching records, drawn as a chart or map | `filter`, `x`, `type`, `series`, `metric`, `metric_field`, `top_n`, `sort`, `pick_by`, `pick_order`, `pick_k`, `color_by`, `transform`, `canvas` |
| `search_registry` | Finding institutions, collections, installations, nodes and publishers | `entity_type`, `query`, `country`, `canvas` |
| `get_entity_details` | Full details for one entity key | `type`, `key`, `canvas` |
| `get_country_statistics` | Headline biodiversity data and node info for a country | `country_code`, `canvas` |
| `search_docs` | GBIF documentation, publishing guides, paging limits, citation | `query` |

Notes on the less obvious parameters:

- **`fields`** accepts a preset name (`summary` is the default, plus `location`, `taxonomy`, `provenance`) or an explicit array from a published whitelist. The record key is always included so each row can link to its gbif.org page. Do not call this `pick`, because `pick_*` already means grouped extremes in `chart`.
- **`sort_by`** is limited to fields that are indexed and sortable. This list may be shorter than the `fields` whitelist.
- **`pick_by`, `pick_order`, `pick_k`** return the top k records per `x` value, ranked by a field, computed over all matching records. Example: the two northernmost records per year.
- **`type`** defaults to `auto`. The enum stays under about a dozen: bar, line, stacked bar, histogram, heatmap, scatter, map, table. Each is described by the data shape it needs.
- **`x` and `series`** come from a fixed whitelist of about 15 to 20 dimensions, each tagged temporal, categorical, numeric or geographic. Publish the list as an MCP resource such as `gbif://dimensions`.
- **`canvas`** is an optional string on every tool that can write to the canvas. See the canvas section.

Boundary between the two data tools: `search_occurrences` returns individual records, a few of them. `chart` returns aggregates over everything that matches. Keep that to one line in each tool description.

## Filter string

The `filter` parameter is one string, read generously by a deterministic parser, and every result reports how the string was read. The server also accepts a JSON object, because some models will send one anyway.

**What the parser accepts**

- A pasted gbif.org occurrence search URL or an api.gbif.org query string. The parser also reads the server's own `gbif.org` links, so round trips work.
- Key and value tokens with aliases: `country=DK`, `country:Denmark` and `country=danmark` mean the same. Keep one alias table per field.
- Value forms: comma for OR (`country=DK,SE`), ranges (`2010-2025`, `>=2010`), negation (`!country=DK`), and synonyms (`observation` means `HUMAN_OBSERVATION`).
- Relative terms resolved against today's date and echoed as absolute values: "since 2010", "last 15 years".
- Leftover free text goes to name resolution.
- Boolean logic in V1: implicit AND between keys, OR inside a key, `!` for negation. Parentheses can come later.

**Countries** are a closed set of about 250. Match ISO 2 and 3 letter codes, English names and common variants, and local-language names (CLDR has these). Normalize case and accents. Names that point to several places (Georgia, Congo, Guinea, Korea, Niger, "Holland") return candidates instead of a guess.

**Taxa** take two different paths:

- `taxonKey=<value>` is an explicit key. Treat it as an opaque string, look it up, and echo the resolved name. If the lookup fails, say so and do not fall back to a name search.
- `taxon=<name>` or free text is name resolution. A name like "puma" is a genus, a species and a brand, so show the resolved name, rank and authorship, and treat fuzzy or higher-rank matches as ambiguous.
- A bare token with no key name is only guessed if the key format is distinctive. Otherwise require the `taxonKey=` prefix.

**Ambiguity and failures**

- Ambiguous input runs no query. Return the candidates with the exact strings to choose from, for example `taxonKey=A` for the species or `taxonKey=B` for the genus.
- Unrecognized tokens are reported, never dropped. The result says plainly that the result is not limited by that token, and suggests the closest valid filter.
- Parse errors say what was understood and what failed.

**What the result tells the model** (plain text, only when something was inferred):

```
Interpreted: "puma" -> Puma concolor (Linnaeus, 1771), species, taxonKey <key>; "danmark" -> DK; "since 2010" -> 2010-2026
Reuse: taxonKey=<key> country=DK year=2010-2026
Not applied: "invasive" (not a filter field). Results are NOT limited to invasive species. Did you mean establishmentMeans=INTRODUCED?
```

If the input was already canonical, skip the interpretation lines and echo the filter once. The values above are illustrative: use whatever the real lookup returns, and check authorship against the backbone.

**Testing.** Build a corpus early from real website queries, pasted URLs and model-written examples. Check that canonical strings parse back to themselves. Log every input that produced an unrecognized token or an ambiguity: that log tells you which aliases and synonyms to add.

## Tool result format

Tool results are plain text in a fixed layout, with each fact stated once. The model is the only reader, so there is no JSON envelope that repeats the same information in three shapes.

Illustrative result for a count query:

```
Danaus plexippus (species, taxonKey <key>) in Denmark, 2010-2026:
1,234 records, 1990-2025 range. Complete count, exact.

Interpreted: "monarch" -> Danaus plexippus; "danmark" -> DK; "since 2010" -> 2010-2026
Reuse: taxonKey=<key> country=DK year=2010-2026

Top datasets: <name> (publisher, license) 812; <name> 301; ...

See it: https://www.gbif.org/occurrence/search?...
Live view: https://www.gbif.org/live/<canvasId>
API: GET https://api.gbif.org/v1/occurrence/search?...
```

Rules:

- **Fixed labels and order.** Use the same label words (`Interpreted`, `Reuse`, `Not applied`, `See it`, `Live view`, `API`) in the same order on every call. Small models miss labels that move.
- **Conditional lines.** `Interpreted` and `Not applied` appear only when something was inferred or dropped. `Live view` appears on every result that touches a canvas.
- **Completeness in words.** State exact, approximate, sampled or truncated, and the denominator: "showing 20 of 4,312".
- **Rows as compact lines or TSV**, not JSON. JSON repeats every key on every row.
- **Server-generated links and API call.** The model copies them and never builds URLs. Authenticated calls are described ("requires a GBIF account"), never with tokens in the URL. Use method and body for POST calls.
- **One hint at most**, for example "for citable data, use create\_download". Longer guidance on paging, field lists and rate limits lives in the docs resource and `search_docs`.
- **Structure stays on the server.** The parsed filter, canvas recipe and datasets are stored server-side and used to generate the text and links. They do not travel in the response.
- **Widgets.** An MCP App needs structured data, which should travel in a separate channel such as `structuredContent` or be fetched by the widget by canvas ID. Some clients pass both text and structured content to the model, so test the clients you care about and keep the structured part minimal.
- **No format flag in V1.** Add a structured mode only when a programmatic consumer appears.

The API call serves two purposes: transparency about what produced the numbers, and a head start for a coding agent that needs more than a summary. The search API has a paging depth limit (check the current value), so the hint should route small extracts to paging, large or citable ones to a download, and counts to facets.

## Live canvas

The server mints a canvas page at `gbif.org/live/<canvasId>` and gives the link to the model, which can show it to the user. The page renders charts and maps for the conversation and updates as new ones are added. It works in every client, because the only requirement is that the model shows a link.

**Identity**

- The canvas ID is a separate high-entropy value, never the MCP transport session ID. Map it to the MCP session on the server, make it unlisted, and let it expire.
- MCP has no conversation ID, and some clients share one session across many chats. The server cannot tell whether a first call is the first call of a conversation.
- The only signal that comes from the conversation is the `canvas` parameter, because the model copies the ID from its own context.

**Resolution rules**

1. `canvas` present and valid: use it.
2. `canvas` is `new`: mint a new canvas.
3. `canvas` omitted: reuse the session's most recent canvas if it was active in the last N minutes (start with 30), otherwise mint one.
4. Every result that touches a canvas echoes the `Live view` link. After a wrong guess in rule 3, the model sees the real link and uses its ID from then on.

The tool descriptions say: "If there is no live view link earlier in this conversation, pass `canvas: new`. Otherwise pass the ID from that link." Frontier models follow this. Small models will not always, which is why rule 3 exists. The main failure is a new chat landing on an old canvas within the window. It is cosmetic and fixable with `canvas: new`.

Where a client starts a fresh session per chat, none of this is ambiguous. A dedicated `open_live_view` tool is an option if the failures turn out to be common, at the cost of one more required step.

**Getting the link to the model.** Put it in the first tool result and repeat it periodically, since long chats lose early context. Also put it in the server `instructions` field, which not every client passes on. Add a short note such as "mention this link to the user once".

**What gets appended**

- The server auto-appends results of `chart`, `match_taxon`, `get_entity_details` and `search_registry`. Plain `search_occurrences` counts are not appended, to avoid clutter.
- The canvas stores the recipe (parsed filter, chart parameters, any jq) and not only the rendered output, so charts can be re-rendered, explained and reproduced.
- The server holds the state and the browser only subscribes, for example over SSE. Opening the link late shows everything so far.
- The page is one-way in V1. There is no `get_session_view` and no write path from the browser.

**Access.** The link is a read-only bearer capability, because filters reveal what someone is researching. Writes require that the canvas belongs to the calling session or authenticated user, so a leaked link lets someone watch and not edit. The same components can be bundled into the MCP App, and the iframe needs the GBIF API domains in its CSP connect list.

## Charts and the jq escape hatch

The `chart` tool is a small grammar of combinable parameters, so many charts come from a few parts and the shelf stays full without one tool or schema per chart. Most requests need only a filter and `x`.

**Grammar**

- A chart type is a renderer chosen from a short enum, or `auto`, which picks from the dimensions: temporal `x` gives a line, categorical `x` gives a bar, two categoricals give a heatmap or stacked bar.
- Each combination compiles on the server to a GraphQL query with nested aggregations and sorting. Agents never see or write GraphQL, and the server bounds query cost.
- `pick_by`, `pick_order` and `pick_k` express grouped extremes over all matching records. Example: the two northernmost records per year for a species over 15 years, as a map colored by year (`type: map`, `color_by: year`). The same parameters cover earliest record per country or highest elevation per species.
- Not every dimension fits every type. Reject bad combinations with helpful text, for example "heatmap needs two categorical dimensions; add `series` or use `bar`". Publish a resource listing dimensions, their kinds and which chart types accept which kinds.

**Guard rails**

- Cap categories and series. Return the top N plus an "other" bucket and say so.
- Mark approximate aggregations as approximate. High-cardinality terms and cardinality aggregations are approximate in Elasticsearch, so check what your backend does.
- Extremes concentrate bad data: georeferencing errors, centroids, escapes. Apply coordinate-issue filters by default for `pick_*` and report them in the result.
- Trends in extremes are confounded by sampling effort. Return records per year as a companion series, and add one line of caution to the text.
- Cache by normalized query, since facet queries repeat across users.
- Every chart result includes a text description of what was drawn: type, categories, min and max, top entries, filters applied. The model cannot see the render, and clients without UI still get the finding.

**jq as the last-mile escape hatch**

The `transform` parameter takes a jq expression applied to the small, already-correct result of the query. It is for output shapes the grammar cannot produce. Log every use, because repeated patterns are candidates for new presets.

- Contract per output kind, validated: chart rows (an array of rows or objects), GeoJSON (a FeatureCollection with a capped feature count), or text.
- jq outputs plain data. Colors and chart styling are applied by the renderer from properties such as `color_by`, never computed in jq. For charts, the model supplies rows and the server merges them into a chart template, rather than the model writing a full ECharts config.
- Run it in a hardened implementation (gojq with context cancellation, jaq, or a WASM build), not by shelling out. Disable env, file, import and `input` access. Enforce a wall-clock timeout, memory cap, input size cap and output size cap. Treat it as untrusted code execution.
- Return jq errors as helpful text with the field names that exist, and offer a dry run that returns the data shape.
- If a jq step runs over fetched records and not over a full aggregation, label the result sampled and give both counts. Prefer pushing selection into the GraphQL query.
- Maps for large data use GBIF's tile or grid aggregation, not GeoJSON points. Custom GeoJSON is only for small outputs with a hard point cap.
- Store the recipe (filter, chart parameters, jq) on the canvas so the same result can be re-rendered or reproduced as a `curl | jq` one-liner.

## Security and limits

Treat everything the model sends as untrusted input, and everything many autonomous agents can reach as an abuse surface.

- **Whitelists everywhere.** Dimensions, fields, sort fields, chart types and endpoints come from fixed lists. The model never supplies a URL, and the server builds every upstream request.
- **Validate before rendering.** Specs pushed to the canvas or a widget are checked against component schemas. Allow only known component types and typed props. No raw HTML or free-form attributes, and escape text in titles, labels and tooltips.
- **Chart configs are data, not code.** If any config is accepted from the model, it is JSON only, with whitelisted option keys and series types, and caps on points and series.
- **jq is untrusted code.** See the sandbox limits in the chart section.
- **Canvas links are read-only capabilities.** Writes are bound to the calling session or user. Expire canvases. Keep filters private to the link holder.
- **Rate and cost limits.** Cap rows, fields, categories, query complexity and time per call, and rate limit per client. Cache repeated queries.
- **Public by default, authenticated where needed.** Search, matching and charts are anonymous. `create_download` requires a GBIF account via OAuth, with no tokens in URLs or results.
- **Sandboxed coding agents.** Some agents cannot reach `api.gbif.org`. Say in the docs resource which domains to allow.
- **Privacy of logs.** Interpretation and jq logs improve the parser and presets, but filters reveal what people research. Decide what is stored and for how long.

## Open questions and things to verify

Several points were stated from general knowledge and need checking against the real systems before building on them.

- [ ] Which sort fields the GraphQL schema supports on the occurrence list, and whether sorting inside nested buckets works as the `pick_*` parameters assume.
- [ ] Whether aggregations on the backend are exact or approximate for each metric, so results can say which.
- [ ] The current taxon key format, which decides whether a bare key without `taxonKey=` can ever be recognized.
- [ ] The current paging depth limit of the occurrence search API, and the current download API behavior.
- [ ] Whether GBIF can serve static map or chart images, which would work in many more clients than MCP Apps.
- [ ] How the clients you care about handle `structuredContent` and MCP Apps, and whether they pass both text and structured content to the model.
- [ ] Name resolution inside the filter parser: friendlier, but it puts a network lookup in every call and ties the parser to the name index. The alternative is resolving names only through `match_taxon`.
- [ ] Whether dimensions are a hand-kept whitelist or derived from the schema. The whitelist is safer and easier to describe, but you maintain it.
- [ ] Whether a `pick_*` misuse by small models justifies splitting it into its own `extremes` tool.
- [ ] Whether `search_occurrences` should keep its sample-records mode, or become counts and facets only.
- [ ] How long canvases live, and what the pairing of canvas to authenticated user looks like once OAuth exists.

## Suggested build order

Each step is usable on its own, and text-only clients work from step 1.

1. **Filter parser and name resolution**, with the test corpus, alias tables and the interpreted/reuse/not-applied output. Everything else depends on it.
2. **Plain-text tool results** with the fixed layout, links to gbif.org and the server-generated API call. Ship `match_taxon`, `search_occurrences`, `search_registry`, `get_entity_details`, `get_country_statistics` and `search_docs` on this.
3. **Test with a small local model** in a client with no UI support. If it can answer "how many records of this species are there in Denmark, and where can I see them?" with correct numbers, citations and a working link, the baseline is sound.
4. **Canvas and live page**: canvas IDs, resolution rules, the subscribe-only page, and auto-append from the chart and lookup tools.
5. **`chart` with presets**: the dimension whitelist, chart types, `auto`, validation errors, then `pick_*` through GraphQL.
6. **MCP App widgets** for clients that support them, reusing the canvas components.
7. **jq `transform`** with its sandbox, once real requests show the presets cannot serve them. If it already works in a prototype, it can come earlier.
8. **OAuth and `create_download`**, with rate limiting and abuse protection.
