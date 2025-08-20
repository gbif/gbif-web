import { ClientSideOnly } from '@/components/clientSideOnly';
import { getAsQuery } from '@/components/filters/filterTools';
import { GbifLogoIcon } from '@/components/icons/icons';
import { Tag } from '@/components/resultCards';
import {
  FallbackTableOptions,
  SearchTable,
  useAvailableAndDefaultEnabledColumns,
  usePaginationState,
} from '@/components/searchTable';
import { SearchTableServerFallback } from '@/components/searchTable/table';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { LiteratureWidgetSearchQuery, LiteratureWidgetSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { useFilters } from '../literature/search/filters';
import { searchConfig } from '../literature/search/searchConfig';
import { columns } from './columns';

const fallbackOptions: FallbackTableOptions = {
  prefixColumns: ['titleAndAbstract'],
  defaultEnabledTableColumns: ['literatureType', 'year', 'relevance', 'topics'],
};

export const LITERATURE_WIDGET_SEARCH = /* GraphQL */ `
  query LiteratureWidgetSearch($from: Int, $size: Int, $predicate: Predicate) {
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

          identifiers {
            doi
          }
        }
      }
    }
  }
`;

export type SingleLiteratureSearchResult = ExtractPaginatedResult<
  LiteratureWidgetSearchQuery['literatureSearch']
>;

const keySelector = (item: SingleLiteratureSearchResult) => item.id;

export function LiteratureTable() {
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);
  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const [searchParams] = useSearchParams();

  const { data, load, loading } = useQuery<
    LiteratureWidgetSearchQuery,
    LiteratureWidgetSearchQueryVariables
  >(LITERATURE_WIDGET_SEARCH, {
    throwAllErrors: true,
    lazyLoad: true,
    keepDataWhileLoading: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });

    load({
      variables: {
        ...query,
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
      <div className="g-mb-2 g-flex g-flex-none g-items-center">
        <div className="g-flex-auto">
          {' '}
          {!loading && data?.literatureSearch?.documents && (
            <a
              href={`${import.meta.env.PUBLIC_BASE_URL}/literature/search?${searchParams}`}
              target="_blank"
            >
              <Tag className="g-bg-primary-500 g-border g-border-solid g-border-primary-600 g-text-white g-text-xs g-px-2 g-py-1">
                <FormattedMessage
                  id="counts.nCitations"
                  defaultMessage="{count} citations"
                  values={{
                    count: <FormattedNumber value={data?.literatureSearch?.documents.total} />,
                  }}
                />
              </Tag>
            </a>
          )}
        </div>
        <div className="g-flex-none">
          <a
            href={`${import.meta.env.PUBLIC_BASE_URL}/literature/search?${searchParams.toString()}`}
            target="_blank"
          >
            <GbifLogoIcon /> Powered by GBIF
          </a>
        </div>
      </div>

      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <SearchTable
          noHeader={true}
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
