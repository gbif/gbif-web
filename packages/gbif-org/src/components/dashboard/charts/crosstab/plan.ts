// Two-dimensional chart: what to ask the API for, how to read the answer, how to colour it. No React,
// so it can be tested on its own.
//
// The API has no cross-count, but every facet or histogram bucket carries `occurrences`, a search
// restricted to that bucket. So the table is one query: the row axis, and inside each row bucket the
// column axis. A numeric axis is a histogram, which needs an interval; that is planned from the
// field's minimum and maximum under the current filter (`buildStatsQuery`).
import type { Dimension } from './dimensions';

export const LIMITS = {
  /** Lines of a terms axis down the side; the rest are counted together. */
  rows: 12,
  /** Columns of a terms axis across the top. */
  cols: 8,
  /** Columns of a dimension with few, fixed values read in order (months): all of them. */
  ordered: 12,
  /** Values listed in each row of the "top per row" layout. */
  rank: 8,
  /** Histogram buckets: aim for `target`, never more than `max` (an interval is raised to keep to it). */
  bins: { target: 10, max: 24 },
  /**
   * Values asked for in each row's column facet. More than are shown, so that the columns that are
   * biggest overall can be picked from them.
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

/** About `bins.target` buckets between the smallest and largest value. */
export function autoInterval(stats: Stats | undefined, integer = false): number {
  const [min, max] = [num(stats?.min), num(stats?.max)];
  if (min === null || max === null || !(max > min)) return 1;
  const width = niceWidth((max - min) / LIMITS.bins.target);
  return integer ? Math.max(1, Math.ceil(width)) : width;
}

/**
 * The interval to use: the one asked for, raised if it would give more than `bins.max` buckets,
 * or the automatic one. `auto` is returned too, to show as the default.
 */
export function resolveInterval(
  stats: Stats | undefined,
  integer: boolean,
  requested?: number
): { interval: number; auto: number; raised: boolean } {
  const auto = autoInterval(stats, integer);
  if (!(Number(requested) > 0)) return { interval: auto, auto, raised: false };
  const [min, max] = [num(stats?.min), num(stats?.max)];
  const least = min !== null && max !== null ? (max - min) / LIMITS.bins.max : 0;
  let interval = Math.max(Number(requested), least);
  if (integer) interval = Math.max(1, Math.ceil(interval));
  interval = tidy(interval);
  return { interval, auto, raised: interval > Number(requested) };
}

/** A bucket as text: "2000–2009", "2000" for whole numbers in buckets of one, "10–20" otherwise. */
export function binLabel(
  key: number,
  interval: number,
  integer: boolean,
  format: (n: number) => string = String
): string {
  if (integer) {
    return interval === 1 ? format(key) : `${format(key)}–${format(tidy(key + interval - 1))}`;
  }
  return `${format(key)}–${format(tidy(key + interval))}`;
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
    const r = resolveInterval(t ?? s, !!dim.integer, ask);
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

export function coarseInterval(stats: Stats | undefined, integer: boolean): number | undefined {
  const [min, max] = [num(stats?.min), num(stats?.max)];
  if (min === null || max === null || !(max > min)) return undefined;
  const width = niceWidth((max - min) / COARSE_BINS);
  return integer ? Math.max(1, Math.ceil(width)) : width;
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
      dim.kind === 'histogram'
        ? coarseInterval(stats?.search?.stats?.[alias], !!dim.integer)
        : undefined;
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
  stats: Stats | undefined,
  integer: boolean
): Stats | undefined {
  const interval = coarseInterval(stats, integer);
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
function level(axis: AxisPlan, alias: string, size: number, inner?: string): string {
  const { dim } = axis;
  const occurrences = inner ? `occurrences { ${inner} }` : '';
  if (dim.kind === 'histogram') {
    return `histogram { ${alias}: ${dim.id}(interval: ${axis.interval ?? 1}) { buckets { key count ${occurrences} } } }`;
  }
  const checklist = dim.checklist ? ', checklistKey: $checklistKey' : '';
  return `facet { ${alias}: ${dim.id}(size: ${size}${checklist}) { key count label(language: $language) ${occurrences} } }`;
}

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
  return `query crosstab($q: String, $predicate: Predicate${language}${checklist}) {
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) { total }
    ${level(rows, 'rows', LIMITS.rows, level(cols, 'cols', colSize))}
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
export type CrosstabData = { search?: (Raw & { documents?: { total?: number } }) | null };

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
  /** Per row: records in none of the shown columns (other values, or no value). */
  rest: number[];
  /** All records matching the filter. */
  total: number;
  /** Records in rows that are not shown (other values, or no value). */
  rowsOther: number;
  /** A row's column facet was cut short, so a small cell may be missing. */
  approximate: boolean;
};

type Fmt = (n: number) => string;

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
      ? binLabel(Number(b.key), axis.interval ?? 1, !!dim.integer, dim.plain ? String : fmt)
      : b.label;
  return { key: b.key, label, count };
}

/** The answer as a table: the biggest columns overall, a count for each pair. */
export function shapeTable(
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan,
  fmt: Fmt = String
): Table {
  const root = data?.search;
  const { buckets: rowBuckets, lines: rowLine } = rowLines(root, rows, fmt);
  const children = rowBuckets.map((b) => readBuckets(b.occurrences, 'cols', cols.dim));

  // Columns: histograms in order, filled; terms the biggest by the sum over the rows shown.
  const sums = new Map<string, { bucket: Bucket; sum: number }>();
  for (const bucket of children.flat()) {
    const k = keyOf(cols.dim, bucket.key);
    const have = sums.get(k);
    if (have) have.sum += bucket.count;
    else sums.set(k, { bucket, sum: bucket.count });
  }
  let colBuckets: Bucket[];
  if (cols.dim.kind === 'histogram') {
    colBuckets = fill([...sums.values()].map((s) => s.bucket).sort(byKeyOrder), cols.interval ?? 1);
  } else {
    colBuckets = [...sums.values()]
      .sort((a, b) => b.sum - a.sum || String(a.bucket.key).localeCompare(String(b.bucket.key)))
      .slice(0, cols.dim.byKey ? LIMITS.ordered : LIMITS.cols)
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
  return {
    rows: rowLine,
    cols: colBuckets.map((b, j) => lineOf(cols, b, sumOf(counts.map((r) => r[j])), fmt)),
    counts,
    rest: rowLine.map((r, i) => Math.max(0, r.count - sumOf(counts[i]))),
    total,
    rowsOther: Math.max(0, total - sumOf(rowLine.map((r) => r.count))),
    approximate: cols.dim.kind === 'terms' && children.some((c) => c.length >= LIMITS.nested),
  };
}

export type RankedRow = Line & { items: Line[]; rest: number };

export type Ranked = { rows: RankedRow[]; width: number; total: number; rowsOther: number };

/** The answer as rows that each list their own biggest values of the column. */
export function shapeRanked(
  data: CrosstabData | undefined,
  rows: AxisPlan,
  cols: AxisPlan,
  fmt: Fmt = String
): Ranked {
  const root = data?.search;
  const { buckets, lines } = rowLines(root, rows, fmt);
  const out = lines.map((line, i): RankedRow => {
    const children = readBuckets(buckets[i].occurrences, 'cols', cols.dim)
      .sort((a, b) => b.count - a.count || String(a.key).localeCompare(String(b.key)))
      .slice(0, LIMITS.rank);
    const items = children.map((c) => lineOf(cols, c, c.count, fmt));
    return { ...line, items, rest: Math.max(0, line.count - sumOf(items.map((c) => c.count))) };
  });
  const total = Number(root?.documents?.total) || 0;
  return {
    rows: out,
    width: Math.max(0, ...out.map((r) => r.items.length)),
    total,
    rowsOther: Math.max(0, total - sumOf(lines.map((l) => l.count))),
  };
}

// ---- clicks ------------------------------------------------------------------------------------

/**
 * The filter a line stands for, in the shape `handleRedirect` takes. A histogram bucket is a range:
 * whole numbers end one short of the next bucket, other numbers end below it.
 */
export function lineFilter(axis: AxisPlan, key: string | number): Record<string, unknown[]> {
  const { dim } = axis;
  if (dim.kind === 'terms') return { [dim.filter]: [key] };
  const from = Number(key);
  const interval = axis.interval ?? 1;
  const value = dim.integer
    ? { gte: from, lte: tidy(from + interval - 1) }
    : { gte: from, lt: tidy(from + interval) };
  return { [dim.filter]: [{ type: 'range', value }] };
}

// ---- colour ------------------------------------------------------------------------------------

/** What a cell is coloured by: its count, or its share of its row or of its column. */
export function measure(shade: Shade, count: number, rowTotal: number, colTotal: number): number {
  if (shade === 'row') return rowTotal > 0 ? count / rowTotal : 0;
  if (shade === 'column') return colTotal > 0 ? count / colTotal : 0;
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
