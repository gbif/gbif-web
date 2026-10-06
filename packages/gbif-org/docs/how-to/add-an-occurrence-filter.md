# How to add an occurrence search filter

A filter is a URL parameter on occurrence search that becomes part of the GraphQL `predicate`.
What you have to touch depends on what the filter needs:

| You need | Where the work is |
|---|---|
| A new filter on a field API v1 already accepts | gbif-org only: filter config, `searchConfig` mapping of the URL parameter, translations, and aliases so people can find it under "More filters" |
| Counts in the filter popover (a facet) | plus graphql-api (facet field) and es-api (field entry in `occurrence.config.js`) |
| Sorting by the field, or showing it in result rows | plus the es-api sort whitelist or reducer, and the gbif-org table columns |
| A field API v1 does not know | a backend change outside this repo first |

Why the backend packages are so lightly involved:

- **The predicate itself passes straight through.** graphql-api forwards it unchanged to es-api,
  and es-api forwards occurrence predicates to API v1 (`/occurrence/search/predicate/toesquery`)
  for validation and translation to Elasticsearch. Neither package keeps a list of allowed filter
  keys. The key must be known to API v1, which is outside this repo.
- **The facet counts in the filter popover are what force the extra work.** Each filter config has
  a `facetQuery`, and that facet field must exist in graphql-api and be aggregatable in es-api.

**Reference example to copy:** commit `380903f` added the `nucleotideSequenceNucleotideSequenceID`
text filter (gbif-org files only, no facet). Commit `b21fcf5` added the `gadmLevel0Gid` to
`gadmLevel3Gid` facets and cardinality across es-api and graphql-api. Together they cover the whole
path.

## Before you start

1. Confirm the field exists in the occurrence Elasticsearch index and that API v1 accepts it as a
   predicate key (UPPER_SNAKE, e.g. `basisOfRecord` is sent as `BASIS_OF_RECORD`). If v1 rejects it,
   stop here; that is a backend change, not a gbif-web change.
2. Decide the filter kind. The kinds are the `filterConfigTypes` enum in
   `src/components/filters/filterTools.tsx`: ENUM, SUGGEST, FREE_TEXT, RANGE, DATE_RANGE,
   OPTIONAL_BOOL, WILDCARD, LOCATION, TAXON, and a few special ones. Each has a config file in
   `src/routes/occurrence/search/filters/` (`enums.tsx`, `keySuggest.tsx`, `ranges.tsx`,
   `textOnly.tsx`, `wildcard.tsx`, `vocabulary.tsx`, `booleans.tsx`). Copy a neighbour of the same
   kind.

## es-api (only if the filter shows counts, or needs a GET param)

Package: `packages/es-api`, file `src/resources/occurrence/occurrence.config.js`.

1. Add an entry under `options`: `myField: { type: 'keyword', field: 'es.path.to.field' }`. Types
   are keyword, numeric, date, boolean, text, geo_shape, geo_distance, nested. Numeric and date
   fields that accept ranges also need `get: { type: 'range_or_term', ... }` (copy `year`).
2. That entry is what makes facets and cardinality work: `src/requestAdapter/aggregations/`
   drops any metric key missing from `options`, and only keyword, numeric, and boolean fields can be
   faceted.
3. Only if the field should be sortable, add it to `allowedSortBy` in `occurrence.dataSource.js`.
   Only if it should appear in result rows, add a line in `reduce.js`.
4. es-api has no tests and needs the VPN. Verify with `node --check` and by reading the diff.

## graphql-api (only if the filter shows counts)

Package: `packages/graphql-api`, directory `src/resources/occurrence/`.

1. Add the field name to `helpers/fields/fieldsWithFacetSupport.js`. Resolvers are generated from
   that list in `occurrence.resolver.js`.
2. Add the field to `type OccurrenceFacet` in `occurrenceSearch.type.js`, e.g.
   `myField(size: Int, from: Int): [OccurrenceFacetResult_string]`. Pick the result type that matches
   the value type (`_string`, `_float`, `_boolean`, ...; see neighbours).
3. If the values are a GBIF enum, add `myField: 'enumName'` to `STRING_FACET_ENUMS` at the top of
   `occurrence.resolver.js` so bucket labels get translated. If the enum is new to graphql-api, run
   `npm run write-enums` and commit the updated `src/helpers/enums/enums.json`.
4. Optional: cardinality (`fieldsWithCardinalitySupport.js` plus `type OccurrenceCardinality`),
   stats and histograms (the sibling files and types), sorting (`enum OccurrenceSortBy`).
5. `npm run develop`, then run the facet query in the Apollo sandbox against a dev es-api.

## gbif-org

Package: `packages/gbif-org`.

1. **Filter config.** Add an exported config object in the matching file under
   `src/routes/occurrence/search/filters/`. Required fields: `filterType`, `filterHandle` (the URL
   parameter name), `displayName`, `filterTranslation: 'filters.<handle>.name'`,
   `about: () => <Message id="filters.<handle>.description" />`, and `group`. The `group` must be one
   of the `groups` in `occurrenceSearchPage.tsx` (record, occurrence, organism, provenance, ...).
   Add a `facetQuery` (a `/* GraphQL */` string with a unique operation name) if counts should
   show. ENUM filters take `options` from a JSON array in `src/enums/basic/`; SUGGEST filters take a
   `suggestConfig` from `src/utils/suggestEndpoints.tsx`.
2. **Register it** in `src/routes/occurrence/search/filters.tsx`: import the config and add
   `myField: generateFilters({ config: myFieldConfig, searchConfig, formatMessage })` to the object
   in `useFilters()`. The key is the filter handle.
3. **Declare the URL parameter** in `src/routes/occurrence/search/searchConfig.ts`. Every handle
   must be in `config.fields`, otherwise `useFilterParams` silently drops it from the URL. For a
   plain keyword filter, add the handle to the `otherParams` array at the bottom. Add an explicit
   `fields` entry when you need `defaultKey` (the API key differs from the handle, e.g.
   `'nucleotideSequence.targetGene'`), `defaultType`, `v1.supportedTypes` for ranges, or
   `singleValue`.
4. **Translations** in `packages/react-components/locales/source/en-developer/components/`:
   `filters.json` gets `"<handle>": { "name", "description" }` (plus `isNotNull` / `isNull` if the
   filter allows existence). `filterAliases.json` gets a comma-separated list of search synonyms
   for the "More filters" search box. Enum values need `enums/<enumName>.json` entries, and a new
   enum file must be added to `locales/scripts/stitchFile.js`. See
   [add-a-translation.md](./add-a-translation.md).
5. **Visibility.** New filters land under "More filters". To show one in the bar by default on
   gbif.org, add it to `highlightedFilters` under `occurrenceSearch` in `src/config/configDefaults.ts`
   or a per-entity block in `src/gbif/config.ts`. Hosted portals set their own lists in their config.
6. **Codegen.** `npm run codegen` and commit `src/gql/`.
7. **Verify.** `npm run type-check`, `npm run vitest` (the filter adapter tests in
   `src/dataManagement/filterAdapter/*.test.ts` cover predicate and v1 conversion; extend them for
   a new `defaultKey` or type), then open occurrence search, apply the filter, and check the URL
   round-trips, the table updates, the popover shows counts, and the download tab builds a
   predicate that API v1 accepts.

## Caveats

- **The handle is a public contract.** It is the URL parameter, the key portals use in
  `highlightedFilters` / `excludedFilters`, and the translation id. Renaming it breaks bookmarks and
  portal configs. `src/hp/configAdapter.tsx` already carries renames for a few old names; do not
  add to that list lightly.
- **Downloads reuse the predicate.** `OccurrenceSearchDownload.tsx` sends the same predicate, so
  a filter that API v1 does not accept will break downloads even if the table works. The optional
  value-label switch in `src/routes/occurrence/download/key/predicate.tsx` can be extended so the
  download page shows a label instead of a raw key.
- **Enum option lists in `src/enums/` are hand-maintained snapshots.** There is no generator in
  gbif-org. When adding an enum filter, check the list against the API enumeration and update it.
- **Hosted portals.** The filter list is shared; portals that do not want the filter exclude it in
  their config. Nothing portal-specific needs to be done, but test the hp build if you touched
  `filters.tsx` structure or `configAdapter.tsx`.
- **Facets without an es-api entry fail with a 400**, not an empty list. If the popover shows an
  error instead of counts, the es-api config is the first place to look.
