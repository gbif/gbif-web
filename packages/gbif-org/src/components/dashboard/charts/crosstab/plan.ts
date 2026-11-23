// Two-dimensional chart: what to ask the API for, how to read the answer, how to colour it. No React,
// so it can be tested on its own.
//
// The API has no cross-count, but every facet or histogram bucket carries `occurrences`, a search
// restricted to that bucket. So the table is one query: the row axis, and inside each row bucket the
// column axis. A numeric axis is a histogram, which needs an interval; that is planned from the
// field's minimum and maximum under the current filter (`buildStatsQuery`).
import type { Dimension } from './dimensions';

export const LIMITS = {
  /** Lines of a terms axis down the side, per page; the rest are counted together. */
  rows: 12,
  /** A terms column with at most this many values under the filter shows all of them. */
  allCols: 12,
  /** Columns of a terms axis with more values than `allCols`: the biggest by their total. */
  cols: 8,
  /** Columns of a dimension with few, fixed values read in order (months): all of them. */
  ordered: 12,
  /** Values listed in each row of the "top per row" layout. */
  rank: 8,
  /** Histogram buckets: aim for `target`, never more than `max` (an interval is raised to keep to it). */
  bins: { target: 10, max: 24 },
  /**
   * Values asked for in each row's column facet. "Top overall" picks the biggest columns from these, so
   * it is only offered when the column has no more values than this: then every row's facet is complete
   * and every cell exact (`fitsOverall`).
   */
  nested: 40,
};

export type Layout = 'overall' | 'perRow';
export type Shade = 'count' | 'row' | 'column';

/** Round to 12 significant digits: 0.1 * 3 is 0.30000000000000004 otherwise. */
export const tidy = (n: number) => Number(n.toPrecision(12));

const sumOf = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

const num = (x: unknown): number | null => {
  if (x === null || x === undefined || x === '') return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
};

// ---- intervals ---------------------------------------------------------------------------------

export type Stats = { min?: number | null; max?: number | null };

/** A round width near `raw`: 1, 2, 2.5 or 5 times a power of ten. */
export function niceWidth(raw: number): number {
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = [1, 2, 2.5, 5, 10].find((x) => x * p >= raw * 0.999) ?? 10;
  return tidy(m * p);
}

/**
 * Bucket sizes are whole numbers, whatever the field: the API names a bucket by its lower edge as an ID,
 * and a fractional edge (-89.5) is an error that blanks the whole histogram.
 */
const whole = (width: number) => Math.max(1, Math.ceil(width));

/** About `bins.target` buckets between the smallest and largest value. */
export function autoInterval(stats: Stats | undefined): number {
  const [min, max] = [num(stats?.min), num(stats?.max)];
  if (min === null || max === null || !(max > min)) return 1;
  return whole(niceWidth((max - min) / LIMITS.bins.target));
}

/**
 * The interval to use: the one asked for, raised if it would give more than `bins.max` buckets,
 * or the automatic one. `auto` is returned too, to show as the default.
 */
export function resolveInterval(
  stats: Stats | undefined,
  requested?: number
): { interval: number; auto: number; raised: boolean } {
  const auto = autoInterval(stats);
  if (!(Number(requested) > 0)) return { interval: auto, auto, raised: false };
  const [min, max] = [num(stats?.min), num(stats?.max)];
  const least = min !== null && max !== null ? (max - min) / LIMITS.bins.max : 0;
  const interval = whole(Math.max(Number(requested), least));
  return { interval, auto, raised: interval > Number(requested) };
}

/** A bucket as text: "2000–2009", "2000" for whole numbers in buckets of one, "10–20" otherwise. */
export function binLabel(
  key: number,
  interval: number,
  integer: boolean,
  format: (n: number) => string = String,
  range: (from: string, to: string) => string = (from, to) => `${from}–${to}`
): string {
  if (integer) {
    return interval === 1 ? format(key) : range(format(key), format(tidy(key + interval - 1)));
  }
  return range(format(key), format(tidy(key + interval)));
}

// ---- queries -----------------------------------------------------------------------------------

/** An axis as planned: the dimension and, for histograms, the interval. */
export type AxisPlan = {
  dim: Dimension;
  interval?: number;
  /**
   * Histograms only: when a few outliers (elevations of 100,000 m) would stretch the scale so that nearly
   * everything fell in one bucket, the values shown. Records outside are left out of the whole table.
   */
  window?: Range;
};

/** Minimum and maximum of each numeric axis, under the filter. Undefined when no axis is numeric. */
export function buildStatsQuery(rows: Dimension, cols: Dimension): string | undefined {
  const fields = [
    ['rows', rows],
    ['cols', cols],
  ].filter(([, d]) => (d as Dimension).kind === 'histogram') as [string, Dimension][];
  if (!fields.length) return undefined;
  const selection = fields.map(([alias, d]) => `${alias}: ${d.id} { min max }`).join(' ');
  return `query crosstabStats($q: String, $predicate: Predicate) {
  search: occurrenceSearch(q: $q, predicate: $predicate) { stats { ${selection} } }
}`;
}

export type StatsData = { search?: { stats?: { rows?: Stats; cols?: Stats } } };

/** The values an axis shows: `from` up to, not including, `to`. */
export type Range = { from: number; to: number };

/** Align a range to whole buckets, so the end buckets are not cut short. */
function snap(t: Stats, interval: number): Range {
  const from = tidy(Math.floor(Number(t.min) / interval) * interval);
  let to = tidy(Math.ceil(Number(t.max) / interval) * interval);
  if (to <= from) to = tidy(from + interval);
  return { from, to };
}

/**
 * The intervals to ask for, from the stats and what the user asked for. `trimmed` is where most records
 * are, for an axis whose outliers would stretch the scale: the interval is planned for that range,
 * which then becomes the axis's window.
 */
export function planAxes(
  rows: Dimension,
  cols: Dimension,
  stats: StatsData | undefined,
  requested: { rows?: number; cols?: number },
  trimmed: { rows?: Stats; cols?: Stats } = {}
): {
  rows: AxisPlan;
  cols: AxisPlan;
  auto: { rows?: number; cols?: number };
  raised: { rows: boolean; cols: boolean };
} {
  const axis = (dim: Dimension, s: Stats | undefined, ask?: number, t?: Stats) => {
    if (dim.kind !== 'histogram') return { plan: { dim } as AxisPlan };
    const r = resolveInterval(t ?? s, ask);
    return {
      r,
      plan: { dim, interval: r.interval, window: t ? snap(t, r.interval) : undefined } as AxisPlan,
    };
  };
  const r = axis(rows, stats?.search?.stats?.rows, requested.rows, trimmed.rows);
  const c = axis(cols, stats?.search?.stats?.cols, requested.cols, trimmed.cols);
  return {
    rows: r.plan,
    cols: c.plan,
    auto: { rows: r.r?.auto, cols: c.r?.auto },
    raised: { rows: !!r.r?.raised, cols: !!c.r?.raised },
  };
}

// ---- outliers ----------------------------------------------------------------------------------

/** Buckets of the coarse histogram that finds where the records are: at most this many. */
export const COARSE_BINS = 200;
/** The range that holds the 1st to 99th percentile is used when it is under this share of min to max. */
export const TRIM_BELOW = 0.7;

export function coarseInterval(stats: Stats | undefined): number | undefined {
  const [min, max] = [num(stats?.min), num(stats?.max)];
  if (min === null || max === null || !(max > min)) return undefined;
  return whole(niceWidth((max - min) / COARSE_BINS));
}

/** A fine histogram of each numeric axis, to find the 1st and 99th percentile. Undefined if none has a spread. */
export function buildCoarseQuery(
  rows: Dimension,
  cols: Dimension,
  stats: StatsData | undefined
): string | undefined {
  const fields = (
    [
      ['rows', rows],
      ['cols', cols],
    ] as const
  ).flatMap(([alias, dim]) => {
    const interval =
      dim.kind === 'histogram' ? coarseInterval(stats?.search?.stats?.[alias]) : undefined;
    return interval ? [`${alias}: ${dim.id}(interval: ${interval}) { buckets { key count } }`] : [];
  });
  if (!fields.length) return undefined;
  return `query crosstabCoarse($q: String, $predicate: Predicate) {
  search: occurrenceSearch(q: $q, predicate: $predicate) { histogram { ${fields.join(' ')} } }
}`;
}

export type CoarseData = {
  search?: {
    histogram?: Record<
      string,
      { buckets?: { key: string | number; count: number | string }[] | null } | null
    > | null;
  } | null;
};

/**
 * Where most of an axis's records are, when the minimum and maximum say much more: the buckets holding the
 * 1st to 99th percentile. Undefined when that is most of the range anyway, so that a table of ordinary
 * data leaves nothing out.
 */
export function robustRange(
  data: CoarseData | undefined,
  alias: 'rows' | 'cols',
  stats: Stats | undefined
): Stats | undefined {
  const interval = coarseInterval(stats);
  const raw = data?.search?.histogram?.[alias]?.buckets;
  const [min, max] = [num(stats?.min), num(stats?.max)];
  if (!interval || !raw?.length || min === null || max === null) return undefined;
  const buckets = raw
    .map((b) => ({ key: Number(b.key), count: Number(b.count) || 0 }))
    .sort((a, b) => a.key - b.key);
  const total = sumOf(buckets.map((b) => b.count));
  if (!(total > 0)) return undefined;
  let [seen, lo, hi, found] = [
    0,
    buckets[0].key,
    buckets[buckets.length - 1].key + interval,
    false,
  ];
  for (const b of buckets) {
    seen += b.count;
    if (!found && seen >= total * 0.01) [lo, found] = [b.key, true];
    if (seen >= total * 0.99) {
      hi = b.key + interval;
      break;
    }
  }
  return hi - lo < TRIM_BELOW * (max - min) ? { min: lo, max: hi } : undefined;
}

/** The filter with each axis's window added: records outside a window are left out. */
export function withWindows(predicate: unknown, axes: AxisPlan[]): unknown {
  const extra = axes.flatMap((a) =>
    a.window
      ? [
          { type: 'greaterThanOrEquals', key: a.dim.id, value: a.window.from },
          { type: 'lessThan', key: a.dim.id, value: a.window.to },
        ]
      : []
  );
  if (!extra.length) return predicate;
  return { type: 'and', predicates: [...(predicate ? [predicate] : []), ...extra] };
}

/** One level of the query: the axis's buckets, with `inner` (a selection on `occurrences`) in each. */
function level(axis: AxisPlan, alias: string, size: number, inner?: string, paged = false): string {
  const { dim } = axis;
  const occurrences = inner ? `occurrences { ${inner} }` : '';
  if (dim.kind === 'histogram') {
    return `histogram { ${alias}: ${dim.id}(interval: ${axis.interval ?? 1}) { buckets { key count ${occurrences} } } }`;
  }
  const from = paged ? ', from: $from' : '';
  const checklist = dim.checklist ? ', checklistKey: $checklistKey' : '';
  return `facet { ${alias}: ${dim.id}(size: ${size}${from}${checklist}) { key count label(language: $language) ${occurrences} } }`;
}

/** Rows come a page at a time when they are terms whose facet takes `from`. Histograms come whole. */
export const pagesRows = (rows: AxisPlan) => rows.dim.kind === 'terms' && !rows.dim.noPaging;

const cardinalityOf = (alias: string, dim: Dimension) =>
  `${alias}: ${dim.id}${dim.checklist ? '(checklistKey: $checklistKey)' : ''}`;

/** The query for the table: rows, and the columns inside each row. `colSize` is how many values of a terms column. */
export function buildQuery(
  rows: AxisPlan,
  cols: AxisPlan,
  colSize: number = LIMITS.nested
): string {
  // GraphQL rejects a variable that is declared and not used: labels (and so the language) come with
  // terms axes only, the checklist with taxon axes only.
  const language =
    rows.dim.kind === 'terms' || cols.dim.kind === 'terms' ? ', $language: String' : '';
  const checklist = rows.dim.checklist || cols.dim.checklist ? ', $checklistKey: ID' : '';
  const paged = pagesRows(rows);
  // How many values a terms column has decides which columns are shown and whether they are exact;
  // how many rows there are, whether there is a next page.
  const counted = [
    ...(paged ? [cardinalityOf('rows', rows.dim)] : []),
    ...(cols.dim.kind === 'terms' ? [cardinalityOf('cols', cols.dim)] : []),
  ];
  const cardinality = counted.length ? `cardinality { ${counted.join(' ')} }` : '';
  return `query crosstab($q: String, $predicate: Predicate${language}${checklist}${paged ? ', $from: Int' : ''}) {
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) { total }
    ${cardinality}
    ${level(cols, 'colTotals', LIMITS.nested)}
    ${level(rows, 'rows', LIMITS.rows, level(cols, 'cols', colSize), paged)}
  }
}`;
}

// ---- reading the answer ------------------------------------------------------------------------

type RawBucket = {
  key: string | number;
  count: number | string;
  label?: string | null;
  occurrences?: Raw | null;
};
export type Raw = {
  facet?: Record<string, RawBucket[] | null | undefined> | null;
  histogram?: Record<string, { buckets?: RawBucket[] | null } | null | undefined> | null;
};
export type CrosstabData = {
  /** In the value count only: all records under the filter with a column value, in every row. */
  all?: { documents?: { total?: number } } | null;
  search?:
    | (Raw & {
        documents?: { total?: number };
        cardinality?: { rows?: number | string | null; cols?: number | string | null } | null;
      })
    | null;
};

type Bucket = { key: string | number; label: string; count: number; occurrences?: Raw | null };

function readBuckets(parent: Raw | null | undefined, alias: string, dim: Dimension): Bucket[] {
  const histogram = dim.kind === 'histogram';
  const raw = histogram ? parent?.histogram?.[alias]?.buckets : parent?.facet?.[alias];
  return (raw ?? []).map((b) => ({
    key: histogram ? Number(b.key) : b.key,
    label: b.label ?? String(b.key),
    count: Number(b.count) || 0,
    occurrences: b.occurrences,
  }));
}

/** Same key, same string: a histogram's keys are floats that must match after rounding. */
const keyOf = (dim: Dimension, key: string | number) =>
  dim.kind === 'histogram' ? String(tidy(Number(key))) : String(key);

const byKeyOrder = (a: { key: string | number }, b: { key: string | number }) =>
  Number(a.key) - Number(b.key) || String(a.key).localeCompare(String(b.key));

/** Every bucket from the lowest to the highest, empty or not, so the scale reads evenly. */
function fill(buckets: Bucket[], interval: number): Bucket[] {
  if (!buckets.length) return [];
  const have = new Map(buckets.map((b) => [String(tidy(Number(b.key))), b]));
  const keys = buckets.map((b) => tidy(Number(b.key)));
  const [min, max] = [Math.min(...keys), Math.max(...keys)];
  const out: Bucket[] = [];
  for (
    let k = min;
    k <= max + interval / 2 && out.length < LIMITS.bins.max + 2;
    k = tidy(k + interval)
  ) {
    out.push(have.get(String(k)) ?? { key: k, label: String(k), count: 0 });
  }
  return out;
}

export type Line = { key: string | number; label: string; count: number };

export type Table = {
  rows: Line[];
  cols: Line[];
  /** counts[row][col] */
  counts: number[][];
  /** Per row: records with no value in the column field. */
  noValue: number[];
  /** Per row: records with a value that isn't a column; null for a multi-valued column (unknowable). */
  other: (number | null)[];
  /** Some record under the filter has no column value: the column is shown on every page. */
  showNoValue: boolean;
  /** The column has values that aren't columns (and has one value per record): shown on every page. */
  showOther: boolean;
  /** All records matching the filter. */
  total: number;
  /** Records in rows that are not shown (other values, or no value). */
  rowsOther: number;
  /**
   * Column counts are each value's total under the filter, across all rows. Otherwise (the totals
   * didn't come back) they are the sum over the rows shown.
   */
  colTotalsKnown: boolean;
  /** Every value of a terms column is a column; otherwise the biggest `LIMITS.cols`. */
  allCols: boolean;
};

/** How numbers and ranges are written: the page's locale decides, so the caller passes it in. */
export type Fmt = { number: (n: number) => string; range?: (from: string, to: string) => string };

const plainFmt: Fmt = { number: String };

function rowLines(
  root: CrosstabData['search'],
  axis: AxisPlan,
  fmt: Fmt
): { lines: Line[]; buckets: Bucket[] } {
  let buckets = readBuckets(root, 'rows', axis.dim);
  if (axis.dim.kind === 'histogram') buckets = fill(buckets.sort(byKeyOrder), axis.interval ?? 1);
  else if (axis.dim.byKey) buckets = [...buckets].sort(byKeyOrder);
  return { buckets, lines: buckets.map((b) => lineOf(axis, b, b.count, fmt)) };
}

function lineOf(axis: AxisPlan, b: Bucket, count: number, fmt: Fmt): Line {
  const { dim } = axis;
  const label =
    dim.kind === 'histogram'
      ? binLabel(
          Number(b.key),
          axis.interval ?? 1,
          !!dim.integer,
          dim.plain ? String : fmt.number,
          fmt.range
        )
      : b.label;
  return { key: b.key, label, count };
}

/**
 * The answer as a table, a count for each pair. The columns come from the column's own facet under the
 * filter, not from the rows shown, so every page of rows has the same columns: all values when there
 * are at most `LIMITS.allCols`, else the biggest `LIMITS.cols`. A column a row lacks is zero, as every
 * row's facet is complete when this is used (`fitsOverall`).
 */
export function shapeTable(
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan,
  fmt: Fmt = plainFmt,
  valueData?: CrosstabData
): Table {
  const root = data?.search;
  const { buckets: rowBuckets, lines: rowLine } = rowLines(root, rows, fmt);
  const children = rowBuckets.map((b) => readBuckets(b.occurrences, 'cols', cols.dim));

  // Each column value's total under the filter, across all rows: what "% of column" divides by. The
  // sum over the rows shown would leave out the other rows, and count a record with several row values
  // more than once.
  const totalBuckets = readBuckets(root, 'colTotals', cols.dim);
  const totals = new Map(totalBuckets.map((b) => [keyOf(cols.dim, b.key), b.count]));
  const colTotalsKnown = totals.size > 0;

  // Without the column's own facet (it failed), fall back to the values the rows shown have, summed.
  const sums = new Map<string, { bucket: Bucket; sum: number }>();
  if (colTotalsKnown) {
    for (const bucket of totalBuckets)
      sums.set(keyOf(cols.dim, bucket.key), { bucket, sum: bucket.count });
  } else {
    for (const bucket of children.flat()) {
      const k = keyOf(cols.dim, bucket.key);
      const have = sums.get(k);
      if (have) have.sum += bucket.count;
      else sums.set(k, { bucket, sum: bucket.count });
    }
  }
  const values = columnCardinality(data) ?? sums.size;
  const allCols = values <= LIMITS.allCols;
  let colBuckets: Bucket[];
  if (cols.dim.kind === 'histogram') {
    colBuckets = fill([...sums.values()].map((s) => s.bucket).sort(byKeyOrder), cols.interval ?? 1);
  } else {
    colBuckets = [...sums.values()]
      .sort((a, b) => b.sum - a.sum || String(a.bucket.key).localeCompare(String(b.bucket.key)))
      .slice(0, allCols ? LIMITS.allCols : cols.dim.byKey ? LIMITS.ordered : LIMITS.cols)
      .map((s) => s.bucket);
    if (cols.dim.byKey) colBuckets.sort(byKeyOrder);
  }

  const index = new Map(colBuckets.map((b, j) => [keyOf(cols.dim, b.key), j]));
  const counts = rowBuckets.map((_, i) => {
    const line = colBuckets.map(() => 0);
    for (const b of children[i]) {
      const j = index.get(keyOf(cols.dim, b.key));
      if (j !== undefined) line[j] += b.count;
    }
    return line;
  });
  const total = Number(root?.documents?.total) || 0;
  const withValue = valueCounts(data, rows, cols, valueData, colTotalsKnown ? totalBuckets : null);
  const rowWithValue = rowBuckets.map((b, i) => withValue.row(b, children[i]));
  return {
    rows: rowLine,
    cols: colBuckets.map((b, j) =>
      lineOf(
        cols,
        b,
        (colTotalsKnown ? totals.get(keyOf(cols.dim, b.key)) : undefined) ??
          sumOf(counts.map((r) => r[j])),
        fmt
      )
    ),
    counts,
    noValue: rowLine.map((r, i) => Math.max(0, r.count - rowWithValue[i])),
    other: rowLine.map((_, i) =>
      cols.dim.multi ? null : Math.max(0, rowWithValue[i] - sumOf(counts[i]))
    ),
    showNoValue: withValue.anyWithout(
      total,
      rowLine.map((r, i) => r.count - rowWithValue[i])
    ),
    showOther: cols.dim.kind === 'terms' && !cols.dim.multi && values > colBuckets.length,
    total,
    rowsOther: Math.max(0, total - sumOf(rowLine.map((r) => r.count))),
    colTotalsKnown,
    allCols: cols.dim.kind === 'histogram' || allCols,
  };
}

/** How many values a paged terms row axis has under the filter, when the API said. */
export function rowCardinality(data: CrosstabData | undefined): number | null {
  return num(data?.search?.cardinality?.rows);
}

/** How many values a terms column has under the filter, when the API said. */
export function columnCardinality(data: CrosstabData | undefined): number | null {
  return num(data?.search?.cardinality?.cols);
}

/**
 * Whether "top overall" is exact. It picks the biggest columns from each row's own top values, so a
 * value outside a row's top would show as an empty cell although the row has records with it. That
 * can't happen when the column has at most `LIMITS.nested` values. Numeric columns are fetched whole.
 * Without a cardinality, every row's facet having come back short of the limit tells the same.
 */
export function fitsOverall(
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan
): boolean {
  if (cols.dim.kind !== 'terms') return true;
  const cardinality = columnCardinality(data);
  if (cardinality !== null) return cardinality <= LIMITS.nested;
  return !readBuckets(data?.search, 'rows', rows.dim).some(
    (b) => readBuckets(b.occurrences, 'cols', cols.dim).length >= LIMITS.nested
  );
}

export type RankedRow = Line & {
  items: Line[];
  /** Records with no value in the column field. */
  noValue: number;
  /** Records with a value outside the row's own top; null for a multi-valued column. */
  other: number | null;
};

export type Ranked = {
  rows: RankedRow[];
  width: number;
  total: number;
  rowsOther: number;
  showNoValue: boolean;
  showOther: boolean;
};

/** The answer as rows that each list their own biggest values of the column. */
export function shapeRanked(
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan,
  fmt: Fmt = plainFmt,
  valueData?: CrosstabData
): Ranked {
  const root = data?.search;
  const { buckets, lines } = rowLines(root, rows, fmt);
  const withValue = valueCounts(data, rows, cols, valueData, null);
  const out = lines.map((line, i): RankedRow => {
    const all = readBuckets(buckets[i].occurrences, 'cols', cols.dim);
    const children = [...all]
      .sort((a, b) => b.count - a.count || String(a.key).localeCompare(String(b.key)))
      .slice(0, LIMITS.rank);
    const items = children.map((c) => lineOf(cols, c, c.count, fmt));
    const has = withValue.row(buckets[i], all);
    return {
      ...line,
      items,
      noValue: Math.max(0, line.count - has),
      other: cols.dim.multi ? null : Math.max(0, has - sumOf(items.map((c) => c.count))),
    };
  });
  const total = Number(root?.documents?.total) || 0;
  return {
    rows: out,
    width: Math.max(0, ...out.map((r) => r.items.length)),
    total,
    rowsOther: Math.max(0, total - sumOf(lines.map((l) => l.count))),
    showNoValue: withValue.anyWithout(
      total,
      out.map((r) => r.noValue)
    ),
    showOther: !cols.dim.multi && (columnCardinality(data) ?? Infinity) > LIMITS.rank,
  };
}

// ---- other, and no value ------------------------------------------------------------------------

/**
 * What a row leaves out of its shown cells is split in two: records with no value in the column field
 * ("no value"), and records with a value that isn't a column ("other"). Both need the row's records
 * that have a column value. When the column has one value per record and every row's column facet is
 * complete, that is the sum of the row's column buckets, with no request. Otherwise (a multi-valued
 * column, or one with too many values for the facets to be complete) a small request counts them.
 */
export function needsValueCounts(
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan
): boolean {
  return !!cols.dim.multi || !fitsOverall(data, rows, cols);
}

/**
 * The query counting the records that have a value in the column field: per row shown (`$predicate`,
 * see `valueCountPredicate`), and in all rows (`$allPredicate`, see `valueTotalPredicate`), which
 * decides whether the no-value column is shown at all.
 */
export function buildValueCountQuery(rows: AxisPlan): string {
  const language = rows.dim.kind === 'terms' ? ', $language: String' : '';
  const checklist = rows.dim.checklist ? ', $checklistKey: ID' : '';
  return `query crosstabValues($q: String, $predicate: Predicate, $allPredicate: Predicate${language}${checklist}) {
  all: occurrenceSearch(q: $q, predicate: $allPredicate) {
    documents(size: 0) { total }
  }
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) { total }
    ${level(rows, 'rows', LIMITS.rows)}
  }
}`;
}

const hasValue = (cols: AxisPlan, checklistKey?: string) => ({
  type: 'isNotNull',
  key: cols.dim.id,
  ...(cols.dim.checklist ? { checklistKey } : {}),
});

/** The filter for the count in all rows: the table's, and records with a value in the column field. */
export function valueTotalPredicate(
  tablePredicate: unknown,
  cols: AxisPlan,
  checklistKey?: string
): unknown {
  return {
    type: 'and',
    predicates: [...(tablePredicate ? [tablePredicate] : []), hasValue(cols, checklistKey)],
  };
}

/**
 * Its filter: the table's, records with a value in the column field and, for terms rows, only the rows
 * shown, so the facet counts exactly those (a histogram's buckets come whole anyway).
 */
export function valueCountPredicate(
  tablePredicate: unknown,
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan,
  checklistKey?: string
): unknown {
  const extra: unknown[] = [hasValue(cols, checklistKey)];
  if (rows.dim.kind === 'terms') {
    const values = readBuckets(data?.search, 'rows', rows.dim).map((b) => b.key);
    extra.push({
      type: 'in',
      key: rows.dim.id,
      values,
      ...(rows.dim.checklist ? { checklistKey } : {}),
    });
  }
  return { type: 'and', predicates: [...(tablePredicate ? [tablePredicate] : []), ...extra] };
}

/** Records with a column value: per row, and whether any record under the filter has none. */
function valueCounts(
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan,
  valueData: CrosstabData | undefined,
  totalBuckets: Bucket[] | null
) {
  const counted = valueData?.search
    ? new Map(
        readBuckets(valueData.search, 'rows', rows.dim).map((b) => [
          keyOf(rows.dim, b.key),
          b.count,
        ])
      )
    : null;
  // All records under the filter with a column value: from the count, or the column's own facet when
  // it is complete and has one value per record.
  const withValueTotal = valueData?.all
    ? num(valueData.all.documents?.total)
    : totalBuckets && !cols.dim.multi && fitsOverall(data, rows, cols)
      ? sumOf(totalBuckets.map((b) => b.count))
      : null;
  return {
    row: (bucket: Bucket, children: Bucket[]) =>
      counted
        ? (counted.get(keyOf(rows.dim, bucket.key)) ?? 0)
        : sumOf(children.map((c) => c.count)),
    /** Without a total, fall back to the rows shown. */
    anyWithout: (total: number, rowsWithout: number[]) =>
      withValueTotal !== null ? total - withValueTotal > 0 : rowsWithout.some((n) => n > 0),
  };
}

// ---- clicks ------------------------------------------------------------------------------------

/**
 * The filter a line stands for, in the shape `handleRedirect` takes. A histogram bucket is a range. The
 * search URL's range is inclusive at both ends, so a bucket of whole numbers ends one short of the next
 * and other numbers end at the next bucket's start (a value exactly on the edge is in both).
 * Empty when the dimension has no filter on the search page.
 */
export function lineFilter(axis: AxisPlan, key: string | number): Record<string, unknown[]> {
  const { dim } = axis;
  if (dim.clickable === false) return {};
  if (dim.kind === 'terms') return { [dim.filter]: [key] };
  const from = Number(key);
  const interval = axis.interval ?? 1;
  const value = { gte: from, lte: tidy(from + interval - (dim.integer ? 1 : 0)) };
  return { [dim.filter]: [{ type: 'range', value }] };
}

/** Whether a click on this axis's lines can filter. */
export const canFilter = (axis: AxisPlan) => axis.dim.clickable !== false;

/**
 * The filter for a cell: both lines'. Two taxon ranks share the handle `taxonKey`, so the lower rank
 * (species in a family) is kept: it already implies the higher one.
 */
export function cellFilter(
  rows: AxisPlan,
  rowKey: string | number,
  cols: AxisPlan,
  colKey: string | number
): Record<string, unknown[]> {
  const [r, c] = [lineFilter(rows, rowKey), lineFilter(cols, colKey)];
  if (rows.dim.filter !== cols.dim.filter) return { ...r, ...c };
  return (rows.dim.rank ?? 0) >= (cols.dim.rank ?? 0) ? r : c;
}

// ---- colour ------------------------------------------------------------------------------------

/** What a cell is coloured by: its count, or its share of its row or of its column. */
export function measure(shade: Shade, count: number, rowTotal: number, colTotal: number): number {
  // A cell can exceed its row (the API's bucket search takes in vocabulary children), so shares stop at 1.
  if (shade === 'row') return rowTotal > 0 ? Math.min(1, count / rowTotal) : 0;
  if (shade === 'column') return colTotal > 0 ? Math.min(1, count / colTotal) : 0;
  return count;
}

export const MIN_INTENSITY = 0.12;

/**
 * Intensity 0..1 of a value among the table's own non-zero values, by rank, so that the gradient tells
 * cells apart whatever the spread (one huge cell must not turn the rest pale). Zero stays unshaded.
 */
export function makeIntensity(values: number[]): (v: number) => number {
  const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
  return (v) => {
    if (!(v > 0) || !sorted.length) return 0;
    if (sorted.length === 1) return 1;
    const below = sorted.filter((x) => x < v).length;
    const same = sorted.filter((x) => x === v).length;
    const rank = (below + (same - 1) / 2) / (sorted.length - 1);
    return tidy(MIN_INTENSITY + (1 - MIN_INTENSITY) * Math.min(1, rank));
  };
}
