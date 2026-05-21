import {
  Predicate,
  PredicateType,
  ResourceSearchQuery,
  ResourceSearchQueryVariables,
  ResourceSearchWithKeywordsQuery,
  ResourceSearchWithKeywordsQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { fragmentManager } from '@/services/fragmentManager';
import { ExtractPaginatedResult } from '@/types';
import { useEffect, useMemo } from 'react';
import { extractValidResourceSearchResults } from './resourceSearch';

export const RESOURCE_SEARCH_QUERY = /* GraphQL */ `
  query ResourceSearch(
    $from: Int
    $size: Int
    $predicate: Predicate
    $contentType: [ContentType!]
    $q: String
    $sortBy: ResourceSortBy
    $sortOrder: ResourceSortOrder
    $eventFiltering: EventFiltering
  ) {
    resourceSearch(
      predicate: $predicate
      contentType: $contentType
      q: $q
      searchable: true
      sortBy: $sortBy
      sortOrder: $sortOrder
      eventFiltering: $eventFiltering
    ) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          ...ResourceSearchResult
        }
      }
    }
  }
`;

export const RESOURCE_SEARCH_WITH_KEYWORDS_QUERY = /* GraphQL */ `
  query ResourceSearchWithKeywords(
    $from: Int
    $size: Int
    $predicate: Predicate
    $keywordsPredicate: Predicate
    $contentType: [ContentType!]
    $q: String
    $sortBy: ResourceSortBy
    $sortOrder: ResourceSortOrder
    $eventFiltering: EventFiltering
  ) {
    resourceSearch(
      predicate: $predicate
      contentType: $contentType
      q: $q
      searchable: true
      sortBy: $sortBy
      sortOrder: $sortOrder
      eventFiltering: $eventFiltering
    ) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          ...ResourceSearchResult
        }
      }
    }

    resourceKeywordSearch: resourceSearch(
      predicate: $keywordsPredicate
      contentType: $contentType
      searchable: true
      sortBy: $sortBy
      sortOrder: $sortOrder
      eventFiltering: $eventFiltering
    ) {
      documents(size: 5) {
        from
        size
        total
        results {
          ...ResourceSearchResult
        }
      }
    }
  }
`;

fragmentManager.register(/* GraphQL */ `
  fragment ResourceSearchResult on Resource {
    __typename
    ... on Composition {
      ...CompositionResult
    }
    ... on News {
      ...NewsResult
    }
    ... on Article {
      ...ArticleResult
    }
    ... on DataUse {
      ...DataUseResult
    }
    ... on MeetingEvent {
      ...EventResult
    }
    ... on GbifProject {
      ...ProjectResult
    }
    ... on Programme {
      ...ProgrammeResult
    }
    ... on Tool {
      ...ToolResult
    }
    ... on Document {
      ...DocumentResult
    }
    ... on Document {
      ...DocumentResult
    }
    ... on NetworkProse {
      ...NetworkProseResult
    }
    ... on Help {
      ...HelpResult
    }
  }
`);

export type Resource = Extract<
  ExtractPaginatedResult<ResourceSearchQuery['resourceSearch']>,
  { id: string }
>;

type UseResourceSearchArgs = {
  variables: Omit<ResourceSearchQueryVariables, 'from' | 'size'>;
  offset: number;
  size?: number;
};

export function useResourceSearch({ variables, offset, size = 20 }: UseResourceSearchArgs) {
  const q = variables.q;
  const includeKeywordSearch = typeof q === 'string' && q.length > 0 && offset === 0;

  const standardQuery = useQuery<ResourceSearchQuery, ResourceSearchQueryVariables>(
    RESOURCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      keepDataWhileLoading: true,
      forceLoadingTrueOnMount: true,
      lazyLoad: true,
    }
  );

  const keywordsQuery = useQuery<
    ResourceSearchWithKeywordsQuery,
    ResourceSearchWithKeywordsQueryVariables
  >(RESOURCE_SEARCH_WITH_KEYWORDS_QUERY, {
    throwAllErrors: true,
    keepDataWhileLoading: true,
    forceLoadingTrueOnMount: true,
    lazyLoad: true,
  });

  const { load: loadStandard } = standardQuery;
  const { load: loadWithKeywords } = keywordsQuery;

  useEffect(() => {
    if (includeKeywordSearch) {
      const keywordsPredicate: Predicate = {
        type: PredicateType.And,
        predicates: [
          ...(variables.predicate ? [variables.predicate] : []),
          {
            type: PredicateType.In,
            key: 'keywords',
            values: [q as string],
          },
        ],
      };

      loadWithKeywords({
        variables: {
          ...variables,
          keywordsPredicate,
          size,
          from: offset,
        },
      });
    } else {
      loadStandard({
        variables: {
          ...variables,
          size,
          from: offset,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadStandard,
    loadWithKeywords,
    includeKeywordSearch,
    JSON.stringify(variables),
    offset,
    size,
  ]);

  const active = includeKeywordSearch ? keywordsQuery : standardQuery;

  const resources = useMemo(() => {
    const main = extractValidResourceSearchResults(active.data?.resourceSearch);

    if (!includeKeywordSearch) return main;
    let keywordResults: Resource[] = [];

    if (active.data != null && 'resourceKeywordSearch' in active.data) {
      keywordResults = extractValidResourceSearchResults(active.data?.resourceKeywordSearch);
      if (keywordResults.length === 0) return main;
    }

    const seen = new Set(keywordResults.map((r) => r.id));
    return [...keywordResults, ...main.filter((r) => !seen.has(r.id))];
  }, [active.data, includeKeywordSearch]);

  return {
    loading: active.loading,
    resources,
    total: active.data?.resourceSearch?.documents?.total as number | undefined,
    size: active.data?.resourceSearch?.documents?.size as number | undefined,
  };
}
