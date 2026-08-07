import { describe, expect, test } from 'vitest';
import { binomialKey, consensusForMembers } from './consensus';
import type { NameAgg } from '../useSequenceTreeData';

describe('binomialKey', () => {
  test('proper binomials normalise to "genus epithet"', () => {
    expect(binomialKey('Fusarium oxysporum')).toBe('fusarium oxysporum');
    expect(binomialKey('  Fusarium   oxysporum  ')).toBe('fusarium oxysporum');
    // authorship after the epithet is ignored
    expect(binomialKey('Fusarium oxysporum Schltdl.')).toBe('fusarium oxysporum');
  });

  test('genus-only / higher taxa are not binomials', () => {
    expect(binomialKey('Fusarium')).toBeNull();
    expect(binomialKey('Fungi')).toBeNull();
  });

  test('UNITE species hypotheses are not binomials', () => {
    expect(binomialKey('SH1151976.09FU')).toBeNull();
    expect(binomialKey('SH0999999.10FU')).toBeNull();
  });

  test('open nomenclature markers are not epithets', () => {
    expect(binomialKey('Fusarium sp.')).toBeNull();
    expect(binomialKey('Fusarium cf. oxysporum')).toBeNull();
    expect(binomialKey('Fusarium aff.')).toBeNull();
  });

  test('empty / null', () => {
    expect(binomialKey(null)).toBeNull();
    expect(binomialKey('')).toBeNull();
  });
});

// Helper: build a namesById where each id maps to one name (count 1 each unless given).
function agg(...names: Array<[string, string | null, number?]>): NameAgg {
  const list = names.map(([name, taxonKey, count = 1]) => ({ taxonKey, name, count }));
  return { names: list, distinct: list.length, sampled: list.reduce((s, n) => s + n.count, 0) };
}

describe('consensusForMembers ambiguity', () => {
  test('single binomial → not ambiguous', () => {
    const c = consensusForMembers(['a'], { a: agg(['Fusarium oxysporum', '1']) });
    expect(c.ambiguous).toBe(false);
    expect(c.primary).toBe('Fusarium oxysporum');
  });

  test('two conflicting binomials → ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['Fusarium oxysporum', '1', 3], ['Fusarium solani', '2', 1]),
    });
    expect(c.ambiguous).toBe(true);
  });

  test('different genera binomials → ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['Fusarium oxysporum', '1'], ['Aspergillus niger', '2']),
    });
    expect(c.ambiguous).toBe(true);
  });

  test('SH hypothesis + a binomial → not ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['SH1151976.09FU', '1', 5], ['Fusarium oxysporum', '2', 1]),
    });
    expect(c.ambiguous).toBe(false);
  });

  test('genus + species of that genus → not ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['Fusarium', '1'], ['Fusarium oxysporum', '2']),
    });
    expect(c.ambiguous).toBe(false);
  });

  test('two different genera (no epithets) → ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['Fusarium', '1'], ['Aspergillus', '2']),
    });
    expect(c.ambiguous).toBe(true);
  });

  test('genus + species of a different genus → ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['Fusarium', '1'], ['Aspergillus niger', '2']),
    });
    expect(c.ambiguous).toBe(true);
  });

  test('SH hypothesis + a single genus → not ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['SH1151976.09FU', '1'], ['Fusarium', '2']),
    });
    expect(c.ambiguous).toBe(false);
  });

  test('synonyms collapsing to the same binomial → not ambiguous', () => {
    const c = consensusForMembers(['a'], {
      a: agg(['Fusarium oxysporum', '1'], ['Fusarium oxysporum', '2']),
    });
    expect(c.ambiguous).toBe(false);
  });

  test('merges members before deciding', () => {
    const c = consensusForMembers(['a', 'b'], {
      a: agg(['Fusarium oxysporum', '1']),
      b: agg(['Fusarium solani', '2']),
    });
    expect(c.ambiguous).toBe(true);
    expect(c.distinct).toBe(2);
  });
});
