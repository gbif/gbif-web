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

// search and facet are nullable in the schema, e.g. when the search fails in a partial response
type QueryResult = {
  search?: {
    facet?: {
      datasetKey?: Array<{
        key: string;
        count: number;
        dataset?: DnaReferenceLibraryDataset | null;
      }> | null;
    } | null;
  } | null;
};

// One occurrence search. The datasetKey facet resolves each dataset (title, description, publisher),
// so no separate dataset lookups are needed. The facet size is a variable rather than interpolated,
// so codegen can parse and check the query.
const QUERY = /* GraphQL */ `
  query DnaReferenceLibraries($predicate: Predicate, $size: Int) {
    search: occurrenceSearch(predicate: $predicate, size: 0) {
      facet {
        datasetKey(size: $size) {
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
  const { data, loading, error } = useQuery<
    QueryResult,
    { predicate?: Record<string, unknown>; size: number }
  >(QUERY, {
    variables: { predicate, size: MAX_DATASETS },
    forceLoadingTrueOnMount: true,
  });

  const datasetBuckets = data?.search?.facet?.datasetKey ?? undefined;
  const datasets = useMemo(
    () =>
      (datasetBuckets ?? [])
        .map((bucket) => bucket.dataset)
        .filter((dataset): dataset is DnaReferenceLibraryDataset => Boolean(dataset)),
    [datasetBuckets]
  );

  return {
    // No data and no error means a request is still due or in flight. This covers the gap after an
    // earlier request is aborted for a newer one, where useQuery briefly reports not loading.
    loading: loading || (!data && !error),
    // A partial response that still has the list shows it, so the error is only reported when the
    // list is missing
    error: datasetBuckets ? undefined : error,
    // true when the facet hit its size cap, so the list may be incomplete
    truncated: (datasetBuckets?.length ?? 0) >= MAX_DATASETS,
    datasets,
  };
}
