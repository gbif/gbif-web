import type { DistanceResult } from './pDistance';

export type Dereplicated = {
  /** Representative ids (one per identical-sequence group), in input order. */
  reps: string[];
  /** repId -> all member ids (including the representative). */
  groups: Record<string, string[]>;
};

/**
 * Collapse sequences into groups where every member is within `threshold` p-distance of every other
 * member (agglomerative **complete-linkage** clustering). `threshold` of 0 collapses only identical
 * sequences; a small positive value (e.g. 0.005 = within 0.5%) also collapses tight groups of
 * near-identical variants. Complete-linkage (unlike single-linkage) does not chain, so a gradient of
 * sequences is not swept into one giant group. The lowest-input-index member of each group is its
 * representative.
 */
export function dereplicateByThreshold(
  { taxa, matrix }: DistanceResult,
  threshold: number,
  /** ids that must stay their own representative (never merged) — e.g. the query sequence. */
  pinnedIds?: Set<string>
): Dereplicated {
  // Each cluster holds original indices; `cd` is the complete-linkage distance between clusters
  // (max member-to-member distance), updated on merge via d(i∪j, k) = max(d(i,k), d(j,k)).
  const members: number[][] = taxa.map((_, i) => [i]);
  const cd: number[][] = matrix.map((row) => row.slice());
  const alive = new Set<number>(taxa.map((_, i) => i));
  // A cluster is pinned if it contains a pinned id; pinned clusters are never merged, so pinned
  // ids always end up as singleton representatives.
  const pinned: boolean[] = taxa.map((t) => !!pinnedIds?.has(t));

  for (;;) {
    let best = Infinity;
    let bi = -1;
    let bj = -1;
    const ids = [...alive];
    for (let x = 0; x < ids.length; x++) {
      for (let y = x + 1; y < ids.length; y++) {
        const i = ids[x];
        const j = ids[y];
        if (pinned[i] || pinned[j]) continue;
        const d = cd[i][j];
        if (d <= threshold && d < best) {
          best = d;
          bi = i;
          bj = j;
        }
      }
    }
    if (bi < 0) break;
    members[bi] = members[bi].concat(members[bj]);
    for (const k of alive) {
      if (k === bi || k === bj) continue;
      const d = Math.max(cd[bi][k], cd[bj][k]);
      cd[bi][k] = d;
      cd[k][bi] = d;
    }
    alive.delete(bj);
  }

  const clusters = [...alive]
    .map((a) => members[a])
    .map((c) => ({ rep: Math.min(...c), members: c.slice().sort((p, q) => p - q) }))
    .sort((a, b) => a.rep - b.rep);

  const reps: string[] = [];
  const groups: Record<string, string[]> = {};
  for (const { rep, members: cluster } of clusters) {
    const repId = taxa[rep];
    reps.push(repId);
    groups[repId] = cluster.map((i) => taxa[i]);
  }
  return { reps, groups };
}

/** Slice a distance matrix down to `reps` (a subset of its taxa), preserving order. */
export function reduceMatrix({ taxa, matrix }: DistanceResult, reps: string[]): DistanceResult {
  const idx = new Map(taxa.map((t, i) => [t, i]));
  const ri = reps.map((r) => idx.get(r)!);
  const m = ri.map((a) => ri.map((b) => matrix[a][b]));
  return { taxa: reps, matrix: m };
}
