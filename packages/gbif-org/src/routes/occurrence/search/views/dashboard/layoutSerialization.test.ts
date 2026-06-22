import { Base64 } from 'js-base64';
import { describe, expect, test } from 'vitest';
import { Layout, parseLayout, serializeLayout } from './layoutSerialization';

describe('dashboard layout serialization', () => {
  test('serializes a simple single-chart layout to its type name', () => {
    expect(serializeLayout([[{ t: 'taxa', p: {} }]])).toBe('taxa');
  });

  test('serializes params readably with abbreviated view key', () => {
    expect(serializeLayout([[{ t: 'taxa', p: { view: 'MAP', rank: 'GENUS' } }]])).toBe(
      'taxa.rank-GENUS.v-MAP'
    );
  });

  test('serializes columns, charts, params and height', () => {
    const layout: Layout = [
      [
        { t: 'taxa', p: { rank: 'GENUS', view: 'MAP' } },
        { t: 'basisOfRecord', p: { view: 'PIE' } },
      ],
      [{ t: 'year', p: {} }, { t: 'country', p: {} }],
      [{ t: 'map', p: { h: 600 } }],
    ];
    expect(serializeLayout(layout)).toBe(
      'taxa.rank-GENUS.v-MAP_basisOfRecord.v-PIE*year_country*map.h-600'
    );
  });

  test('param order is deterministic regardless of insertion order', () => {
    const a = serializeLayout([[{ t: 'taxa', p: { view: 'MAP', rank: 'GENUS' } }]]);
    const b = serializeLayout([[{ t: 'taxa', p: { rank: 'GENUS', view: 'MAP' } }]]);
    expect(a).toBe(b);
  });

  test('empty layout serializes to undefined (clears the param)', () => {
    expect(serializeLayout([[]])).toBeUndefined();
    expect(serializeLayout([])).toBeUndefined();
    expect(serializeLayout(undefined)).toBeUndefined();
  });

  test('round-trips a rich layout (ignoring generated ids)', () => {
    const layout: Layout = [
      [
        { t: 'taxa', p: { rank: 'GENUS', view: 'MAP' } },
        { t: 'basisOfRecord', p: { view: 'PIE' } },
      ],
      [{ t: 'map', p: { h: 600 } }],
    ];
    const parsed = parseLayout(serializeLayout(layout)!);
    const stripIds = (l: Layout) => l.map((col) => col.map(({ t, p }) => ({ t, p })));
    expect(stripIds(parsed!)).toEqual(stripIds(layout));
  });

  test('restores numeric and boolean param types', () => {
    const parsed = parseLayout('map.h-600');
    expect(parsed![0][0].p).toEqual({ h: 600 });
    const parsedBool = parseLayout('x.flag-true.n-0');
    expect(parsedBool![0][0].p).toEqual({ flag: true, n: 0 });
  });

  test('escapes separator characters inside values', () => {
    const layout: Layout = [[{ t: 'x', p: { a: 'MATERIAL_SAMPLE', b: '2000-2020', c: 1.5 } }]];
    const serialized = serializeLayout(layout)!;
    // none of the raw separators leak from the value
    expect(serialized).not.toContain('_SAMPLE');
    expect(serialized).not.toContain('2000-2020');
    const parsed = parseLayout(serialized);
    expect(parsed![0][0].p).toEqual({ a: 'MATERIAL_SAMPLE', b: '2000-2020', c: 1.5 });
  });

  test('produces stable ids for the same string (no render churn)', () => {
    const str = 'taxa.rank-GENUS_country*map.h-600';
    expect(JSON.stringify(parseLayout(str))).toBe(JSON.stringify(parseLayout(str)));
  });

  test('preserves empty columns', () => {
    const parsed = parseLayout('taxa**year');
    expect(parsed!.map((c) => c.map((i) => i.t))).toEqual([['taxa'], [], ['year']]);
  });

  test('serialized form ignores id/translation/r so share matches local storage', () => {
    // localStorage holds the structured form with extra fields...
    const stored: Layout = [
      [{ id: 'abcde', r: true, translation: 'dashboard.taxa', t: 'taxa', p: { rank: 'GENUS' } }],
    ];
    // ...the URL round-trips through the compact form (positional ids, no extras)
    const fromUrl = parseLayout(serializeLayout(stored)!);
    // The "is the shared layout different?" check compares the canonical strings,
    // which must be equal for an identical dashboard.
    expect(serializeLayout(fromUrl)).toBe(serializeLayout(stored));
  });

  test('reads legacy base64-JSON links', () => {
    const legacy = Base64.encode(
      JSON.stringify([[{ id: 'g3dmk', p: {}, translation: 'dashboard.taxa', t: 'taxa' }]])
    );
    const parsed = parseLayout(legacy);
    expect(parsed![0][0].t).toBe('taxa');
    // and re-serializing a legacy layout yields the new compact form
    expect(serializeLayout(parsed)).toBe('taxa');
  });

  test('skips malformed param tokens without dropping the chart', () => {
    const parsed = parseLayout('taxa.broken.rank-GENUS');
    expect(parsed![0][0].t).toBe('taxa');
    expect(parsed![0][0].p).toEqual({ rank: 'GENUS' });
  });
});
