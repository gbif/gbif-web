import { Predicate, PredicateType } from '@/gql/graphql';

// A facetable rank: `rank` is the enum value (for labels/taxonMatch) and `key`
// is the occurrence facet/cardinality field used to drill into it.
export type RankDef = { rank: string; key: string };

// Default rank set: the main Linnean ranks, which are the only ranks the
// occurrence index currently exposes facets for (each accepts a checklistKey).
// Pass a different ordered list via the `ranks` prop to build a different tree.
export const MAJOR_TAXON_RANKS: RankDef[] = [
  { rank: 'KINGDOM', key: 'kingdomKey' },
  { rank: 'PHYLUM', key: 'phylumKey' },
  { rank: 'CLASS', key: 'classKey' },
  { rank: 'ORDER', key: 'orderKey' },
  { rank: 'FAMILY', key: 'familyKey' },
  { rank: 'GENUS', key: 'genusKey' },
  { rank: 'SPECIES', key: 'speciesKey' },
];

// A node is described by the chain of rank constraints from the root down to it.
// taxonKey === null means "this rank is absent" (the inferred placeholder), which
// is expressed as an isNull predicate and can be drilled into thanks to negation.
export type Constraint = { rankIndex: number; taxonKey: string | null };

export function buildNodePredicate(
  base: Predicate | undefined | null,
  constraints: Constraint[],
  ranks: RankDef[],
  checklistKey?: string
): Predicate | undefined {
  const parts: Predicate[] = [];
  if (base) parts.push(base);

  for (const c of constraints) {
    const key = ranks[c.rankIndex].key;
    if (c.taxonKey === null) {
      parts.push({
        type: PredicateType.IsNull,
        key,
        ...(checklistKey ? { checklistKey } : {}),
      });
    } else {
      parts.push({
        type: PredicateType.Equals,
        key,
        value: c.taxonKey,
        ...(checklistKey ? { checklistKey } : {}),
      });
    }
  }

  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return { type: PredicateType.And, predicates: parts };
}

// Builds a query that, under a given predicate, returns the node total, the
// cardinality of every remaining rank (used to skip empty ranks and detect
// truncation) and the facet for one specific rank.
export function buildChildrenQuery({
  ranks,
  cardinalityFromIndex,
  facetIndex,
}: {
  ranks: RankDef[];
  cardinalityFromIndex: number;
  facetIndex: number;
}): string {
  const cardinalityRanks = ranks.slice(cardinalityFromIndex);
  const facetKey = ranks[facetIndex].key;
  return /* GraphQL */ `
query taxonTreeChildren($predicate: Predicate, $q: String, $checklistKey: ID, $size: Int) {
  search: occurrenceSearch(predicate: $predicate, q: $q, size: 0) {
    documents(size: 0) {
      total
    }
    cardinality {
      ${cardinalityRanks.map((r) => `${r.key}: ${r.key}(checklistKey: $checklistKey)`).join('\n      ')}
    }
    facet {
      children: ${facetKey}(size: $size, checklistKey: $checklistKey) {
        key
        count
        label
        taxon: taxonMatch(checklistKey: $checklistKey) {
          usage {
            key
            name
            canonicalName
            rank
          }
        }
      }
    }
  }
}`;
}

export type TaxonBucket = {
  key: string;
  count: number;
  label?: string | null;
  taxon?: {
    usage?: {
      key?: string | null;
      name?: string | null;
      canonicalName?: string | null;
      rank?: string | null;
    } | null;
  } | null;
};

export type TaxonChildrenResult = {
  search?: {
    documents?: { total?: number | null } | null;
    cardinality?: Record<string, number | null> | null;
    facet?: { children?: Array<TaxonBucket | null> | null } | null;
  } | null;
};

export type TaxonChildrenVariables = {
  predicate?: Predicate;
  q?: string;
  checklistKey?: string;
  size?: number;
};
