# How to add a new filter type (widget)

The filter types in `src/components/filters/filterTools.tsx` (ENUM, SUGGEST, RANGE, DATE_RANGE,
WILDCARD, LOCATION, TAXON, SEQUENCE, ...) are prebuilt widgets. Almost every new filter uses one of
them; see [add-an-occurrence-filter.md](./add-an-occurrence-filter.md). A new type is for the rare
case where the user needs a different way to pick a value: a new input, a new value shape, or both.
The sequence similarity filter (paste a nucleotide sequence, get matched ids) is the latest example.

**Reference example to copy:** SEQUENCE. Widget in `src/components/filters/sequenceFilter/`, the
`getSequenceFilter` wrapper and `generateFilters` branch in `filterTools.tsx`, per-filter config in
`src/routes/occurrence/search/filters/sequence.tsx`, and the serializer plus URL hooks in
`src/routes/occurrence/search/searchConfig.ts`.

## First check the escape hatches

- **An existing type with different config.** Most types take options such as `allowExistence`,
  `allowNegations`, `facetQuery`, `regex`, or `filterButtonProps.getCount`. Check the type's config
  type in `filterTools.tsx` before writing a widget.
- **CUSTOM_PREDICATE** (`src/components/filters/customPredicateFilter.tsx`) accepts any raw JSON
  predicate under the `predicate` handle. It expresses any query, but it is a text box, so it suits
  power users, not a product feature.

## Checklist

1. **Decide the value shape first.** It drives how much adapter work you need. Values live in the
   filter state (`FilterType` in `src/contexts/filter.tsx`: `must` / `mustNot` maps of handle to an
   array of untyped values). Three options, cheapest first:
   - A plain string or number. Flows through everything as an `equals` / `in` predicate.
   - A JSON string, as SEQUENCE does (`{ sequence, selected, ids }`). Passes the URL and API v1
     adapters as a string. You then add a per-field `serializer` in `searchConfig.fields` to turn
     it into the real predicate, and `urlEncodeFilter` / `urlDecodeFilter` hooks if the URL should
     not carry the raw JSON.
   - A new predicate-like object (`{ type: 'myType', ... }`). `filter2predicate.tsx` spreads it into
     the predicate without changes, but `filter2v1.tsx` throws `UNKNOWN_PREDICATE_TYPE` for types it
     does not know and `v12filter.ts` only decodes `range` and `geoDistance`. You would extend both
     in `src/dataManagement/filterAdapter/` and add the type to `fields[x].v1.supportedTypes`.
2. **Add the type** to `enum filterConfigTypes` in `filterTools.tsx`.
3. **Add a config type** `filterMyConfig = filterConfigShared & { filterType: filterConfigTypes.MY; ...widget-specific props }`
   and add it to the `filterConfig` union further down the same file. Keep widget props here, not
   in the shared part.
4. **Write the widget** in `src/components/filters/myFilter.tsx` (or a folder for several files).
   It receives `{ onApply, onCancel, className, style, pristine }` plus the config fields and
   `searchConfig` from the wrapper. It reads and writes state with `useContext(FilterContext)`
   (`filter`, `setField`, `setFullField`, `filterHash`). For counts, use `useSearchContext()`,
   `useQuery`, and `getAsQuery({ filter, searchContext, searchConfig })` like the enum widget. Render
   `ApplyCancel` from `filterTools.tsx` at the bottom; it already carries the translated buttons.
5. **Write the wrapper** `getMyFilter({ config, searchConfig })` next to `getSequenceFilter` in
   `filterTools.tsx`. It returns a `React.forwardRef` that passes the popover props and the picked
   config fields to the widget.
6. **Add a branch to `generateFilters()`**, the if/else chain on `config.filterType` in
   `filterTools.tsx`. Call `generateFilter({ config, formatMessage, Content: getMyFilter(...) })`.
   Pass `popoverClassName` for a wider popover, and set `setting.Button` only if the default
   button (label for one value, count badge otherwise) does not fit.
7. **Summary and label.** `getFilterSummary` and `filterButton.tsx` are generic. Supply a
   `displayName` component per filter (see `src/components/filters/displayNames.tsx`), and use
   `filterButtonProps.getCount` or `hideSingleValues` if the default count is wrong for your shape.
8. **Use it once.** Add a filter config with `filterType: filterConfigTypes.MY` in a search's
   `filters/` folder and register it in that search's `filters.tsx`, following
   [add-an-occurrence-filter.md](./add-an-occurrence-filter.md). If the widget needs a provider
   (SEQUENCE has `sequenceResolutionContext`), mount it in that search's page component.
9. **Translations.** Reuse the shared widget strings in `filterSupport.json` (`apply`, `cancel`,
   `clear`, `invert`, `exclude`, `existence`, `backToSelect`, `invalidValue`, ...). Only add new
   `filterSupport.*` keys for text that no existing widget has. Per-filter text stays under
   `filters.<handle>.*`.
10. **Tests.** Extend `src/dataManagement/filterAdapter/filter2predicate.test.ts` with the
    serializer case and `filter2v1.test.ts` if you added a predicate type. There are no component
    tests for widgets; verify in the browser.
11. **Verify.** `npm run type-check`, `npm run vitest`, then in `npm run develop`: open the filter,
    apply a value, confirm the URL round-trips on reload, the table and map update, the button
    summary is right, and the download tab builds a predicate API v1 accepts. Also build the hosted
    portal target, since filters are shared.

## Caveats

- **Filter code is shared by eight searches** (occurrence, dataset, literature, event, resource,
  institution, collection, taxon, each with a `search/filters.tsx`). A new type is available to all
  of them, and a change to an existing type affects all of them. Each search still needs its own
  config entry to use it.
- **`filter2v1.tsx` does not call the serializer.** Downloads and API v1 links go through it, so a
  value shape that only works via `serializer` must still be something v1 accepts as a string, or
  you extend `filter2v1.tsx`. This is why SEQUENCE stores a JSON string.
- **Download reverse mapping is occurrence-only.** `src/routes/occurrence/download/key/sections/getPredicateAsFilter.tsx`
  turns a download predicate back into filter state and branches on some types. Check it if users
  should be able to reopen a download as a search.
- **FREE_TEXT and INLINE_TOGGLE bypass the popover** in `generateFilter`. If your widget should sit
  inline in the bar rather than open a popover, follow those branches instead.
- **Prefer extending an existing widget** over a parallel one when the difference is small. Two
  widgets that drift apart cost more than one with an extra option.
