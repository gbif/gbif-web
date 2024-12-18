import { getAsQuery } from '@/components/filters/filterTools';
import SearchTable from '@/components/searchTable/table';
import { usePaginationState } from '@/components/searchTable/usePaginationState';
import { ViewHeader } from '@/components/ViewHeader';
import { useConfig } from '@/config/config';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { LiteratureTableSearchQuery, LiteratureTableSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useResetPaginationOnFilterChange } from '@/hooks/useResetPaginationOnFilterChange';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { useLiteratureColumns } from './columns';

// TODO: Should maybe be moved to the configBuilder
const DAFAULT_AVAILABLE_TABLE_COLUMNS = Object.freeze([
  'titleAndAbstract',
  'literatureType',
  'year',
  'relevance',
  'topics',
]);

const DEFAULT_ENABLED_TABLE_COLUMNS = Object.freeze([...DAFAULT_AVAILABLE_TABLE_COLUMNS]);

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

export function LiteratureTable() {
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  useResetPaginationOnFilterChange(setPaginationState);
  const filterContext = useContext(FilterContext);
  const config = useConfig();

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

  const columns = useLiteratureColumns({
    filters,
    disableCellFilters: config.disableInlineTableFilterButtons,
  });

  const literature = useMemo(
    () => data?.literatureSearch?.documents.results.filter(notNull) ?? [],
    [data]
  );

  // TODO: Should the logic be located in the config?
  const availableTableColumns = useMemo(
    () => [
      'titleAndAbstract',
      ...(config?.literatureSearch?.availableTableColumns ?? DAFAULT_AVAILABLE_TABLE_COLUMNS),
    ],
    [config]
  );

  const defaultEnabledTableColumns = useMemo(
    () => [
      'title',
      ...(config?.literatureSearch?.defaultEnabledTableColumns ?? DEFAULT_ENABLED_TABLE_COLUMNS),
    ],
    [config]
  );

  return (
    <div className="g-flex g-flex-col g-h-full">
      <ViewHeader
        total={data?.literatureSearch?.documents.total}
        loading={loading}
        message="counts.nResults"
      />
      <SearchTable
        lockColumnLocalStoreKey="literatureSearchTableLockColumn"
        selectedColumnsLocalStoreKey="literatureSearchSelectedColumns"
        columns={columns}
        data={literature}
        loading={loading}
        rowCount={data?.literatureSearch?.documents.total}
        pagination={paginationState}
        setPaginationState={setPaginationState}
        availableTableColumns={availableTableColumns}
        defaultEnabledTableColumns={defaultEnabledTableColumns}
      />
    </div>
  );
}
