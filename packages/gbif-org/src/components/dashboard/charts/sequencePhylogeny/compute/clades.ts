// Structured tree type for the sequence phylogeny, plus a normaliser from neighbor-joining's
// getAsObject() output. (Automatic clade detection/colouring was removed in favour of manual
// grouping — the user paints clades by clicking internal nodes; see SequencePhylogeny.)

export type CladeTree = { name: string | null; length: number; children: CladeTree[] };

// neighbor-joining's getAsObject() node -> CladeTree.
export function normalizeTree(node: any): CladeTree {
  return {
    name: node?.taxon?.name ?? null,
    length: typeof node?.length === 'number' ? node.length : 0,
    children: (node?.children ?? []).map(normalizeTree),
  };
}

/**
 * Contract negligible **internal** branches into polytomies (multifurcations). Neighbor-joining
 * always emits a fully bifurcating tree, so a set of near-identical sequences (an unresolved rake)
 * comes out as a "staircase" of ~zero-length internal branches whose ordering is arbitrary. Any
 * internal edge with `length <= epsilon` is removed by splicing its children up into its parent,
 * turning that staircase into an honest fan. Tips (leaves) are never removed. A principled epsilon
 * is just under one substitution over the alignment (~0.5 / alignmentLength); with `epsilon = 0`
 * only exactly-zero (and negative) internal branches are contracted.
 */
export function collapseShortInternalBranches(tree: CladeTree, epsilon: number): CladeTree {
  const children: CladeTree[] = [];
  for (const child of tree.children) {
    const c = collapseShortInternalBranches(child, epsilon);
    if (c.children.length > 0 && c.length <= epsilon) {
      // Internal node on a negligible branch: promote its children (polytomy). Their own branch
      // lengths are unchanged — contracting a ~zero edge doesn't move the grandchildren.
      children.push(...c.children);
    } else {
      children.push(c);
    }
  }
  return { ...tree, children };
}

// Serialise a CladeTree back to Newick. Branch lengths use fixed decimals (never exponential
// notation) so downstream Newick parsing/regex handling stays robust; the root's own length is
// omitted. Tip names are emitted verbatim (nucleotideSequenceIDs, already Newick-safe).
export function toNewick(tree: CladeTree): string {
  const len = (x: number) => (Number.isFinite(x) ? x : 0).toFixed(8);
  const fmt = (n: CladeTree): string => {
    const label = n.name ?? '';
    if (n.children.length === 0) return `${label}:${len(n.length)}`;
    return `(${n.children.map(fmt).join(',')})${label}:${len(n.length)}`;
  };
  const rootLabel = tree.name ?? '';
  if (tree.children.length === 0) return `${rootLabel};`;
  return `(${tree.children.map(fmt).join(',')})${rootLabel};`;
}
