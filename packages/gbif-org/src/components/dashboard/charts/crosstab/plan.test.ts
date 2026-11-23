import { describe, expect, test } from 'vitest';
import { getDimension } from './dimensions';
import {
  autoInterval,
  binLabel,
  buildCoarseQuery,
  buildQuery,
  buildStatsQuery,
  lineFilter,
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
    expect(autoInterval({ min: 1900, max: 2024 }, true)).toBe(20); // 124 / 10 -> 20
    expect(autoInterval({ min: 0, max: 5 }, true)).toBe(1); // whole numbers never go below 1
    expect(autoInterval({ min: 0, max: 4500 })).toBe(500);
    expect(autoInterval({ min: -90, max: 90 })).toBe(20);
  });

  test('automatic: no spread or no values', () => {
    expect(autoInterval({ min: 7, max: 7 })).toBe(1);
    expect(autoInterval({ min: null, max: null })).toBe(1);
    expect(autoInterval(undefined)).toBe(1);
  });

  test('a requested interval is kept, unless it gives too many buckets', () => {
    expect(resolveInterval({ min: 1900, max: 2024 }, true, 5)).toEqual({
      interval: 6,
      auto: 20,
      raised: true,
    });
    expect(resolveInterval({ min: 1900, max: 2024 }, true, 10)).toEqual({
      interval: 10,
      auto: 20,
      raised: false,
    });
    expect(resolveInterval({ min: 0, max: 1000 }, false, 0)).toMatchObject({
      interval: 100,
      raised: false,
    });
    expect(resolveInterval({ min: 0, max: 1000 }, false, -3)).toMatchObject({ interval: 100 });
  });

  test('a whole-number interval stays whole', () => {
    // 2.5 would give 40 buckets; the least that keeps to 24 is 100 / 24, rounded up to a whole number
    expect(resolveInterval({ min: 0, max: 100 }, true, 2.5).interval).toBe(5);
    expect(resolveInterval({ min: 0, max: 20 }, true, 2.5).interval).toBe(3);
  });

  test('bucket labels', () => {
    expect(binLabel(2000, 10, true)).toBe('2000–2009');
    expect(binLabel(2000, 1, true)).toBe('2000');
    expect(binLabel(0.5, 0.25, false)).toBe('0.5–0.75');
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
    expect(q).toContain('rows: basisOfRecord(size: 12)');
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
    expect(q).toContain('familyKey(size: 12, checklistKey: $checklistKey)');
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

  test('column totals sum the rows shown; what a row leaves out is its rest', () => {
    expect(t.cols.map((c) => c.count)).toEqual([100, 200, 400]);
    expect(t.rest).toEqual([100, 100]);
  });

  test('records in rows that are not shown', () => {
    expect(t.total).toBe(1000);
    expect(t.rowsOther).toBe(100);
    expect(t.approximate).toBe(false);
  });

  test('terms columns: the biggest overall, picked across rows', () => {
    const many = (n: number) =>
      Array.from({ length: n }, (_, i) => ({ key: `C${i}`, count: n - i, label: `Country ${i}` }));
    const data: CrosstabData = {
      search: {
        documents: { total: 100 },
        facet: {
          rows: [
            { key: 'A', count: 50, label: 'A', occurrences: { facet: { cols: many(12) } } },
            {
              key: 'B',
              count: 50,
              label: 'B',
              occurrences: { facet: { cols: many(12).reverse() } },
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
    // C0 and C11 are big in one row each (12 + 1), the middle ones are 6 or 7 + 6 or 7
    expect(table.cols[0].count).toBeGreaterThanOrEqual(table.cols[7].count);
    expect(table.counts[0]).toHaveLength(8);
  });

  test('a facet cut at the limit is flagged as approximate', () => {
    const cut = Array.from({ length: 40 }, (_, i) => ({ key: `C${i}`, count: 1, label: `C${i}` }));
    const data: CrosstabData = {
      search: {
        documents: { total: 40 },
        facet: { rows: [{ key: 'A', count: 40, occurrences: { facet: { cols: cut } } }] },
      },
    };
    expect(
      shapeTable(data, { dim: basis }, { dim: getDimension('countryCode', 'countryCode') })
        .approximate
    ).toBe(true);
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
    expect(ranked.rows[0].rest).toBe(10);
    expect(ranked.width).toBe(2);
    expect(ranked.rowsOther).toBe(40);
  });
});

describe('clicks', () => {
  test('a terms line sets its value', () => {
    expect(lineFilter({ dim: getDimension('countryCode', 'countryCode') }, 'DK')).toEqual({
      country: ['DK'],
    });
    expect(lineFilter({ dim: family }, 'LV7')).toEqual({ taxonKey: ['LV7'] });
  });

  test('a histogram bucket sets a range: whole numbers end one short of the next bucket', () => {
    expect(lineFilter({ dim: year, interval: 10 }, 2000)).toEqual({
      year: [{ type: 'range', value: { gte: 2000, lte: 2009 } }],
    });
    expect(lineFilter({ dim: elevation, interval: 500 }, 500)).toEqual({
      elevation: [{ type: 'range', value: { gte: 500, lt: 1000 } }],
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
      stats,
      false
    );
    expect(range).toEqual({ min: 0, max: 1500 });
  });

  test('ordinary data is left whole', () => {
    // 0 to 1499 in buckets of 10, evenly filled
    const even = Array.from({ length: 150 }, (_, i): [number, number] => [i * 10, 20]);
    expect(robustRange(coarse(even), 'rows', { min: 0, max: 1499 }, false)).toBeUndefined();
  });

  test('few records: nothing is trimmed', () => {
    expect(
      robustRange(
        coarse([
          [0, 2],
          [98500, 1],
        ]),
        'rows',
        stats,
        false
      )
    ).toBeUndefined();
  });

  test('no values: nothing to trim', () => {
    expect(robustRange(coarse([]), 'rows', stats, false)).toBeUndefined();
    expect(robustRange(undefined, 'rows', stats, false)).toBeUndefined();
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
