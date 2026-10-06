# How to add a filter type (widget)

The types in `src/components/filters/filterTools.tsx` (ENUM, SUGGEST, RANGE, DATE_RANGE, WILDCARD,
LOCATION, TAXON, SEQUENCE, ...) are prebuilt widgets. New filters use them
([add-an-occurrence-filter.md](./add-an-occurrence-filter.md)). A new type is for a different way
to pick a value: new input, new value shape, or both. Rare.

**Reference:** SEQUENCE. Widget `src/components/filters/sequenceFilter/`, wrapper `getSequenceFilter`
and `generateFilters` branch in `filterTools.tsx`, config `src/routes/occurrence/search/filters/sequence.tsx`,
serializer and URL hooks in `src/routes/occurrence/search/searchConfig.ts`.

## Escape hatches first

- Existing types take options (`allowExistence`, `allowNegations`, `facetQuery`, `regex`,
  `filterButtonProps.getCount`). Check the type's config type.
- CUSTOM_PREDICATE (`src/components/filters/customPredicateFilter.tsx`) accepts raw JSON under the
  `predicate` handle. Any query, but a text box.

## Checklist

1. **Value shape first.** State is `FilterType` (`src/contexts/filter.tsx`): `must`/`mustNot` maps
   of handle to untyped values. Cheapest first:
   - Plain string or number: flows everywhere as `equals`/`in`.
   - JSON string (SEQUENCE: `{ sequence, selected, ids }`): passes URL and v1 adapters as a string;
     a per-field `serializer` in `searchConfig.fields` builds the real predicate;
     `urlEncodeFilter`/`urlDecodeFilter` hooks if the URL should not carry raw JSON.
   - New predicate object (`{ type: 'myType', ... }`): `filter2predicate.tsx` spreads it fine, but
     `filter2v1.tsx` throws `UNKNOWN_PREDICATE_TYPE` and `v12filter.ts` decodes only `range` and
     `geoDistance`. Extend both (`src/dataManagement/filterAdapter/`) and list the type in
     `fields[x].v1.supportedTypes`.
2. Add to `enum filterConfigTypes`.
3. Add `filterMyConfig = filterConfigShared & { filterType: filterConfigTypes.MY; ...widget props }`
   and add it to the `filterConfig` union.
4. **Widget** in `src/components/filters/myFilter.tsx`. Receives `{ onApply, onCancel, className,
   style, pristine }` + config fields + `searchConfig`. State via `useContext(FilterContext)`
   (`filter`, `setField`, `setFullField`, `filterHash`). Counts via `useSearchContext()`, `useQuery`,
   `getAsQuery({ filter, searchContext, searchConfig })`. Render `ApplyCancel` at the bottom.
5. **Wrapper** `getMyFilter({ config, searchConfig })` next to `getSequenceFilter`: a `forwardRef`
   passing popover props and picked config to the widget.
6. **Branch in `generateFilters()`** (if/else on `config.filterType`):
   `generateFilter({ config, formatMessage, Content: getMyFilter(...) })`. `popoverClassName` for
   width; `setting.Button` only if the default (label for one value, count badge otherwise) fails.
7. **Summary** is generic (`getFilterSummary`, `filterButton.tsx`). Supply `displayName` per filter
   (`displayNames.tsx`); `filterButtonProps.getCount`/`hideSingleValues` when the count is wrong.
8. **Use it once**: a filter config with `filterType: filterConfigTypes.MY`, registered in a search's
   `filters.tsx`. Providers (SEQUENCE's `sequenceResolutionContext`) mount in that search's page.
9. **Translations**: reuse `filterSupport.*` (`apply`, `cancel`, `clear`, `invert`, `exclude`,
   `existence`, `backToSelect`, `invalidValue`). Per-filter text under `filters.<handle>.*`.
10. **Tests**: `filter2predicate.test.ts` (serializer), `filter2v1.test.ts` (new predicate type). No
    widget tests; verify in the browser.
11. `npm run type-check`, `npm run vitest`; in the browser: apply, reload (URL round-trip), table and
    map update, button summary, download predicate accepted by v1. Build hp too.

## Caveats

- **Shared by eight searches** (`src/routes/*/search/filters.tsx`). A new type is available to all;
  a change to an existing widget affects all.
- **`filter2v1.tsx` does not call the serializer.** Downloads and v1 links go through it, so the
  stored value must be something v1 accepts as a string, or extend `filter2v1.tsx`. Hence SEQUENCE
  stores JSON as a string.
- **Download reverse mapping** (`src/routes/occurrence/download/key/sections/getPredicateAsFilter.tsx`)
  branches on some types. Check it if downloads should reopen as a search.
- **FREE_TEXT and INLINE_TOGGLE bypass the popover** in `generateFilter`. Follow them for an inline
  widget.
- **Prefer an option on an existing widget** over a parallel one.
