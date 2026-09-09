import { describe, expect, test } from 'vitest';
import { filterByCoverage, resolvedLength } from './coverage';

describe('resolvedLength', () => {
  test('counts only resolved bases (A/C/G/T/U)', () => {
    expect(resolvedLength('ACGT')).toBe(4);
    expect(resolvedLength('acgtu')).toBe(5); // case-insensitive
    expect(resolvedLength('ACGT-N-NNRY')).toBe(4); // gaps, N and ambiguity codes ignored
    expect(resolvedLength('')).toBe(0);
  });
});

describe('filterByCoverage', () => {
  const seq = (n: number) => 'A'.repeat(n);

  test('hides sequences below the fraction of the median length', () => {
    // lengths 600, 600, 600, 188 -> median 600, min = 0.6*600 = 360; the 188 is dropped.
    const { kept, hiddenIds, median, minLength } = filterByCoverage(
      { a: seq(600), b: seq(600), c: seq(600), short: seq(188) },
      0.6
    );
    expect(median).toBe(600);
    expect(minLength).toBe(360);
    expect(hiddenIds).toEqual(['short']);
    expect(Object.keys(kept).sort()).toEqual(['a', 'b', 'c']);
  });

  test('keeps everything when all are similar length', () => {
    const { hiddenIds } = filterByCoverage({ a: seq(500), b: seq(520), c: seq(480) }, 0.6);
    expect(hiddenIds).toEqual([]);
  });

  test('median-relative: a set of short sequences is not wiped out', () => {
    const { hiddenIds } = filterByCoverage({ a: seq(180), b: seq(200), c: seq(190) }, 0.6);
    expect(hiddenIds).toEqual([]);
  });

  test('empty input', () => {
    expect(filterByCoverage({}, 0.6)).toEqual({ kept: {}, hiddenIds: [], median: 0, minLength: 0 });
  });
});
