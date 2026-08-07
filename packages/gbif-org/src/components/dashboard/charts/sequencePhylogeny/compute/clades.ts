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
