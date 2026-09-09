export type DistanceResult = { taxa: string[]; matrix: number[][] };

// Sites that count towards a p-distance comparison. Gaps ('-'), 'N' and other ambiguity codes
// are excluded (pairwise deletion): a column is only compared when both sequences have a
// resolved base there.
const RESOLVED = new Set(['A', 'C', 'G', 'T', 'U']);

/**
 * Pairwise p-distance matrix from an alignment (id -> aligned, equal-length sequences).
 * p-distance = differing sites / compared sites, with pairwise deletion of gap/ambiguous
 * columns. Symmetric; zero on the diagonal. If a pair shares no comparable columns the
 * distance is 0 (degenerate, but keeps the matrix well-formed).
 */
export function pDistanceMatrix(alignedById: Record<string, string>): DistanceResult {
  const taxa = Object.keys(alignedById);
  const seqs = taxa.map((id) => alignedById[id].toUpperCase());
  const n = taxa.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = seqs[i];
      const b = seqs[j];
      const len = Math.min(a.length, b.length);
      let compared = 0;
      let diff = 0;
      for (let k = 0; k < len; k++) {
        const ca = a[k];
        const cb = b[k];
        if (!RESOLVED.has(ca) || !RESOLVED.has(cb)) continue;
        compared++;
        if (ca !== cb) diff++;
      }
      const d = compared > 0 ? diff / compared : 0;
      matrix[i][j] = d;
      matrix[j][i] = d;
    }
  }
  return { taxa, matrix };
}
