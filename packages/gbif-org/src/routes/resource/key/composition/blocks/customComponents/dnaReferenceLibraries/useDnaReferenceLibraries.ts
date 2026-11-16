import type { DatasetType } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useMemo } from 'react';

export const DNA_REFERENCE_LIBRARY_CATEGORY = 'DNAReferenceLibrary';
const TARGET_GENE_KEY = 'nucleotideSequence.targetGene';
// Max number of datasets we list. Matches the facet size used for the dataset list.
const MAX_DATASETS = 500;
// Max number of target genes we look up. Matches the facet size used for the gene filter.
const MAX_TARGET_GENES = 200;

export type FacetBucket = { key: string; count: number };

export type DnaReferenceLibraryDataset = {
  key: string;
  title?: string | null;
  description?: string | null;
  excerpt?: string | null;
  type: DatasetType;
  publishingOrganizationTitle?: string | null;
};

type Predicate = Record<string, unknown>;

type DatasetBucket = FacetBucket & { dataset?: DnaReferenceLibraryDataset | null };

type QueryResult = {
  genes: { facet: { targetGene: FacetBucket[] } };
  search: { facet: { datasetKey: DatasetBucket[] } };
};

type QueryVariables = {
  taxonPredicate: Predicate;
  predicate: Predicate;
};

// Two aliased searches in one request:
// - genes ignores the gene filter, so the other genes stay selectable with their counts
// - search applies the gene filter, and the datasetKey facet resolves each dataset
const QUERY = /* GraphQL */ `
  query DnaReferenceLibraries($taxonPredicate: Predicate, $predicate: Predicate) {
    genes: occurrenceSearch(predicate: $taxonPredicate, size: 0) {
      facet {
        targetGene: nucleotideSequenceTargetGene(size: ${MAX_TARGET_GENES}) {
          key
          count
        }
      }
    }
    search: occurrenceSearch(predicate: $predicate, size: 0) {
      facet {
        datasetKey(size: ${MAX_DATASETS}) {
          key
          count
          dataset {
            key
            title
            description
            excerpt
            type
            publishingOrganizationTitle
          }
        }
      }
    }
  }
`;

// The predicate for all DNA reference libraries, narrowed by taxon keys if any are selected.
export function getBasePredicate(taxonKeys: string[]): Predicate {
  const predicates: Predicate[] = [
    { type: 'equals', key: 'datasetCategory', value: DNA_REFERENCE_LIBRARY_CATEGORY },
  ];
  if (taxonKeys.length > 0) {
    predicates.push({ type: 'in', key: 'taxonKey', values: taxonKeys });
  }
  return { type: 'and', predicates };
}

// The base predicate, narrowed to datasets holding one of the selected target genes.
export function getDatasetPredicate(taxonKeys: string[], targetGenes: string[]): Predicate {
  const predicates: Predicate[] = [
    { type: 'equals', key: 'datasetCategory', value: DNA_REFERENCE_LIBRARY_CATEGORY },
  ];
  if (taxonKeys.length > 0) {
    predicates.push({ type: 'in', key: 'taxonKey', values: taxonKeys });
  }
  if (targetGenes.length > 0) {
    predicates.push({ type: 'in', key: TARGET_GENE_KEY, values: targetGenes });
  }
  return { type: 'and', predicates };
}

/**
 * Loads the DNA reference libraries with one occurrence search.
 * The datasetKey facet resolves each dataset (title, description, publisher), so no separate
 * dataset lookups are needed. Taxon keys and target genes are filtered on the server.
 */
export function useDnaReferenceLibraries({
  taxonKeys,
  targetGenes,
}: {
  taxonKeys: string[];
  targetGenes: string[];
}) {
  // useQuery reloads when the variables change, so pass the predicates as plain values
  const { data, loading, error } = useQuery<QueryResult, QueryVariables>(QUERY, {
    variables: {
      taxonPredicate: getBasePredicate(taxonKeys),
      predicate: getDatasetPredicate(taxonKeys, targetGenes),
    },
    forceLoadingTrueOnMount: true,
  });

  const datasets = useMemo(
    () =>
      (data?.search.facet.datasetKey ?? [])
        .map((bucket) => bucket.dataset)
        .filter((dataset): dataset is DnaReferenceLibraryDataset => Boolean(dataset)),
    [data]
  );

  return {
    loading,
    // A partial response (some data and some errors) still shows the list, so the error is only
    // reported when there is no data
    error: data ? undefined : error,
    // true when a facet hit its size cap, so the list may be incomplete
    truncated:
      (data?.search.facet.datasetKey?.length ?? 0) >= MAX_DATASETS ||
      (data?.genes.facet.targetGene?.length ?? 0) >= MAX_TARGET_GENES,
    targetGenes: data?.genes.facet.targetGene ?? [],
    datasets,
  };
}
