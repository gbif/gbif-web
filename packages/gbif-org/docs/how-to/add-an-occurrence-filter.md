# How to add an occurrence search filter

A filter is a URL parameter that becomes part of the GraphQL `predicate`. What to touch depends on
what the filter needs:

| You need | Where the work is |
|---|---|
| A new filter on a field API v1 already accepts | gbif-org only: filter config, `searchConfig` mapping, translations, aliases |
| Counts in the popover (a facet) | + graphql-api facet field, + es-api entry in `occurrence.config.js` |
| Sorting, or the field in result rows | + es-api sort whitelist or reducer, + gbif-org table columns |
| A field API v1 does not know | backend change outside this repo first |

The predicate passes through graphql-api unchanged and es-api forwards occurrence predicates to API
v1 (`/occurrence/search/predicate/toesquery`) for validation. Neither keeps a list of filter keys.
The facet count is what pulls in the backend packages.

**Reference commits:** `380903f` (text filter, gbif-org only) and `b21fcf5` (gadm facets and
cardinality, es-api + graphql-api).

## Before you start

1. Confirm API v1 accepts the key (sent as UPPER_SNAKE, `basisOfRecord` → `BASIS_OF_RECORD`).
2. Pick the filter kind from `filterConfigTypes` in `src/components/filters/filterTools.tsx` (ENUM,
   SUGGEST, FREE_TEXT, RANGE, DATE_RANGE, OPTIONAL_BOOL, WILDCARD, LOCATION, TAXON, ...). Each has a
   config file in `src/routes/occurrence/search/filters/` (`enums.tsx`, `keySuggest.tsx`,
   `ranges.tsx`, `textOnly.tsx`, `wildcard.tsx`, `vocabulary.tsx`, `booleans.tsx`). Copy a neighbour.
   These are prebuilt widgets and one almost always fits; a new kind is rare, see
   [add-a-filter-type.md](./add-a-filter-type.md).

## es-api (facets, cardinality, GET params only)

`packages/es-api/src/resources/occurrence/occurrence.config.js`:

1. Add under `options`: `myField: { type: 'keyword', field: 'es.path' }`. Types: keyword, numeric,
   date, boolean, text, geo_shape, geo_distance, nested. Numeric and date ranges also need
   `get: { type: 'range_or_term', ... }` (copy `year`).
2. `src/requestAdapter/aggregations/` drops metric keys missing from `options`; only keyword, numeric,
   boolean can be faceted. A missing entry is a 400, not an empty list.
3. Sortable: `allowedSortBy` in `occurrence.dataSource.js`. In result rows: `reduce.js`.
4. No tests, needs VPN. Verify with `node --check` and reading the diff.

## graphql-api (facets only)

`packages/graphql-api/src/resources/occurrence/`:

1. Add the name to `helpers/fields/fieldsWithFacetSupport.js`; resolvers are generated from it.
2. Add to `type OccurrenceFacet` in `occurrenceSearch.type.js`:
   `myField(size: Int, from: Int): [OccurrenceFacetResult_string]` (pick the matching `_` suffix).
3. GBIF enum values: add `myField: 'enumName'` to `STRING_FACET_ENUMS` in `occurrence.resolver.js`.
   New enum: `npm run write-enums`, commit `src/helpers/enums/enums.json`.
4. Optional: cardinality, stats, histogram (sibling `fieldsWith*Support.js` + types), sorting
   (`enum OccurrenceSortBy`).
5. `npm run develop`, run the facet query in the sandbox against a dev es-api.

## gbif-org

1. **Config** in the matching `src/routes/occurrence/search/filters/*.tsx`: `filterType`,
   `filterHandle` (URL param), `displayName`, `filterTranslation: 'filters.<handle>.name'`,
   `about: () => <Message id="filters.<handle>.description" />`, `group` (one of `groups` in
   `occurrenceSearchPage.tsx`), `facetQuery` (unique operation name) for counts. ENUM: `options` from
   `src/enums/basic/*.json`. SUGGEST: `suggestConfig` from `src/utils/suggestEndpoints.tsx`.
2. **Register** in `src/routes/occurrence/search/filters.tsx`:
   `myField: generateFilters({ config: myFieldConfig, searchConfig, formatMessage })`.
3. **Declare the URL param** in `searchConfig.ts`. Handles missing from `config.fields` are silently
   dropped by `useFilterParams`. Plain keyword: append to `otherParams`. Explicit entry when you need
   `defaultKey` (API key differs from handle), `defaultType`, `v1.supportedTypes` (ranges),
   `singleValue`.
4. **Translations** (`packages/react-components/locales/source/en-developer/components/`):
   `filters.json` → `"<handle>": { "name", "description" }` (+ `isNotNull`/`isNull` if existence is
   allowed); `filterAliases.json` → comma-separated synonyms for the "More filters" search; enum
   labels in `enums/<enumName>.json` (new file also goes in `locales/scripts/stitchFile.js`).
5. **Visibility.** New filters land under "More filters". Default-visible on gbif.org:
   `highlightedFilters` under `occurrenceSearch` in `src/config/configDefaults.ts` or a per-entity
   block in `src/gbif/config.ts`. Portals set their own.
6. `npm run codegen`; commit `src/gql/`.
7. `npm run type-check`, `npm run vitest` (extend `src/dataManagement/filterAdapter/*.test.ts` for a
   new `defaultKey` or type). In the browser: URL round-trips, table updates, popover counts,
   download tab predicate accepted by v1.

## Caveats

- **Handle is a public contract:** URL param, portal `highlightedFilters`/`excludedFilters`,
  translation id. `src/hp/configAdapter.tsx` carries a few legacy renames; do not add casually.
- **Downloads reuse the predicate** (`OccurrenceSearchDownload.tsx`). A key v1 rejects breaks
  downloads even when the table works. Optional label `case` in
  `src/routes/occurrence/download/key/predicate.tsx`.
- **`src/enums/` are hand-maintained snapshots.** Check against the API enumeration.
- **Portals share the filter list**; they exclude via config. Test the hp build if you changed
  `filters.tsx` structure or `configAdapter.tsx`.
