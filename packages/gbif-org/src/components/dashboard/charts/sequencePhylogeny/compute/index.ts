import { alignSequences } from './kalign';
import { pDistanceMatrix, type DistanceResult } from './pDistance';
import { neighborJoining } from './neighborJoining';
import { dereplicateByThreshold, reduceMatrix } from './dereplicate';
import { collapseShortInternalBranches, toNewick, type CladeTree } from './clades';

export type SequenceTree = {
  newick: string;
  /** tree tips = representative ids. */
  taxa: string[];
  tree: CladeTree;
  /** repId -> member ids (sequences collapsed under the representative). */
  groups: Record<string, string[]>;
};

export type Alignment = {
  ids: string[];
  fullDist: DistanceResult;
  alignmentLength: number;
  /** id -> aligned (gapped, equal-length) sequence — the MSA the distances were read from. */
  aligned: Record<string, string>;
};

const singleTip = (id: string): CladeTree => ({
  name: null,
  length: 0,
  children: [{ name: id, length: 0, children: [] }],
});

/**
 * Expensive step (kalign MSA + full p-distance matrix), run once per sequence set. The matrix is
 * reused for every collapse-threshold, so changing the threshold never re-aligns.
 */
export async function computeAlignment(seqById: Record<string, string>): Promise<Alignment> {
  const ids = Object.keys(seqById);
  if (ids.length < 2) {
    const alignmentLength = ids.length === 1 ? seqById[ids[0]]?.length ?? 0 : 0;
    return {
      ids,
      fullDist: { taxa: ids, matrix: ids.map(() => [0]) },
      alignmentLength,
      aligned: { ...seqById },
    };
  }
  const aligned = await alignSequences(seqById);
  const alignmentLength = aligned[ids[0]]?.length ?? 0;
  return { ids, fullDist: pDistanceMatrix(aligned), alignmentLength, aligned };
}

/**
 * Cheap step: collapse sequences within `threshold` p-distance into representatives, then build the
 * NJ tree from the representatives. Safe to call synchronously on every threshold change.
 */
export function buildTreeFromDistance(
  fullDist: DistanceResult,
  threshold: number,
  pinnedIds?: Set<string>,
  /** Alignment column count, used to size the polytomy-collapse epsilon (~half a substitution). */
  alignmentLength?: number
): SequenceTree {
  const { reps, groups } = dereplicateByThreshold(fullDist, threshold, pinnedIds);
  if (reps.length === 0) {
    return { newick: '();', taxa: [], tree: { name: null, length: 0, children: [] }, groups: {} };
  }
  if (reps.length === 1) {
    return { newick: `(${reps[0]}:0);`, taxa: reps, tree: singleTip(reps[0]), groups };
  }
  const { tree } = neighborJoining(reduceMatrix(fullDist, reps));
  // Contract the near-zero internal branches NJ produces for unresolved (near-identical) sequences,
  // so a "staircase" becomes an honest fan. Epsilon ~= half a substitution over the alignment; with
  // an unknown length, fall back to contracting only exactly-zero/negative internal branches.
  const epsilon = alignmentLength && alignmentLength > 0 ? 0.5 / alignmentLength : 0;
  const collapsed = collapseShortInternalBranches(tree, epsilon);
  return { newick: toNewick(collapsed), taxa: reps, tree: collapsed, groups };
}

export { alignSequences } from './kalign';
export { pDistanceMatrix } from './pDistance';
export { neighborJoining } from './neighborJoining';
export { normalizeTree, collapseShortInternalBranches, toNewick } from './clades';
export { dereplicateByThreshold, reduceMatrix } from './dereplicate';
export { filterByCoverage, resolvedLength } from './coverage';
export type { DistanceResult } from './pDistance';
export type { CladeTree } from './clades';
