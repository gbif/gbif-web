import { ResourceSearchQueryVariables, ResourceSortBy, ResourceSortOrder } from '@/gql/graphql';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type ResourceSortValue = 'relevance' | 'createdAt_desc' | 'createdAt_asc';

const VALID_SORTS: ResourceSortValue[] = ['relevance', 'createdAt_desc', 'createdAt_asc'];

function parseSort(value?: string): ResourceSortValue | undefined {
  return VALID_SORTS.includes(value as ResourceSortValue)
    ? (value as ResourceSortValue)
    : undefined;
}

// The explicit sort choice, if any. `undefined` means "use the contextual default"
// (relevance while free-text searching, newest first otherwise) - see getDefaultResourceSort.
//
// Changing the sort also resets pagination. Both changes are applied through a single
// setSearchParams call rather than a separate setOffset call: react-router's setSearchParams
// closes over the search params from the current render, so two sequential calls in the same
// event handler would each compute their target URL from the same pre-click params, and the
// second navigation would silently clobber the first (the sort change appears in the URL only
// to be reverted immediately after).
export function useResourceSort(): [
  ResourceSortValue | undefined,
  (value: ResourceSortValue | undefined) => void,
] {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = parseSort(searchParams.get('sort') ?? undefined);

  const setSort = useCallback(
    (value: ResourceSortValue | undefined) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === undefined) {
            next.delete('sort');
          } else {
            next.set('sort', value);
          }
          next.delete('offset');
          return next;
        },
        { preventScrollReset: true }
      );
    },
    [setSearchParams]
  );

  return [sort, setSort];
}

export function getDefaultResourceSort(hasQuery: boolean): ResourceSortValue {
  return hasQuery ? 'relevance' : 'createdAt_desc';
}

export function getResourceSortVariables(
  sort: ResourceSortValue
): Pick<ResourceSearchQueryVariables, 'sortBy' | 'sortOrder'> {
  switch (sort) {
    case 'createdAt_asc':
      return { sortBy: ResourceSortBy.CreatedAt, sortOrder: ResourceSortOrder.Asc };
    case 'createdAt_desc':
      return { sortBy: ResourceSortBy.CreatedAt, sortOrder: ResourceSortOrder.Desc };
    case 'relevance':
      // Omitting sortBy makes the es-api fall back to its relevance (_score) sort.
      return { sortBy: undefined, sortOrder: undefined };
  }
}
