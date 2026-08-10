import { alignSequences } from './kalign';
import { pDistanceMatrix, type DistanceResult } from './pDistance';
import { neighborJoining } from './neighborJoining';
import { dereplicateByThreshold, reduceMatrix } from './dereplicate';
import type { CladeTree } from './clades';

export type SequenceTree = {
  newick: string;
  /** tree tips = representative ids. */
  taxa: string[];
  tree: CladeTree;
  /** repId -> member ids (sequences collapsed under the representative). */
  groups: Record<string, string[]>;
};

export type Alignment = { ids: string[]; fullDist: DistanceResult };

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
  if (ids.length < 2) return { ids, fullDist: { taxa: ids, matrix: ids.map(() => [0]) } };
  const aligned = await alignSequences(seqById);
  return { ids, fullDist: pDistanceMatrix(aligned) };
}

/**
 * Cheap step: collapse sequences within `threshold` p-distance into representatives, then build the
 * NJ tree from the representatives. Safe to call synchronously on every threshold change.
 */
export function buildTreeFromDistance(
  fullDist: DistanceResult,
  threshold: number,
  pinnedIds?: Set<string>
): SequenceTree {
  const { reps, groups } = dereplicateByThreshold(fullDist, threshold, pinnedIds);
  if (reps.length === 0) {
    return { newick: '();', taxa: [], tree: { name: null, length: 0, children: [] }, groups: {} };
  }
  if (reps.length === 1) {
    return { newick: `(${reps[0]}:0);`, taxa: reps, tree: singleTip(reps[0]), groups };
  }
  const { newick, tree } = neighborJoining(reduceMatrix(fullDist, reps));
  return { newick, taxa: reps, tree, groups };
}

export { alignSequences } from './kalign';
export { pDistanceMatrix } from './pDistance';
export { neighborJoining } from './neighborJoining';
export { normalizeTree } from './clades';
export { dereplicateByThreshold, reduceMatrix } from './dereplicate';
export { filterByCoverage, resolvedLength } from './coverage';
export type { DistanceResult } from './pDistance';
export type { CladeTree } from './clades';
