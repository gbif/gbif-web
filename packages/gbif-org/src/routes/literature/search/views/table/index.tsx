import { getAsQuery } from '@/components/filters/filterTools';
import { ViewHeader } from '@/components/ViewHeader';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { LiteratureTableSearchQuery, LiteratureTableSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { columns } from './columns';
import {
  FallbackTableOptions,
  useAvailableAndDefaultEnabledColumns,
  usePaginationState,
  SearchTable,
} from '@/components/searchTable';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { SearchTableServerFallback } from '@/components/searchTable/table';

const fallbackOptions: FallbackTableOptions = {
  prefixColumns: ['titleAndAbstract'],
  defaultEnabledTableColumns: ['literatureType', 'year', 'relevance', 'topics'],
};

const LITERATURE_TABLE_SEARCH = /* GraphQL */ `
  query LiteratureTableSearch($from: Int, $size: Int, $predicate: Predicate) {
    literatureSearch(predicate: $predicate) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          id
          title
          abstract
          authors {
            firstName
            lastName
          }
          countriesOfCoverage
          countriesOfResearcher
          day
          month
          year
          gbifRegion
          identifiers {
            doi
          }
          keywords
          language
          literatureType
          openAccess
          peerReview
          publisher
          relevance
          source
          tags
          topics
          websites
        }
      }
    }
  }
`;

export type SingleLiteratureSearchResult = ExtractPaginatedResult<
  LiteratureTableSearchQuery['literatureSearch']
>;

const keySelector = (item: SingleLiteratureSearchResult) => item.id;

export function LiteratureTable() {
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, load, loading } = useQuery<
    LiteratureTableSearchQuery,
    LiteratureTableSearchQueryVariables
  >(LITERATURE_TABLE_SEARCH, {
    throwAllErrors: true,
    lazyLoad: true,
    keepDataWhileLoading: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });

    load({
      variables: {
        predicate: {
          ...query,
        },
        size: paginationState.pageSize,
        from: paginationState.pageIndex * paginationState.pageSize,
      },
    });

    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, filterHash, searchContext, paginationState.pageIndex, paginationState.pageSize]);

  const { filters } = useFilters({ searchConfig });

  const literature = useMemo(
    () => data?.literatureSearch?.documents.results.filter(notNull) ?? [],
    [data]
  );

  const { availableTableColumns, defaultEnabledTableColumns } =
    useAvailableAndDefaultEnabledColumns({
      searchMetadata: searchContext,
      columns,
      fallbackOptions,
    });

  return (
    <div className="g-flex g-flex-col g-h-full">
      <div className="g-flex g-gap-2 g-items-center g-justify-between">
        <ViewHeader
          total={data?.literatureSearch?.documents.total}
          loading={loading}
          message="counts.nResults"
        />
      </div>
      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <SearchTable
          hideColumnVisibilityDropdown
          filters={filters}
          keySelector={keySelector}
          lockColumnLocalStoreKey="literatureSearchTableLockColumn"
          selectedColumnsLocalStoreKey="literatureSearchSelectedColumns"
          columns={columns}
          data={literature}
          loading={loading}
          rowCount={data?.literatureSearch?.documents.total}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          availableTableColumns={availableTableColumns}
          defaultEnabledTableColumns={defaultEnabledTableColumns}
        />
      </ClientSideOnly>
    </div>
  );
}
