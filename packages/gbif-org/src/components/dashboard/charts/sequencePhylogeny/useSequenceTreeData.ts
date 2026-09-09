import { useEffect, useMemo } from 'react';
import useQuery from '@/hooks/useQuery';
import { useConfig } from '@/config/config';

export type TreePoint = {
  key: number;
  lat: number;
  lon: number;
  scientificName?: string | null;
  targetGene?: string | null;
};

/** One scientific name observed for a sequence, with how many occurrences carried it. */
export type NameCount = { taxonKey: string | null; name: string; count: number };
/** The distribution of scientific names seen for a single nucleotideSequenceID. */
export type NameAgg = {
  /** names sorted by count, descending. */
  names: NameCount[];
  /** number of distinct taxa (names.length) — > 1 means the sequence is identified ambiguously. */
  distinct: number;
  /** occurrences considered for this id (bounded by the map query cap). */
  sampled: number;
};

export type SequenceTreeData = {
  /** nucleotideSequenceID -> normalised sequence (tree tips). */
  seqById: Record<string, string>;
  /** nucleotideSequenceID -> occurrences carrying that exact sequence (map dots). */
  pointsById: Record<string, TreePoint[]>;
  /** nucleotideSequenceID -> scientific-name distribution across its occurrences (tip labels). */
  namesById: Record<string, NameAgg>;
  matchedIds: string[];
  loading: boolean;
  error?: unknown;
  /** total occurrences matched by the predicate. */
  total: number;
  /** true when the map query hit its cap (more occurrences than dots shown). */
  mapCapped: boolean;
  /** true when there are more matched sequences than we will align. */
  capped: boolean;
  maxSequences: number;
};

// Aligning + NJ is done client-side; keep the set small. vsearch usually returns < 250.
const MAX_SEQUENCES = 250;
// Occurrences scanned to collect one sequence per matched ID. Only needs to cover the (<= 250)
// unique IDs, and common IDs appear early, so this is comfortably enough in practice.
const TREE_FETCH_SIZE = 500;
// Occurrences plotted as dots. Records here are lightweight (id + coordinates, no sequence
// strings), so this can be larger than the tree query. It is an explicit cap on the dot count.
const MAP_FETCH_SIZE = 3000;

// Lean: just enough to get one sequence per matched ID (no coordinates / names).
const TREE_QUERY = /* GraphQL */ `
  query SequencePhylogenySequences($predicate: Predicate, $size: Int) {
    occurrenceSearch(predicate: $predicate) {
      documents(size: $size) {
        total
        results {
          nucleotideSequences {
            nucleotideSequenceID
            sequence
          }
        }
      }
    }
  }
`;

// Lighter: per-occurrence coordinates + which matched sequence it carries (no sequence strings).
// The interpreted name comes from classification.usage (top-level scientificName is not populated
// on occurrenceSearch documents); usage.key is the taxon key we group names by.
const MAP_QUERY = /* GraphQL */ `
  query SequencePhylogenyMap($predicate: Predicate, $size: Int, $checklistKey: ID) {
    occurrenceSearch(predicate: $predicate) {
      documents(size: $size) {
        total
        results {
          key
          decimalLatitude
          decimalLongitude
          classification(checklistKey: $checklistKey) {
            usage {
              name
              key
            }
          }
          nucleotideSequences {
            nucleotideSequenceID
            targetGene {
              concept
            }
          }
        }
      }
    }
  }
`;

type SeqResult = {
  occurrenceSearch?: {
    documents?: {
      total?: number;
      results?: Array<{
        nucleotideSequences?: Array<{
          nucleotideSequenceID?: string | null;
          sequence?: string | null;
        }> | null;
      }>;
    };
  };
};

type MapResult = {
  occurrenceSearch?: {
    documents?: {
      total?: number;
      results?: Array<{
        key: number;
        decimalLatitude?: number | null;
        decimalLongitude?: number | null;
        classification?: { usage?: { name?: string | null; key?: string | number | null } | null } | null;
        nucleotideSequences?: Array<{
          nucleotideSequenceID?: string | null;
          targetGene?: { concept?: string | null } | null;
        }> | null;
      }>;
    };
  };
};

// Collect nucleotideSequenceIDs constrained by a positive `in`/`equals` in the predicate (the
// "Similar sequences" filter). Negations are skipped so we don't treat excluded IDs as matches.
function extractSequenceIds(predicate: unknown): string[] {
  const ids = new Set<string>();
  const walk = (node: any, negated: boolean): void => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((n) => walk(n, negated));
      return;
    }
    const type = node.type;
    if (
      !negated &&
      (type === 'in' || type === 'equals') &&
      node.key === 'nucleotideSequence.nucleotideSequenceID'
    ) {
      if (Array.isArray(node.values)) node.values.forEach((v: unknown) => ids.add(String(v)));
      if (node.value != null) ids.add(String(node.value));
    }
    const childNegated = negated || type === 'not';
    if (node.predicate) walk(node.predicate, childNegated);
    if (node.predicates) walk(node.predicates, childNegated);
  };
  walk(predicate, false);
  return [...ids];
}

/**
 * Resolve the "Similar sequences" match set into the data the phylogeny view needs, using two
 * queries: a lean one that fetches one sequence per matched ID (tree tips), and a lighter one that
 * fetches occurrence coordinates for the map. Map dots are restricted to IDs we actually got a
 * sequence for, so every dot corresponds to a tree tip.
 */
export function useSequenceTreeData(predicate: unknown): SequenceTreeData {
  const { defaultChecklistKey } = useConfig();
  const matchedIds = useMemo(() => extractSequenceIds(predicate), [predicate]);
  const matchedKey = matchedIds.join(',');
  const capped = matchedIds.length > MAX_SEQUENCES;

  const tree = useQuery<SeqResult, unknown>(TREE_QUERY, { lazyLoad: true });
  const map = useQuery<MapResult, unknown>(MAP_QUERY, { lazyLoad: true });

  useEffect(() => {
    if (matchedIds.length === 0 || capped) return;
    tree.load({ variables: { predicate, size: TREE_FETCH_SIZE } });
    map.load({ variables: { predicate, size: MAP_FETCH_SIZE, checklistKey: defaultChecklistKey } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedKey, capped, defaultChecklistKey]);

  const seqById = useMemo(() => {
    const out: Record<string, string> = {};
    const matched = new Set(matchedIds);
    for (const occ of tree.data?.occurrenceSearch?.documents?.results ?? []) {
      for (const ns of occ.nucleotideSequences ?? []) {
        const id = ns?.nucleotideSequenceID;
        if (id && matched.has(id) && ns.sequence && !out[id]) out[id] = ns.sequence;
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.data, matchedKey]);

  const seqIdsKey = useMemo(() => Object.keys(seqById).sort().join(','), [seqById]);

  const pointsById = useMemo(() => {
    const out: Record<string, TreePoint[]> = {};
    const have = new Set(seqIdsKey ? seqIdsKey.split(',') : []);
    for (const occ of map.data?.occurrenceSearch?.documents?.results ?? []) {
      if (occ.decimalLatitude == null || occ.decimalLongitude == null) continue;
      const seen = new Set<string>();
      for (const ns of occ.nucleotideSequences ?? []) {
        const id = ns?.nucleotideSequenceID;
        if (!id || !have.has(id) || seen.has(id)) continue;
        seen.add(id);
        (out[id] ||= []).push({
          key: occ.key,
          lat: occ.decimalLatitude,
          lon: occ.decimalLongitude,
          scientificName: occ.classification?.usage?.name ?? null,
          targetGene: ns.targetGene?.concept ?? null,
        });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map.data, seqIdsKey]);

  // Scientific-name distribution per sequence. Aggregated from the raw map results (NOT pointsById)
  // so coordinate-less occurrences still contribute — names must not depend on georeferencing.
  // Grouped by taxonKey (fallback to the name string) so synonym/authorship variants of the same
  // taxon don't read as ambiguity.
  const namesById = useMemo(() => {
    const out: Record<string, NameAgg> = {};
    const have = new Set(seqIdsKey ? seqIdsKey.split(',') : []);
    // id -> groupKey -> NameCount (accumulator)
    const acc: Record<string, Map<string, NameCount>> = {};
    for (const occ of map.data?.occurrenceSearch?.documents?.results ?? []) {
      const usage = occ.classification?.usage;
      const name = usage?.name ?? null;
      const taxonKey = usage?.key != null ? String(usage.key) : null;
      const groupKey = taxonKey ?? name ?? 'unknown';
      const seen = new Set<string>();
      for (const ns of occ.nucleotideSequences ?? []) {
        const id = ns?.nucleotideSequenceID;
        if (!id || !have.has(id) || seen.has(id)) continue;
        seen.add(id);
        const byKey = (acc[id] ||= new Map());
        const existing = byKey.get(groupKey);
        if (existing) existing.count += 1;
        else byKey.set(groupKey, { taxonKey, name: name ?? 'Unknown', count: 1 });
      }
    }
    for (const [id, byKey] of Object.entries(acc)) {
      const names = [...byKey.values()].sort((a, b) => b.count - a.count);
      out[id] = {
        names,
        distinct: names.length,
        sampled: names.reduce((s, n) => s + n.count, 0),
      };
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map.data, seqIdsKey]);

  const total = map.data?.occurrenceSearch?.documents?.total ?? tree.data?.occurrenceSearch?.documents?.total ?? 0;

  return {
    seqById,
    pointsById,
    namesById,
    matchedIds,
    loading: tree.loading || map.loading,
    error: tree.error || map.error,
    total,
    mapCapped: total > MAP_FETCH_SIZE,
    capped,
    maxSequences: MAX_SEQUENCES,
  };
}
