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
import { TaxonSearchMetadata, useSearchContext } from '@/contexts/search';
import { TaxonSearchQuery, TaxonSearchQueryVariables, TaxonSearchSortBy } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useEntityDrawer } from '@/routes/occurrence/search/views/browseList/useEntityDrawer';
import { useOrderedList } from '@/routes/occurrence/search/views/browseList/useOrderedList';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { useTaxonColumns } from './columns';
import { LinkData, useLink } from '@/reactRouterPlugins/dynamicLink';

const TAXON_SEARCH_QUERY = /* GraphQL */ `
  query TaxonSearch(
    $offset: Int
    $limit: Int
    $query: TaxonSearchInput
    $sortBy: TaxonSearchSortBy
    $reverse: Boolean
  ) {
    taxonSearch(query: $query, offset: $offset, limit: $limit, sortBy: $sortBy, reverse: $reverse) {
      count
      offset
      endOfRecords
      results {
        taxonID
        fallbackID
        scientificName
        label
        taxonomicStatus
        taxonRank
        datasetKey
        dataset {
          title
        }
        acceptedNameUsageID
        classification {
          scientificName
          taxonRank
        }
        vernacularName(language: "eng") {
          vernacularName
        }
      }
    }
  }
`;

type ExtractPaginatedResult<T extends { results: any[] } | null | undefined> = NonNullable<
  NonNullable<T>['results'][number]
>;

export type SingleTaxonSearchResult = ExtractPaginatedResult<TaxonSearchQuery['taxonSearch']>;

const keySelector = (item: SingleTaxonSearchResult) => item.taxonID?.toString() ?? item.fallbackID;

const fallbackOptions: FallbackTableOptions = {
  prefixColumns: ['scientificName'],
  defaultEnabledTableColumns: ['taxonomicStatus', 'rank', 'taxonomy'],
};

export function Table({ entityDrawerPrefix }: { entityDrawerPrefix: string }) {
  const searchContext: TaxonSearchMetadata = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);
  const createLink = useLink();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const [, setPreviewKey] = useEntityDrawer();

  const { data, load, loading } = useQuery<TaxonSearchQuery, TaxonSearchQueryVariables>(
    TAXON_SEARCH_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
      keepDataWhileLoading: true,
    }
  );

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    const hasFreeTextSearch = filter.must?.q && filter.must?.q.length > 0;

    load({
      variables: {
        query: {
          ...query,
          datasetKey: searchContext.checklistKey ?? import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY,
          limit: paginationState.pageSize,
          offset: paginationState.pageIndex * paginationState.pageSize,
          sortBy: hasFreeTextSearch ? TaxonSearchSortBy.Relevance : TaxonSearchSortBy.Taxonomic,
          searchContent: ['SCIENTIFIC', 'AUTHORSHIP', 'VERNACULAR'],
        },
      },
    });

    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, filterHash, searchContext, paginationState.pageIndex, paginationState.pageSize]);

  const { filters } = useFilters({ searchConfig });

  const columns = useTaxonColumns({
    showPreview: (key) => setPreviewKey(`${entityDrawerPrefix}_${key}`),
  });

  const taxons = useMemo(() => data?.taxonSearch?.results.filter(notNull) ?? [], [data]);

  const { setOrderedList } = useOrderedList();

  // update ordered list on items change
  useEffect(() => {
    setOrderedList(taxons.map((item) => `${entityDrawerPrefix || 't'}_${item.taxonID}`));
  }, [taxons, setOrderedList, entityDrawerPrefix]);

  const { availableTableColumns, defaultEnabledTableColumns } =
    useAvailableAndDefaultEnabledColumns({
      searchMetadata: searchContext,
      columns,
      fallbackOptions,
    });

  const createTaxonRowLink = (item: SingleTaxonSearchResult): LinkData | null => {
    if (!item.taxonID) return null;
    return createLink({
      pageId: 'taxonKey',
      variables: { key: item.taxonID ?? '', datasetKey: item.datasetKey ?? '' },
    });
  };

  return (
    <div className="g-flex g-flex-col g-h-full">
      <ViewHeader total={data?.taxonSearch?.count} loading={loading} message="counts.nResults" />
      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <SearchTable
          filters={filters}
          createRowLink={createTaxonRowLink}
          keySelector={keySelector}
          lockColumnLocalStoreKey="taxonSearchTableLockColumn"
          selectedColumnsLocalStoreKey="taxonSearchTableSelectedColumns"
          columns={columns}
          data={taxons}
          loading={loading}
          rowCount={data?.taxonSearch?.count}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          availableTableColumns={availableTableColumns}
          defaultEnabledTableColumns={defaultEnabledTableColumns}
        />
      </ClientSideOnly>
    </div>
  );
}
