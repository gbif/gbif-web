import { describe, expect, test } from 'vitest';
import { getDimension } from './dimensions';
import {
  autoInterval,
  binLabel,
  buildCoarseQuery,
  cellFilter,
  coarseInterval,
  buildQuery,
  fitsOverall,
  buildStatsQuery,
  canFilter,
  canFilterCell,
  lineFilter,
  asShown,
  makeIntensity,
  measure,
  planAxes,
  resolveInterval,
  robustRange,
  shapeRanked,
  shapeTable,
  withWindows,
  type CoarseData,
  type CrosstabData,
} from './plan';

const basis = getDimension('basisOfRecord', 'basisOfRecord');
const year = getDimension('year', 'year');
const elevation = getDimension('elevation', 'elevation');
const family = getDimension('familyKey', 'familyKey');

describe('intervals', () => {
  test('automatic: round widths, about ten buckets', () => {
    expect(autoInterval({ min: 1900, max: 2024 })).toBe(20); // 124 / 10 -> 20
    expect(autoInterval({ min: 0, max: 5 })).toBe(1); // whole numbers never go below 1
    expect(autoInterval({ min: 0, max: 4500 })).toBe(500);
    expect(autoInterval({ min: -90, max: 90 })).toBe(20);
  });

  test('automatic: no spread or no values', () => {
    expect(autoInterval({ min: 7, max: 7 })).toBe(1);
    expect(autoInterval({ min: null, max: null })).toBe(1);
    expect(autoInterval(undefined)).toBe(1);
  });

  test('a requested interval is kept, unless it gives too many buckets', () => {
    expect(resolveInterval({ min: 1900, max: 2024 }, 5)).toEqual({
      interval: 6,
      auto: 20,
      raised: true,
    });
    expect(resolveInterval({ min: 1900, max: 2024 }, 10)).toEqual({
      interval: 10,
      auto: 20,
      raised: false,
    });
    expect(resolveInterval({ min: 0, max: 1000 }, 0)).toMatchObject({
      interval: 100,
      raised: false,
    });
    expect(resolveInterval({ min: 0, max: 1000 }, -3)).toMatchObject({ interval: 100 });
  });

  test('a whole-number interval stays whole', () => {
    // 2.5 would give 40 buckets; the least that keeps to 24 is 100 / 24, rounded up to a whole number
    expect(resolveInterval({ min: 0, max: 100 }, 2.5).interval).toBe(5);
    expect(resolveInterval({ min: 0, max: 20 }, 2.5).interval).toBe(3);
  });

  test('bucket labels', () => {
    expect(binLabel(2000, 10, true)).toBe('2000–2009');
    expect(binLabel(2000, 1, true)).toBe('2000');
    expect(binLabel(50, 25, false)).toBe('50–75');
    expect(binLabel(-60, 20, false)).toBe('-60–-40');
    // the caller's range formatter decides how the two ends are joined
    expect(binLabel(-60, 20, false, String, (a, b) => `${a} to ${b}`)).toBe('-60 to -40');
  });
});

describe('queries', () => {
  test('stats are asked for numeric axes only', () => {
    expect(buildStatsQuery(basis, basis)).toBeUndefined();
    const q = buildStatsQuery(basis, year) as string;
    expect(q).toContain('cols: year { min max }');
    expect(q).not.toContain('rows:');
  });

  test('terms rows with a histogram inside', () => {
    const q = buildQuery({ dim: basis }, { dim: year, interval: 10 });
    expect(q).toContain('rows: basisOfRecord(size: 12, from: $from)');
    expect(q).toContain('label(language: $language)');
    expect(q).toContain('histogram { cols: year(interval: 10) { buckets { key count');
    expect(q).not.toContain('checklistKey');
  });

  test('a variable is declared only where it is used (GraphQL rejects unused ones)', () => {
    const numeric = buildQuery({ dim: elevation, interval: 100 }, { dim: year, interval: 10 });
    expect(numeric).not.toContain('$language');
    expect(numeric).not.toContain('$checklistKey');
    expect(buildQuery({ dim: basis }, { dim: year, interval: 10 })).toContain('$language: String');
    expect(buildQuery({ dim: elevation, interval: 100 }, { dim: basis })).toContain(
      '$language: String'
    );
  });

  test('taxon axes take the checklist', () => {
    const q = buildQuery({ dim: family }, { dim: basis }, 8);
    expect(q).toContain('$checklistKey: ID');
    expect(q).toContain('familyKey(size: 12, from: $from, checklistKey: $checklistKey)');
    expect(q).toContain('basisOfRecord(size: 8)');
  });

  test('plan: intervals come from the stats', () => {
    const plan = planAxes(
      elevation,
      year,
      { search: { stats: { rows: { min: 0, max: 4500 }, cols: { min: 1900, max: 2024 } } } },
      {
        cols: 5,
      }
    );
    expect(plan.rows.interval).toBe(500);
    expect(plan.cols.interval).toBe(6); // 5 would give 25 buckets
    expect(plan.raised).toEqual({ rows: false, cols: true });
    expect(planAxes(basis, basis, undefined, {}).rows.interval).toBeUndefined();
  });
});

// Basis of record down, year buckets across.
const rows = { dim: basis };
const cols = { dim: year, interval: 10 };
const answer: CrosstabData = {
  search: {
    documents: { total: 1000 },
    facet: {
      rows: [
        {
          key: 'HUMAN_OBSERVATION',
          count: 600,
          label: 'Human observation',
          occurrences: {
            histogram: {
              cols: {
                buckets: [
                  { key: '1990', count: 100 },
                  { key: '2010', count: 400 },
                ],
              },
            },
          },
        },
        {
          key: 'PRESERVED_SPECIMEN',
          count: 300,
          label: 'Preserved specimen',
          occurrences: {
            histogram: { cols: { buckets: [{ key: '2000', count: 200 }] } },
          },
        },
      ],
    },
  },
};

describe('shapeTable', () => {
  const t = shapeTable(answer, rows, cols);

  test('histogram columns run from the lowest bucket to the highest, with the gaps filled', () => {
    expect(t.cols.map((c) => c.key)).toEqual([1990, 2000, 2010]);
    expect(t.cols.map((c) => c.label)).toEqual(['1990–1999', '2000–2009', '2010–2019']);
  });

  test('a count for each pair', () => {
    expect(t.rows.map((r) => r.label)).toEqual(['Human observation', 'Preserved specimen']);
    expect(t.counts).toEqual([
      [100, 0, 400],
      [0, 200, 0],
    ]);
  });

  test('column totals sum the rows shown; what a row leaves out has no value', () => {
    expect(t.cols.map((c) => c.count)).toEqual([100, 200, 400]);
    // histogram buckets come whole, so nothing is "other"
    expect(t.noValue).toEqual([100, 100]);
    expect(t.other).toEqual([0, 0]);
    expect(t.showOther).toBe(false);
  });

  test('records in rows that are not shown', () => {
    expect(t.total).toBe(1000);
    expect(t.rowsOther).toBe(100);
  });

  test('terms columns: the biggest overall, picked across rows', () => {
    const many = (n: number) =>
      Array.from({ length: n }, (_, i) => ({ key: `C${i}`, count: n - i, label: `Country ${i}` }));
    const data: CrosstabData = {
      search: {
        documents: { total: 100 },
        facet: {
          rows: [
            { key: 'A', count: 50, label: 'A', occurrences: { facet: { cols: many(13) } } },
            {
              key: 'B',
              count: 50,
              label: 'B',
              occurrences: { facet: { cols: many(13).reverse() } },
            },
          ],
        },
      },
    };
    const table = shapeTable(
      data,
      { dim: basis },
      { dim: getDimension('countryCode', 'countryCode') }
    );
    expect(table.cols).toHaveLength(8);
    // C0 and C12 are big in one row each (13 + 1), the middle ones are 6 or 7 + 6 or 7
    expect(table.cols[0].count).toBeGreaterThanOrEqual(table.cols[7].count);
    expect(table.counts[0]).toHaveLength(8);
  });

  test('column counts are the totals across all rows, and pick the columns', () => {
    const data: CrosstabData = {
      search: {
        documents: { total: 1000 },
        facet: {
          // B is small in the rows shown but biggest overall
          colTotals: [
            { key: 'B', count: 900 },
            { key: 'A', count: 50 },
          ],
          rows: [
            {
              key: 'R',
              count: 60,
              occurrences: {
                facet: {
                  cols: [
                    { key: 'A', count: 40 },
                    { key: 'B', count: 20 },
                  ],
                },
              },
            },
          ],
        },
      },
    };
    const t = shapeTable(data, { dim: basis }, { dim: getDimension('countryCode', 'countryCode') });
    expect(t.colTotalsKnown).toBe(true);
    expect(t.cols.map((c) => [c.key, c.count])).toEqual([
      ['B', 900],
      ['A', 50],
    ]);
    // so a cell's share of its column is of all records with that value
    expect(measure('column', t.counts[0][0], t.rows[0].count, t.cols[0].count)).toBeCloseTo(
      20 / 900
    );
  });

  test('the same field on both axes: only a cell of a value with itself filters', () => {
    const issue = { dim: getDimension('issue', 'issue') };
    expect(canFilterCell(issue, 'A', issue, 'A')).toBe(true);
    expect(canFilterCell(issue, 'A', issue, 'B')).toBe(false);
    expect(canFilterCell(issue, 'A', { dim: basis }, 'B')).toBe(true);
  });

  describe('top overall is only exact when the column has few enough values', () => {
    const country = { dim: getDimension('countryCode', 'countryCode') };
    const withCols = (n: number, cardinality?: number | null): CrosstabData => ({
      search: {
        documents: { total: n },
        cardinality: cardinality === undefined ? undefined : { cols: cardinality },
        facet: {
          rows: [
            {
              key: 'A',
              count: n,
              occurrences: {
                facet: {
                  cols: Array.from({ length: n }, (_, i) => ({
                    key: `C${i}`,
                    count: 1,
                    label: 'C',
                  })),
                },
              },
            },
          ],
        },
      },
    });

    test('by the cardinality, when the API gives it', () => {
      expect(fitsOverall(withCols(5, 40), { dim: basis }, country)).toBe(true);
      // a row may come back short while other rows have values it lacks
      expect(fitsOverall(withCols(5, 41), { dim: basis }, country)).toBe(false);
    });

    test('without a cardinality, by whether a row facet was cut at the limit', () => {
      expect(fitsOverall(withCols(39, null), { dim: basis }, country)).toBe(true);
      expect(fitsOverall(withCols(40), { dim: basis }, country)).toBe(false);
    });

    test('numeric columns are fetched whole', () => {
      expect(fitsOverall(withCols(5, 1000), { dim: basis }, { dim: year, interval: 10 })).toBe(
        true
      );
    });

    test('the query asks for the cardinality of terms axes, with the checklist for taxa', () => {
      expect(buildQuery({ dim: basis }, country)).toContain(
        'cardinality { rows: basisOfRecord cols: countryCode }'
      );
      expect(buildQuery({ dim: elevation, interval: 100 }, { dim: family })).toContain(
        'cardinality { cols: familyKey(checklistKey: $checklistKey) }'
      );
      expect(
        buildQuery({ dim: elevation, interval: 100 }, { dim: year, interval: 10 })
      ).not.toContain('cardinality');
    });
  });

  describe('columns come from the column facet, so every page of rows has the same', () => {
    const totalsOf = (n: number) =>
      Array.from({ length: n }, (_, i) => ({ key: `V${i}`, count: 1000 - i, label: `V${i}` }));
    const pageWith = (n: number, cardinality: number, rowCols: string[]): CrosstabData => ({
      search: {
        documents: { total: 100000 },
        cardinality: { cols: cardinality },
        facet: {
          colTotals: totalsOf(n),
          rows: [
            {
              key: 'R',
              count: 10,
              label: 'R',
              occurrences: {
                facet: { cols: rowCols.map((key) => ({ key, count: 5, label: key })) },
              },
            },
          ],
        },
      },
    });
    const country = { dim: getDimension('countryCode', 'countryCode') };

    test('up to twelve values: all of them, also those the rows shown lack', () => {
      const a = shapeTable(pageWith(12, 12, ['V0']), { dim: basis }, country);
      const b = shapeTable(pageWith(12, 12, ['V11', 'V3']), { dim: basis }, country);
      expect(a.cols.map((c) => c.key)).toEqual(totalsOf(12).map((v) => v.key));
      expect(b.cols.map((c) => c.key)).toEqual(a.cols.map((c) => c.key));
      expect(a.allCols).toBe(true);
      expect(a.counts[0].filter((n) => n > 0)).toEqual([5]);
    });

    test('more than twelve: the biggest eight by their total', () => {
      const t = shapeTable(pageWith(30, 30, ['V29']), { dim: basis }, country);
      expect(t.cols.map((c) => c.key)).toEqual(totalsOf(8).map((v) => v.key));
      expect(t.allCols).toBe(false);
      // V29 is not a column, so the row's 5 with it are other; the other 5 have no value
      expect(t.other).toEqual([5]);
      expect(t.noValue).toEqual([5]);
      expect(t.showOther).toBe(true);
      // over all rows: 100000 records, of which the 30 values hold 1000 + 999 + … + 971
      const withValue = Array.from({ length: 30 }, (_, i) => 1000 - i).reduce((a, b) => a + b, 0);
      const shownTotals = Array.from({ length: 8 }, (_, i) => 1000 - i).reduce((a, b) => a + b, 0);
      expect(t.noValueTotal).toBe(100000 - withValue);
      expect(t.otherTotal).toBe(withValue - shownTotals);
    });

    test('rows are paged when the facet takes from; histograms and occurrence status are not', () => {
      const status = getDimension('occurrenceStatus', 'occurrenceStatus');
      expect(buildQuery({ dim: basis }, country)).toContain('$from: Int');
      expect(buildQuery({ dim: status }, country)).not.toContain('$from');
      expect(buildQuery({ dim: status }, country)).toContain('occurrenceStatus(size: 12)');
      expect(buildQuery({ dim: elevation, interval: 100 }, country)).not.toContain('$from');
    });
  });

  test('months: all twelve are shown, not just the biggest eight', () => {
    const month = getDimension('month', 'month');
    const cols = Array.from({ length: 12 }, (_, i) => ({
      key: i + 1,
      count: i + 1,
      label: `M${i + 1}`,
    }));
    const data: CrosstabData = {
      search: {
        documents: { total: 78 },
        facet: { rows: [{ key: 'A', count: 78, occurrences: { facet: { cols } } }] },
      },
    };
    expect(shapeTable(data, { dim: basis }, { dim: month }).cols.map((c) => c.key)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  test('months are read in order, not by count', () => {
    const month = getDimension('month', 'month');
    const data: CrosstabData = {
      search: {
        documents: { total: 6 },
        facet: {
          rows: [
            {
              key: 'A',
              count: 6,
              occurrences: {
                facet: {
                  cols: [
                    { key: 12, count: 3, label: 'December' },
                    { key: 2, count: 2, label: 'February' },
                    { key: 1, count: 1, label: 'January' },
                  ],
                },
              },
            },
          ],
        },
      },
    };
    expect(shapeTable(data, { dim: basis }, { dim: month }).cols.map((c) => c.label)).toEqual([
      'January',
      'February',
      'December',
    ]);
  });

  test('an empty answer is an empty table', () => {
    const empty = shapeTable({ search: { documents: { total: 0 } } }, rows, cols);
    expect(empty).toMatchObject({ rows: [], cols: [], counts: [], total: 0 });
    expect(shapeTable(undefined, rows, cols).rows).toEqual([]);
  });
});

describe('shapeRanked', () => {
  test('each row lists its own biggest values', () => {
    const country = { dim: getDimension('countryCode', 'countryCode') };
    const data: CrosstabData = {
      search: {
        documents: { total: 100 },
        facet: {
          rows: [
            {
              key: 'A',
              count: 60,
              label: 'A',
              occurrences: {
                facet: {
                  cols: [
                    { key: 'DK', count: 20, label: 'Denmark' },
                    { key: 'SE', count: 30, label: 'Sweden' },
                  ],
                },
              },
            },
          ],
        },
      },
    };
    const ranked = shapeRanked(data, { dim: basis }, country);
    expect(ranked.rows[0].items.map((i) => i.label)).toEqual(['Sweden', 'Denmark']);
    expect(ranked.rows[0].noValue).toBe(10);
    expect(ranked.rows[0].other).toBe(0);
    expect(ranked.width).toBe(2);
    expect(ranked.rowsOther).toBe(40);

    // When the row's records with a value had to be counted, the count decides
    const counted: CrosstabData = {
      search: { documents: { total: 55 }, facet: { rows: [{ key: 'A', count: 55 }] } },
    };
    const withCount = shapeRanked(data, { dim: basis }, country, undefined, counted);
    expect(withCount.rows[0].noValue).toBe(5);
    expect(withCount.rows[0].other).toBe(5);
    expect(withCount.showNoValue).toBe(true);
  });

  test('a multi-valued column has no "other": a record can be in several cells', () => {
    const issue = { dim: getDimension('issue', 'issue') };
    const data: CrosstabData = {
      search: {
        documents: { total: 10 },
        facet: {
          rows: [
            {
              key: 'A',
              count: 10,
              occurrences: { facet: { cols: [{ key: 'X', count: 9, label: 'X' }] } },
            },
          ],
        },
      },
    };
    const counted: CrosstabData = {
      search: { documents: { total: 10 }, facet: { rows: [{ key: 'A', count: 10 }] } },
    };
    const t = shapeTable(data, { dim: basis }, issue, undefined, counted);
    expect(t.other).toEqual([null]);
    expect(t.showOther).toBe(false);
    expect(t.noValue).toEqual([0]);
    expect(t.showNoValue).toBe(false);
  });
});

describe('clicks', () => {
  test('a terms line sets its value', () => {
    expect(lineFilter({ dim: getDimension('countryCode', 'countryCode') }, 'DK')).toEqual({
      country: ['DK'],
    });
    expect(lineFilter({ dim: family }, 'LV7')).toEqual({ taxonKey: ['LV7'] });
  });

  test('a histogram bucket sets a range: whole numbers end one short of the next bucket, others at its start', () => {
    expect(lineFilter({ dim: year, interval: 10 }, 2000)).toEqual({
      year: [{ type: 'range', value: { gte: 2000, lte: 2009 } }],
    });
    expect(lineFilter({ dim: elevation, interval: 500 }, 500)).toEqual({
      elevation: [{ type: 'range', value: { gte: 500, lte: 1000 } }],
    });
  });
});

describe('colour', () => {
  test('measure: count, share of the row, share of the column', () => {
    expect(measure('count', 5, 20, 10)).toBe(5);
    expect(measure('row', 5, 20, 10)).toBe(0.25);
    expect(measure('column', 5, 20, 10)).toBe(0.5);
    expect(measure('row', 5, 0, 10)).toBe(0);
  });

  test('intensity follows rank, so one huge cell does not turn the rest pale', () => {
    const f = makeIntensity([1, 2, 3, 1_000_000]);
    expect(f(0)).toBe(0);
    expect(f(1)).toBeGreaterThan(0);
    expect(f(1_000_000)).toBe(1);
    expect(f(2)).toBeGreaterThan(f(1));
    expect(f(3)).toBeGreaterThan(f(2));
    expect(f(3)).toBeLessThan(1);
  });

  test('shares rank as shown, so cells that read alike shade alike', () => {
    expect(asShown('row', 0.996)).toBe(asShown('row', 1));
    expect(asShown('row', 0.001)).toBe(asShown('row', 0.0049));
    expect(asShown('row', 0)).toBe(0);
    expect(asShown('count', 1234)).toBe(1234);
    const f = makeIntensity([0.996, 1, 0.5].map((v) => asShown('row', v)));
    expect(f(asShown('row', 0.996))).toBe(f(asShown('row', 1)));
  });

  test('intensity: equal values shade alike, a lone value is full', () => {
    const f = makeIntensity([4, 4, 9]);
    expect(f(4)).toBe(f(4));
    expect(makeIntensity([7])(7)).toBe(1);
    expect(makeIntensity([])(3)).toBe(0);
  });
});

describe('outliers', () => {
  // Elevation: nearly everything between 0 and 1000 m, a few typos up to 99,000.
  const stats = { min: -100, max: 99000 };
  const coarse = (buckets: [number, number][]): CoarseData => ({
    search: { histogram: { rows: { buckets: buckets.map(([key, count]) => ({ key, count })) } } },
  });

  test('the coarse histogram is asked for numeric axes with a spread only', () => {
    const data = { search: { stats: { rows: stats, cols: { min: 5, max: 5 } } } };
    const q = buildCoarseQuery(elevation, elevation, data) as string;
    expect(q).toContain('rows: elevation(interval: 500)'); // 99,100 / 200 -> 500
    expect(q).not.toContain('cols:');
    expect(buildCoarseQuery(basis, basis, data)).toBeUndefined();
    expect(buildCoarseQuery(basis, year, undefined)).toBeUndefined();
  });

  test('a few outliers: the range holds the 1st to 99th percentile', () => {
    const range = robustRange(
      coarse([
        [0, 5000],
        [500, 4000],
        [1000, 990],
        [98500, 10],
      ]),
      'rows',
      stats
    );
    expect(range).toEqual({ min: 0, max: 1500 });
  });

  test('ordinary data is left whole', () => {
    // 0 to 1499 in buckets of 10, evenly filled
    const even = Array.from({ length: 150 }, (_, i): [number, number] => [i * 10, 20]);
    expect(robustRange(coarse(even), 'rows', { min: 0, max: 1499 })).toBeUndefined();
  });

  test('few records: nothing is trimmed', () => {
    expect(
      robustRange(
        coarse([
          [0, 2],
          [98500, 1],
        ]),
        'rows',
        stats
      )
    ).toBeUndefined();
  });

  test('no values: nothing to trim', () => {
    expect(robustRange(coarse([]), 'rows', stats)).toBeUndefined();
    expect(robustRange(undefined, 'rows', stats)).toBeUndefined();
  });

  test('the interval is planned for the range, and the window is whole buckets', () => {
    const plan = planAxes(
      elevation,
      basis,
      { search: { stats: { rows: stats } } },
      {},
      { rows: { min: 0, max: 1500 } }
    );
    expect(plan.rows.interval).toBe(200); // 1500 / 10 -> 200
    expect(plan.rows.window).toEqual({ from: 0, to: 1600 });
    expect(plan.cols.window).toBeUndefined();
    // not trimmed: no window
    expect(
      planAxes(elevation, basis, { search: { stats: { rows: stats } } }, {}).rows.window
    ).toBeUndefined();
  });

  test('windows are ANDed with the filter', () => {
    const axis = { dim: elevation, interval: 200, window: { from: 0, to: 1600 } };
    const filter = { type: 'equals', key: 'country', value: 'DK' };
    expect(withWindows(filter, [axis, { dim: basis }])).toEqual({
      type: 'and',
      predicates: [
        filter,
        { type: 'greaterThanOrEquals', key: 'elevation', value: 0 },
        { type: 'lessThan', key: 'elevation', value: 1600 },
      ],
    });
    expect(withWindows(undefined, [axis])).toMatchObject({ type: 'and' });
    expect(withWindows(filter, [{ dim: basis }])).toBe(filter);
  });
});

describe('review findings', () => {
  test('bucket sizes are always whole numbers: a fractional bucket key is an API error', () => {
    // narrow ranges used to give 0.5 or 2.5 for latitude, elevation and depth
    expect(autoInterval({ min: 54, max: 58 })).toBe(1);
    expect(autoInterval({ min: 0, max: 22 })).toBe(3); // 2.5 -> 3
    expect(coarseInterval({ min: 0, max: 30 })).toBe(1);
    expect(resolveInterval({ min: -422, max: 13287 }, 1e-9)).toMatchObject({
      interval: 572,
      raised: true,
    });
    expect(resolveInterval({ min: 0, max: 100 }, 2.5).interval).toBe(5);
    for (const max of [3, 17, 22, 99, 180, 10001]) {
      expect(Number.isInteger(autoInterval({ min: 0, max }))).toBe(true);
    }
  });

  test('two taxon ranks: the lower rank is kept, whichever axis it is on', () => {
    const [kingdom, familyDim] = [getDimension('kingdomKey', ''), getDimension('familyKey', '')];
    // a cell of Anatidae (family) x Animalia (kingdom) is Anatidae, not all of Animalia
    expect(cellFilter({ dim: familyDim }, 'F1', { dim: kingdom }, 'K1')).toEqual({
      taxonKey: ['F1'],
    });
    expect(cellFilter({ dim: kingdom }, 'K1', { dim: familyDim }, 'F1')).toEqual({
      taxonKey: ['F1'],
    });
  });

  test('a cell of two different handles sets both', () => {
    expect(
      cellFilter({ dim: basis }, 'HUMAN_OBSERVATION', { dim: year, interval: 10 }, 2000)
    ).toEqual({
      basisOfRecord: ['HUMAN_OBSERVATION'],
      year: [{ type: 'range', value: { gte: 2000, lte: 2009 } }],
    });
  });

  test('the publishing country click uses the search page filter handle', () => {
    expect(lineFilter({ dim: getDimension('publishingCountry', '') }, 'DK')).toEqual({
      publishingCountry: ['DK'],
    });
  });

  test('latitude and longitude have no filter on the search page: nothing to click', () => {
    const latitude = { dim: getDimension('decimalLatitude', ''), interval: 10 };
    expect(canFilter(latitude)).toBe(false);
    expect(lineFilter(latitude, 10)).toEqual({});
    expect(canFilter({ dim: basis })).toBe(true);
  });

  test('a bucket of other numbers filters on the inclusive range the search URL can express', () => {
    expect(lineFilter({ dim: elevation, interval: 100 }, 0)).toEqual({
      elevation: [{ type: 'range', value: { gte: 0, lte: 100 } }],
    });
  });

  test('a share never passes 100%: the API can count a cell above its row', () => {
    expect(measure('row', 35297, 32783, 1)).toBe(1);
    expect(measure('column', 5, 100, 4)).toBe(1);
  });
});
