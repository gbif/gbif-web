import { FilterType } from '@/contexts/filter';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import rankEnum from '@/enums/basic/rank.json';
import { useEffect } from 'react';

const MAJOR_RANKS = new Set(['KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS', 'SPECIES']);

/** Returns the next finer major rank after `currentRank`, or null if none exists. */
function getNextLowerMajorRank(currentRank: string): string | null {
  const idx = rankEnum.indexOf(currentRank.toUpperCase() as never);
  if (idx === -1) return null;
  const nextIdx = rankEnum.findIndex((r, i) => i > idx && MAJOR_RANKS.has(r));
  return nextIdx > -1 ? rankEnum[nextIdx] : null;
}

const PARENT_TAXON_QUERY = /* GraphQL */ `
  query ParentTaxonLookup($key: ID!, $datasetKey: ID) {
    taxon(key: $key, datasetKey: $datasetKey) {
      taxonID
      scientificName
      taxonRank
      parentTree {
        taxonID
        scientificName
        taxonRank
      }
    }
  }
`;

type ParentTaxon = {
  taxonID: string;
  scientificName?: string | null;
  taxonRank: string;
};

type ParentTaxonQueryResult = {
  taxon?: {
    taxonID: string;
    scientificName: string;
    taxonRank: string;
    parentTree?: ParentTaxon[] | null;
  } | null;
};

type ParentTaxonQueryVariables = {
  key: string;
  datasetKey?: string;
};

type Options = {
  /** When true, skips non-major ranks and returns the first ancestor with a major rank
   * (KINGDOM, PHYLUM, CLASS, ORDER, FAMILY, GENUS, SPECIES).
   * e.g. a genus will skip SUBFAMILY and jump to FAMILY, or ORDER if FAMILY is absent.
   */
  majorRanksOnly?: boolean;
};

type UseParentTaxonResult = {
  /** The parent taxon, or null if there is not exactly one taxonKey in the filter */
  parent: ParentTaxon | null;
  /**
   * The next finer major rank below the current taxon's rank, or null if none.
   * e.g. for a GENUS or SUBGENUS this is 'SPECIES'; for a FAMILY it is 'GENUS'.
   * Only a rank label — no taxon object is available for this.
   */
  nextLowerMajorRank: string | null;
  loading: boolean;
};

/**
 * Returns the first (immediate) parent of the single taxonKey present in the filter.
 * Returns null if there are zero or more than one taxonKey values in the filter.
 *
 * @param filter - The current filter object
 * @param options.majorRanksOnly - When true, skips minor ranks and returns the closest
 *   ancestor with a major rank (KINGDOM, PHYLUM, CLASS, ORDER, FAMILY, GENUS, SPECIES)
 */
export function useParentTaxon(
  filter: FilterType | undefined,
  options: Options = {}
): UseParentTaxonResult {
  const { majorRanksOnly = false } = options;
  const checklistKey = useChecklistKey();

  const taxonKeys: (string | number)[] = filter?.must?.taxonKey ?? [];
  const singleKey = taxonKeys.length === 1 ? String(taxonKeys[0]) : null;

  const { data, load, loading } = useQuery<ParentTaxonQueryResult, ParentTaxonQueryVariables>(
    PARENT_TAXON_QUERY,
    { lazyLoad: true }
  );

  useEffect(() => {
    if (singleKey) {
      load({ variables: { key: singleKey, datasetKey: checklistKey } });
    }
  }, [singleKey, checklistKey, load]);

  if (!singleKey) {
    return { parent: null, nextLowerMajorRank: null, loading: false };
  }

  const currentRank = data?.taxon?.taxonRank ?? null;
  const nextLowerMajorRank = currentRank ? getNextLowerMajorRank(currentRank) : null;

  const parentTree = data?.taxon?.parentTree ?? [];

  if (majorRanksOnly) {
    // Scan from the immediate parent upward to find the closest ancestor with a major rank
    for (let i = parentTree.length - 2; i >= 0; i--) {
      const rank = parentTree[i].taxonRank?.toUpperCase();
      if (rank && MAJOR_RANKS.has(rank)) {
        return { parent: parentTree[i], nextLowerMajorRank, loading };
      }
    }
    return { parent: null, nextLowerMajorRank, loading };
  }

  // Return the immediate parent (last element in parentTree, ordered root → immediate parent)
  const parent = parentTree.length > 0 ? parentTree[parentTree.length - 1] : null;
  return { parent, nextLowerMajorRank, loading };
}
