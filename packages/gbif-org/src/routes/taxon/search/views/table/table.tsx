import { ClientSideOnly } from '@/components/clientSideOnly';
import { getAsQuery } from '@/components/filters/filterTools';
import {
  FallbackTableOptions,
  RowLinkOptions,
  SearchTable,
  useAvailableAndDefaultEnabledColumns,
  usePaginationState,
  useRowLink,
} from '@/components/searchTable';
import { SearchTableServerFallback } from '@/components/searchTable/table';
import { ViewHeader } from '@/components/ViewHeader';
import { useConfig } from '@/config/config';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { TaxonSearchQuery, TaxonSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useEntityDrawer } from '@/routes/occurrence/search/views/browseList/useEntityDrawer';
import { useOrderedList } from '@/routes/occurrence/search/views/browseList/useOrderedList';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { useTaxonColumns } from './columns';

const TAXON_SEARCH_QUERY = /* GraphQL */ `
  query TaxonSearch($offset: Int, $limit: Int, $query: TaxonSearchInput) {
    taxonSearch(query: $query, offset: $offset, limit: $limit) {
      count
      offset
      endOfRecords
      results {
        key
        nubKey
        scientificName
        formattedName(useFallback: true)
        kingdom
        phylum
        class
        order
        family
        genus
        species
        taxonomicStatus
        rank
        datasetKey
        dataset {
          title
        }
        accepted
        acceptedKey
        numDescendants
        vernacularNames(limit: 2, language: "eng") {
          results {
            vernacularName
            source
            sourceTaxonKey
          }
        }
      }
    }
  }
`;

type ExtractPaginatedResult<T extends { results: any[] } | null | undefined> = NonNullable<
  NonNullable<T>['results'][number]
>;

export type SingleTaxonSearchResult = ExtractPaginatedResult<TaxonSearchQuery['taxonSearch']>;

const keySelector = (item: SingleTaxonSearchResult) => item.key?.toString() ?? '';

const KeySelectorDatasetTaxon = (item: SingleTaxonSearchResult) =>
  `${item.datasetKey}/species/${item.key}`;

const rowLinkOptionsDirect: RowLinkOptions<SingleTaxonSearchResult> = {
  pageId: 'speciesKey',
};

const rowLinkOptionsDatasetKeyTaxonDirect: RowLinkOptions<SingleTaxonSearchResult> = {
  pageId: 'datasetKey',
};

const rowLinkOptionsDrawer: RowLinkOptions<SingleTaxonSearchResult> = {
  createDrawerKey: ({ key }) => `t_${key}`,
};

const rowLinkOptionsDatasetKeyTaxonDrawer: RowLinkOptions<SingleTaxonSearchResult> = {
  createDrawerKey: ({ key }) => `tx_${key}`,
};

const fallbackOptions: FallbackTableOptions = {
  prefixColumns: ['scientificName'],
  defaultEnabledTableColumns: ['taxonomicStatus', 'rank', 'taxonomy'],
};

export function Table({ entityDrawerPrefix }: { entityDrawerPrefix: string }) {
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);
  const config = useConfig();

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
    load({
      variables: {
        query: {
          ...query,
          limit: paginationState.pageSize,
          offset: paginationState.pageIndex * paginationState.pageSize,
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
    setOrderedList(taxons.map((item) => `${entityDrawerPrefix || 't'}_${item.key}`));
  }, [taxons, setOrderedList, entityDrawerPrefix]);

  const { availableTableColumns, defaultEnabledTableColumns } =
    useAvailableAndDefaultEnabledColumns({
      searchMetadata: searchContext,
      columns,
      fallbackOptions,
    });

  let rowLinkOptions;

  if (entityDrawerPrefix === 'tx') {
    rowLinkOptions = config.openDrawerOnTableRowClick
      ? rowLinkOptionsDatasetKeyTaxonDrawer
      : rowLinkOptionsDatasetKeyTaxonDirect;
  } else {
    rowLinkOptions = config.openDrawerOnTableRowClick ? rowLinkOptionsDrawer : rowLinkOptionsDirect;
  }
  // the tx prefix is used for taxon search in a non-backbone dataset
  const createRowLink = useRowLink({
    rowLinkOptions,
    keySelector: entityDrawerPrefix === 'tx' ? KeySelectorDatasetTaxon : keySelector,
  });

  return (
    <div className="g-flex g-flex-col g-h-full">
      <ViewHeader total={data?.taxonSearch?.count} loading={loading} message="counts.nResults" />
      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <SearchTable
          filters={filters}
          createRowLink={createRowLink}
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
