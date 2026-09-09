import { describe, expect, test } from 'vitest';
import { collapseShortInternalBranches, toNewick, type CladeTree } from './clades';

const leaf = (name: string, length: number): CladeTree => ({ name, length, children: [] });
const node = (length: number, children: CladeTree[]): CladeTree => ({ name: null, length, children });

// Names of the immediate children, using a bracketed leaf-set for internal children.
const childShape = (t: CladeTree) =>
  t.children.map((c) => (c.children.length === 0 ? c.name : `[${c.children.map((x) => x.name)}]`));

describe('collapseShortInternalBranches', () => {
  const L = 658;
  const eps = 0.5 / L; // ~half a substitution over the alignment

  test('contracts a staircase of near-zero internal branches into a flat fan', () => {
    // (((A,B):~0,C):~0,D):0 — an unresolved rake NJ emits as a ladder.
    const staircase = node(0, [
      node(1e-9, [node(1e-9, [leaf('A', 0.001), leaf('B', 0.001)]), leaf('C', 0.001)]),
      leaf('D', 0.001),
    ]);
    const fan = collapseShortInternalBranches(staircase, eps);
    expect(childShape(fan)).toEqual(['A', 'B', 'C', 'D']);
  });

  test('preserves an internal branch of at least one substitution', () => {
    const withClade = node(0, [
      node(1 / L, [leaf('A', 0.001), leaf('B', 0.001)]), // one substitution — real subclade
      leaf('C', 0.001),
      leaf('D', 0.001),
    ]);
    const kept = collapseShortInternalBranches(withClade, eps);
    expect(childShape(kept)).toEqual(['[A,B]', 'C', 'D']);
  });

  test('contracts negative internal branches (NJ artifacts) and never removes tips', () => {
    const tree = node(0, [node(-0.002, [leaf('A', 0.001), leaf('B', 0.001)]), leaf('C', 0.001)]);
    const collapsed = collapseShortInternalBranches(tree, eps);
    expect(childShape(collapsed)).toEqual(['A', 'B', 'C']);
  });

  test('epsilon = 0 contracts only exactly-zero/negative branches, keeping tiny positive ones', () => {
    const tree = node(0, [node(1e-9, [leaf('A', 0)]), node(0, [leaf('B', 0)])]);
    const collapsed = collapseShortInternalBranches(tree, 0);
    // The 1e-9 branch survives (single-child internal kept), the exact-zero one is contracted.
    expect(childShape(collapsed)).toEqual(['[A]', 'B']);
  });
});

describe('toNewick', () => {
  test('round-trips a simple tree with fixed-decimal branch lengths and no root length', () => {
    const tree = node(0, [leaf('A', 0.01), node(0.02, [leaf('B', 0.03), leaf('C', 0.04)])]);
    expect(toNewick(tree)).toBe('(A:0.01000000,(B:0.03000000,C:0.04000000):0.02000000);');
  });

  test('never emits exponential notation for tiny lengths', () => {
    expect(toNewick(node(0, [leaf('A', 1e-9), leaf('B', 0.001)]))).not.toMatch(/e/i);
  });
});
