// Coverage filtering for the sequence tree. Short partial sequences can't be placed reliably by a
// distance method: with pairwise-deletion p-distance their distance is computed over very few
// shared columns, which is biased low, so they act as "attractors" and distort the tree. We hide
// sequences whose resolved length is below a fraction of the set's median length.

const RESOLVED = new Set(['A', 'C', 'G', 'T', 'U']);

/** Number of resolved bases (A/C/G/T/U) in a sequence — ignores gaps, N and other ambiguity codes. */
export function resolvedLength(seq: string): number {
  let c = 0;
  const s = seq.toUpperCase();
  for (let i = 0; i < s.length; i++) if (RESOLVED.has(s[i])) c++;
  return c;
}

export type CoverageFilter = {
  /** id -> sequence, keeping only those at or above the coverage threshold. */
  kept: Record<string, string>;
  /** ids dropped for being too short. */
  hiddenIds: string[];
  /** median resolved length across the input set. */
  median: number;
  /** the length threshold applied (fraction * median). */
  minLength: number;
};

/**
 * Keep sequences whose resolved length is >= `fraction` of the set's median resolved length; drop
 * the rest. Median-relative so it adapts to the dataset (e.g. a short marker vs full ITS) rather
 * than a fixed base count.
 */
export function filterByCoverage(
  seqById: Record<string, string>,
  fraction: number
): CoverageFilter {
  const ids = Object.keys(seqById);
  if (ids.length === 0) return { kept: {}, hiddenIds: [], median: 0, minLength: 0 };
  const lens = ids.map((id) => resolvedLength(seqById[id]));
  const sorted = [...lens].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const minLength = fraction * median;
  const kept: Record<string, string> = {};
  const hiddenIds: string[] = [];
  ids.forEach((id, i) => {
    if (lens[i] >= minLength) kept[id] = seqById[id];
    else hiddenIds.push(id);
  });
  return { kept, hiddenIds, median, minLength };
}
