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
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { useEntityDrawer } from '../browseList/useEntityDrawer';
import { useOrderedList } from '../browseList/useOrderedList';
import { useOccurrenceColumns } from './columns';

const OCCURRENCE_SEARCH_QUERY = /* GraphQL */ `
  query OccurrenceSearch($from: Int, $size: Int, $predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          key
          taxonKey
          hasTaxonIssues
          gbifClassification {
            verbatimScientificName
            usage {
              rank
              formattedName(useFallback: true)
              key
            }
          }
          eventDate
          year
          coordinates
          formattedCoordinates
          country
          countryCode
          basisOfRecord
          datasetTitle
          datasetKey
          publishingOrgKey
          publisherTitle
          catalogNumber
          recordedBy
          identifiedBy
          recordNumber
          typeStatus
          preparations
          institutionCode
          institution {
            code
            name
            key
          }
          collectionCode
          collection {
            code
            name
            key
          }
          locality
          higherGeography
          stateProvince
          establishmentMeans
          iucnRedListCategory
          datasetName
          stillImageCount
          movingImageCount
          soundCount
          issues
          volatile {
            features {
              isSequenced
              isTreament
              isClustered
              isSamplingEvent
            }
          }
        }
      }
    }
  }
`;

export type SingleOccurrenceSearchResult = ExtractPaginatedResult<
  OccurrenceSearchQuery['occurrenceSearch']
>;

const keySelector = (item: SingleOccurrenceSearchResult) => item.key?.toString() ?? '';

const rowLinkOptionsDirect: RowLinkOptions<SingleOccurrenceSearchResult> = {
  pageId: 'occurrenceKey',
};

const rowLinkOptionsDrawer: RowLinkOptions<SingleOccurrenceSearchResult> = {
  createDrawerKey: ({ key }) => `o_${key}`,
};

const fallbackOptions: FallbackTableOptions = {
  prefixColumns: ['scientificName'],
  defaultEnabledTableColumns: [
    'features',
    'country',
    'coordinates',
    'year',
    'basisOfRecord',
    'dataset',
    'publisher',
  ],
};

export function OccurrenceTable() {
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, load, loading } = useQuery<OccurrenceSearchQuery, OccurrenceSearchQueryVariables>(
    OCCURRENCE_SEARCH_QUERY,
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

  const [, showPreview] = useEntityDrawer();
  const columns = useOccurrenceColumns({
    showPreview,
  });

  const occurrences = useMemo(
    () => data?.occurrenceSearch?.documents.results.filter(notNull) ?? [],
    [data]
  );

  const { setOrderedList } = useOrderedList();

  // update ordered list on items change
  useEffect(() => {
    setOrderedList(occurrences.map((item) => `o_${item.key}`));
  }, [occurrences, setOrderedList]);

  const { availableTableColumns, defaultEnabledTableColumns } =
    useAvailableAndDefaultEnabledColumns({
      searchMetadata: searchContext,
      columns,
      fallbackOptions,
    });

  const { openDrawerOnTableRowClick } = useConfig();
  const rowLinkOptions = openDrawerOnTableRowClick ? rowLinkOptionsDrawer : rowLinkOptionsDirect;

  const createRowLink = useRowLink({ rowLinkOptions, keySelector });

  return (
    <div className="g-flex g-flex-col g-h-full">
      <ViewHeader
        total={data?.occurrenceSearch?.documents.total}
        loading={loading}
        message="counts.nResults"
      />

      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <SearchTable
          filters={filters}
          createRowLink={createRowLink}
          keySelector={keySelector}
          lockColumnLocalStoreKey="occurrenceSearchTableLockColumn"
          selectedColumnsLocalStoreKey="occurrenceSearchSelectedColumns"
          columns={columns}
          data={occurrences}
          loading={loading}
          rowCount={data?.occurrenceSearch?.documents.total}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          availableTableColumns={availableTableColumns}
          defaultEnabledTableColumns={defaultEnabledTableColumns}
        />
      </ClientSideOnly>
    </div>
  );
}
