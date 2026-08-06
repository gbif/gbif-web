import { RapidNeighborJoining } from 'neighbor-joining';
import type { DistanceResult } from './pDistance';
import { normalizeTree, type CladeTree } from './clades';

export type NjResult = { newick: string; tree: CladeTree };

const leaf = (name: string, length: number): CladeTree => ({ name, length, children: [] });

/**
 * Build a Newick tree AND a structured tree object (tips = nucleotideSequenceIDs) from a
 * p-distance matrix via neighbor-joining. Neighbor-joining needs >= 3 taxa; smaller inputs are
 * handled directly. The matrix is cloned because RapidNeighborJoining mutates its working matrix.
 */
export function neighborJoining({ taxa, matrix }: DistanceResult): NjResult {
  if (taxa.length === 0) {
    return { newick: '();', tree: { name: null, length: 0, children: [] } };
  }
  if (taxa.length === 1) {
    return { newick: `(${taxa[0]}:0);`, tree: { name: null, length: 0, children: [leaf(taxa[0], 0)] } };
  }
  if (taxa.length === 2) {
    const half = (matrix[0]?.[1] ?? 0) / 2;
    return {
      newick: `(${taxa[0]}:${half},${taxa[1]}:${half});`,
      tree: { name: null, length: 0, children: [leaf(taxa[0], half), leaf(taxa[1], half)] },
    };
  }

  const clone = matrix.map((row) => row.slice());
  const nj = new RapidNeighborJoining(
    clone,
    taxa.map((name) => ({ name }))
  );
  nj.run();
  return { newick: nj.getAsNewick(), tree: normalizeTree(nj.getAsObject()) };
}
