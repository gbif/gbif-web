# How to add a chart

Charts live in `src/components/dashboard/`. Highcharts via `highcharts-react-official`. Views are
`COLUMN | PIE | TABLE | TIME | MAP`; a chart's `options` prop lists which it offers. Only the
occurrence search dashboard has a registry; every other dashboard hardcodes its charts.

**Reference commits:** `a1053ac` (standard enum chart, 4 files) and `70bea4c` (custom chart with a
level dropdown, `Custom.tsx`).

## First decide: standard or custom

| Kind          | Build with                                                                                                                                                                                                                                        | When                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Standard enum | `StandardEnumChart` in `charts/enumCharts.tsx`: `fieldName`, `options`, `includeMapPredicate`, optional `titleTranslationId`, `enumKeys`, `enableOther`                                                                                           | Field is a facet with enum values; title `filters.<field>.name`, labels `enums.<field>.<KEY>`     |
| Standard key  | `KeyChartGenerator` in `charts/keyCharts.tsx`: `fieldName`, `gqlEntity`, `transform` returning `{ key, title, count, filter: { <handle>: [key] } }`                                                                                               | Field is a facet on an entity key (dataset, publisher, ...)                                       |
| Custom        | Component in `Custom.tsx` or a folder under `charts/`, reusing `Card`, `CardHeader`, `ChartViewOptions`, `ChartView`, `ChartMessages` (`charts/OneDimensionalChart.tsx`), `useFacets` (`charts/GroupByTable.tsx`), wrapped in `ChartClickWrapper` | Own query, own controls (rank or level dropdown), own layout. Examples: `Taxa`, `GadmGid`, `Iucn` |

Standard builders assemble GraphQL as a runtime string, so no codegen. The facet field must exist in
graphql-api first (see [add-an-occurrence-filter.md](./add-an-occurrence-filter.md)). Custom charts
using typed `graphql()` need `npm run codegen`.

## Checklist

1. **Build it.** Prop contract: `predicate`, `q`, `interactive`, `visibilityThreshold`,
   `defaultOption`, `className`. A chart with its own setting (rank, level) reads it from props and
   persists via `onParamsChange({ rank })`; the dashboard stores it in the `layout` URL grammar
   (`layoutSerialization.ts`, e.g. `taxa.rank-GENUS.v-MAP`).
2. **Export twice.** From `_chartImpl.ts` (`ChartName` is derived from its exports) and as
   `export const Name = lazyChart('Name')` in `index.tsx`. Consumers import `* as charts` from the
   barrel; never import `_chartImpl`. Add to `lookup` in `StaticDashboard.tsx` if it should be
   addressable by id there.
3. **Register** in `src/routes/occurrence/search/views/dashboard/dashboard.jsx`
   (`preconfiguredCharts`): `id: { translation?, r?: true, component: ({ predicate, ...props }) =>
<charts.Name predicate={predicate} interactive {...props} /> }`. `translation` defaults to
   `filters.<id>.name`; `r` makes it resizable.
4. **Allow the id.** `dash.jsx` passes `chartsTypes` = hardcoded list + available filter handles.
   `Dashboard` drops ids not in that list. A non-filter id goes in the hardcoded list.
5. **Group it.** `chartGroups` in `DashboardBuilder.jsx`, `{ group: { values: [ids] } }`, drives the
   `<optgroup>`s in the add-chart select. Order from `groupOrdering`. Unlisted ids land in `other`.
   Groups mirror the filter groups.
6. **Translations.** Select label: `filters.<id>.name` or the `translation` key. Card title: the
   chart's `titleTranslationId`. Group label: `dashboard.group.<group>`. Shared strings
   (`dashboard.numberOfOccurrences`, `.other`, `.unknown`, `.noData`) exist. New keys go in
   `components/dashboard.json`; see [add-a-translation.md](./add-a-translation.md).
7. **Other dashboards** hardcode `<charts.Name predicate={...} />` inside `DashBoardLayout`:
   `routes/dataset/key/dashboard/sections.tsx`, `publisher/key/metrics.tsx`,
   `collection/key/Dashboard.tsx`, `taxon/key/Metrics.tsx`, `country/key/publishing.tsx`,
   `network/key/metrics.tsx`. Add it there if wanted.
8. **Verify.** `npm run type-check`, `npm run vitest`, codegen if needed. In the browser: add the
   chart from the select under the right group, click a bar (sets a filter when `interactive`),
   reload (layout restored from URL and localStorage), switch views.

## The two-dimensional chart (`crosstab`)

`charts/crosstab/` is a heatmap of any two dimensions: a count for each pair, coloured by count
(absolute) or by share of the row or column (relative). Add a dimension in `dimensions.ts`: it needs
an API facet (terms) or histogram (number) field, the filter handle a click sets, and a label id.
Dimension ids are in shared `layout` URLs (`crosstab.rows-basisOfRecord.cols-year.cInt-5`): do not
rename.

- **One query, no API change.** Each facet or histogram bucket has `occurrences`, a search limited to
  that bucket, so the rows are the outer facet and the columns a facet inside each row bucket
  (`plan.ts: buildQuery`). Labels come from the API's `label(language:)` on every facet bucket.
- **Numbers are histograms** with a bucket size: automatic (about ten buckets) or set by the user
  (`rInt`, `cInt`), raised if it would give more than 24. Planning takes up to three requests in a
  row (`useCrosstab.ts`): minimum and maximum, a fine histogram to find the 1st to 99th percentile,
  then the table. When a few outliers (elevation typos) stretch the scale, the table shows only that
  range (the `window`) and says so; ordinary data is left whole.
- **Columns** are the 8 values with most records under the filter (all 12 for months), counted from
  a top-level facet on the column field. Each row's column facet asks for 40 values, so this is only
  exact when the column has at most 40 values: the query also asks for the column's cardinality
  (`fitsOverall`). Above that, the same data is shown as each row's own 8 most frequent values,
  which are exact, and the card says why. There is no setting for this.
- **Shares** divide by true totals: a row's count from the row facet, a column's from the top-level
  column facet. With a multi-valued field a row's or column's shares can add up to more than 100%.
- **Colour** is by rank among the cells shown (`makeIntensity`), not by value: one huge cell must not
  turn the rest pale. Ink is white or dark by contrast against the theme's `--primary500`.
- Logic that does not need React is in `plan.ts` and tested in `plan.test.ts`. A GraphQL variable
  that is declared and unused makes the whole query fail, so `buildQuery` declares `$language` and
  `$checklistKey` only when used.

## Caveats

- **Chart id is a public contract.** It is in shared `layout` URLs and in localStorage
  (`occurrenceDashboardLayout`). Do not rename.
- **Portals cannot pick charts.** Config only hides the dashboard tab (`occurrenceSearch.tabs`) or
  excludes filters, which also removes the matching charts.
- **MAP view** renders only inside `MapChartsEnabledContext` and when
  `PUBLIC_DEFAULT_ENABLE_MAP_CHARTS` is true.
- **`map`, `table`, `gallery`** ignore `predicate` and read the search context.
- **Charts are lazy.** Heavy dependencies go in the chart file, not the barrel.
- **Stale fallbacks.** `src/config/fallback/messages/` lags the translation source. A raw
  `dashboard.group.*` id in dev may only mean the snapshot needs `npm run update-fallbacks`.
