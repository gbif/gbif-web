import type { DatasetType } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useMemo } from 'react';

// Max number of datasets we list. Matches the facet size used for the dataset list.
export const MAX_DATASETS = 500;

export type DnaReferenceLibraryDataset = {
  key: string;
  title?: string | null;
  description?: string | null;
  excerpt?: string | null;
  type: DatasetType;
  publishingOrganizationTitle?: string | null;
};

type QueryResult = {
  search: {
    facet: {
      datasetKey: Array<{
        key: string;
        count: number;
        dataset?: DnaReferenceLibraryDataset | null;
      }>;
    };
  };
};

// One occurrence search. The datasetKey facet resolves each dataset (title, description, publisher),
// so no separate dataset lookups are needed.
const QUERY = /* GraphQL */ `
  query DnaReferenceLibraries($predicate: Predicate) {
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

/**
 * Loads the DNA reference libraries for a predicate built from the shared filter state.
 * The predicate already includes the DNA reference library scope.
 */
export function useDnaReferenceLibraries({ predicate }: { predicate?: Record<string, unknown> }) {
  const { data, loading, error } = useQuery<QueryResult, { predicate?: Record<string, unknown> }>(
    QUERY,
    {
      variables: { predicate },
      forceLoadingTrueOnMount: true,
    }
  );

  const datasetBuckets = data?.search.facet.datasetKey;
  const datasets = useMemo(
    () =>
      (datasetBuckets ?? [])
        .map((bucket) => bucket.dataset)
        .filter((dataset): dataset is DnaReferenceLibraryDataset => Boolean(dataset)),
    [datasetBuckets]
  );

  return {
    loading,
    // A partial response (some data and some errors) still shows the list, so the error is only
    // reported when there is no data
    error: data ? undefined : error,
    // true when the facet hit its size cap, so the list may be incomplete
    truncated: (datasetBuckets?.length ?? 0) >= MAX_DATASETS,
    datasets,
  };
}
