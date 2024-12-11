import { TaxonSearchQuery, TaxonSearchQueryVariables } from '@/gql/graphql';
import { usePaginationState } from '@/components/searchTable/usePaginationState';
import useQuery from '@/hooks/useQuery';
import { useContext, useEffect, useMemo } from 'react';
import { getAsQuery } from '@/components/filters/filterTools';
import { useTaxonColumns } from './columns';
import { notNull } from '@/utils/notNull';
import { FilterContext } from '@/contexts/filter';
import { useStringParam } from '@/hooks/useParam';
import { searchConfig } from '../../searchConfig';
import SearchTable from '@/components/searchTable/table';
import { useConfig } from '@/config/config';
import { useSearchContext } from '@/contexts/search';
import { useFilters } from '../../filters';
import { Row } from '@tanstack/react-table';
import { ViewHeader } from '@/components/ViewHeader';
import { useOrderedList } from '@/routes/occurrence/search/views/browseList/useOrderedList';

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
        formattedName
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

const createRowLink = (row: Row<SingleTaxonSearchResult>) => `/species/${row.original.key}`;

const DEFAULT_ENABLED_TABLE_COLUMNS = Object.freeze(['scientificName', 'taxonomicStatus', 'rank', 'taxonomy']);

export function Table() {
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);
  const config = useConfig();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const [, setPreviewKey] = useStringParam({ key: 'entity' });

  // Go back to the first page when the filters change
  useEffect(() => {
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filterHash]);

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

  const columns = useTaxonColumns({ showPreview: setPreviewKey, filters });

  const taxons = useMemo(() => data?.taxonSearch?.results.filter(notNull) ?? [], [data]);

  const { setOrderedList } = useOrderedList();

  // update ordered list on items change
  useEffect(() => {
    setOrderedList(taxons.map((item) => `t_${item.key}`));
  }, [taxons, setOrderedList]);

  // TODO: Should the logic be located in the config?
  const availableTableColumns = useMemo(
    () => [
      'scientificName',
      ...(config?.taxonSearch?.availableTableColumns ?? DEFAULT_ENABLED_TABLE_COLUMNS),
    ],
    [config]
  );

  const defaultEnabledTableColumns = useMemo(
    () => [
      'scientificName',
      ...(config?.taxonSearch?.defaultEnabledTableColumns ?? DEFAULT_ENABLED_TABLE_COLUMNS),
    ],
    [config]
  );

  return (
    <div className="g-flex g-flex-col g-h-full">
      <ViewHeader total={data?.taxonSearch?.count} loading={loading} message="counts.nResults" />
      <SearchTable
        createRowLink={createRowLink}
        lockColumnLocalStoreKey="taxonSearchTableLockColumn"
        columns={columns}
        data={taxons}
        loading={loading}
        rowCount={data?.taxonSearch?.count}
        pagination={paginationState}
        setPaginationState={setPaginationState}
        availableTableColumns={availableTableColumns}
        defaultEnabledTableColumns={defaultEnabledTableColumns}
      />
    </div>
  );
}
