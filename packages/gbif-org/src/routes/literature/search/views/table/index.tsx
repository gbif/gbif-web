import { DownloadAsTSVLink } from '@/components/cardHeaderActions/downloadAsTSVLink';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { getAsQuery } from '@/components/filters/filterTools';
import {
  FallbackTableOptions,
  SearchTable,
  useAvailableAndDefaultEnabledColumns,
  usePaginationState,
} from '@/components/searchTable';
import { SearchTableServerFallback } from '@/components/searchTable/table';
import { ViewHeader } from '@/components/ViewHeader';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import { LiteratureTableSearchQuery, LiteratureTableSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { usePartialDataNotification } from '@/routes/rootErrorPage';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { stringify } from '@/utils/querystring';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { columns } from './columns';

const fallbackOptions: FallbackTableOptions = {
  prefixColumns: ['title'],
  defaultEnabledTableColumns: ['author', 'year', 'source', 'dataReferenced'],
};

const LITERATURE_TABLE_SEARCH = /* GraphQL */ `
  query LiteratureTableSearch($from: Int, $size: Int, $predicate: Predicate, $q: String) {
    literatureSearch(predicate: $predicate, q: $q) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          id
          title
          authors {
            firstName
            lastName
          }
          countriesOfCoverage
          countriesOfResearcher
          year
          identifiers {
            doi
          }
          gbifDOIs
          literatureType
          relevance
          source
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
  const notifyOfPartialData = usePartialDataNotification();
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);
  const [tsvUrl, setTsvUrl] = useState('');
  const [tsvLinkVisible, setTsvLinkVisible] = useState(false);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, load, error, loading } = useQuery<
    LiteratureTableSearchQuery,
    LiteratureTableSearchQueryVariables
  >(LITERATURE_TABLE_SEARCH, {
    throwAllErrors: true,
    lazyLoad: true,
    keepDataWhileLoading: true,
  });

  useEffect(() => {
    if (error && !data?.literatureSearch?.documents) {
      throw error;
    } else if (error) {
      notifyOfPartialData();
    }
  }, [data, error, notifyOfPartialData]);

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    const { filter: v1Filter, errors } = filter2v1(filter, searchConfig);
    if (errors || searchContext.scope) {
      setTsvLinkVisible(false);
      console.warn('Unable to serialize TSV download link');
    } else {
      setTsvLinkVisible(true);
    }

    const downloadUrl = `${import.meta.env.PUBLIC_API_V1}/grscicoll/institution/export?${stringify({
      ...v1Filter,
      format: 'TSV',
    })}`;
    setTsvUrl(downloadUrl);

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
      <div className="g-flex g-gap-2 g-items-center g-justify-between">
        <ViewHeader
          total={data?.literatureSearch?.documents.total}
          loading={loading}
          message="counts.nResults"
        />
        {tsvLinkVisible && (
          <div className="g-text-slate-500 ">
            <DownloadAsTSVLink tsvUrl={tsvUrl} className="g-text-xs" />
          </div>
        )}
      </div>
      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <SearchTable
          // hideColumnVisibilityDropdown
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
