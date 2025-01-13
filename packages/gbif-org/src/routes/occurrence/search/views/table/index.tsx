import { getAsQuery } from '@/components/filters/filterTools';
import SearchTable from '@/components/searchTable/table';
import { usePaginationState } from '@/components/searchTable/usePaginationState';
import { ViewHeader } from '@/components/ViewHeader';
import { useConfig } from '@/config/config';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { Row } from '@tanstack/react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { useOrderedList } from '../browseList/useOrderedList';
import { useOccurrenceColumns } from './columns';
import { DynamicLinkProps } from '@/reactRouterPlugins/dynamicLink';
import { Link } from 'react-router-dom';

// TODO: Should maybe be moved to the configBuilder
const DAFAULT_AVAILABLE_TABLE_COLUMNS = Object.freeze([
  'scientificName',
  'features',
  'country',
  'coordinates',
  'year',
  'eventDate',
  'basisOfRecord',
  'dataset',
  'publisher',
  'catalogNumber',
  'recordedBy',
  'identifiedBy',
  'recordNumber',
  'typeStatus',
  'preparations',
  'collectionCode',
  'institutionCode',
  'institutionKey',
  'collectionKey',
  'locality',
  'higherGeography',
  'stateProvince',
  'establishmentMeans',
  'iucnRedListCategory',
  'datasetName',
]);

const DEFAULT_ENABLED_TABLE_COLUMNS = Object.freeze([...DAFAULT_AVAILABLE_TABLE_COLUMNS]);

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
              formattedName
              key
            }
          }
          eventDate
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
          collectionCode
          institution {
            code
            name
            key
          }
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

const createRowLinkDirect = (
  row: Row<SingleOccurrenceSearchResult>
): DynamicLinkProps<typeof Link> => ({
  pageId: 'occurrenceKey',
  variables: { key: row.original.key },
});

const createRowLinkDrawer = (
  row: Row<SingleOccurrenceSearchResult>
): DynamicLinkProps<typeof Link> => ({
  pageId: 'occurrenceSearch',
  searchParams: { entity: row.original.key },
});

export function OccurrenceTable() {
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);
  const config = useConfig();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const [, setPreviewKey] = useStringParam({ key: 'entity' });

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

  const columns = useOccurrenceColumns({
    showPreview: setPreviewKey,
    filters,
    disableCellFilters: config.disableInlineTableFilterButtons,
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

  // TODO: Should the logic be located in the config?
  const availableTableColumns = useMemo(
    () => [
      'scientificName',
      ...(config?.occurrenceSearch?.availableTableColumns ?? DAFAULT_AVAILABLE_TABLE_COLUMNS),
    ],
    [config]
  );

  const defaultEnabledTableColumns = useMemo(
    () => [
      'scientificName',
      ...(config?.occurrenceSearch?.defaultEnabledTableColumns ?? DEFAULT_ENABLED_TABLE_COLUMNS),
    ],
    [config]
  );

  const createRowLink = config.openDrawerOnTableRowClick
    ? createRowLinkDrawer
    : createRowLinkDirect;

  return (
    <div className="g-flex g-flex-col g-h-full">
      <ViewHeader
        total={data?.occurrenceSearch?.documents.total}
        loading={loading}
        message="counts.nResults"
      />
      <SearchTable
        createRowLink={createRowLink}
        lockColumnLocalStoreKey="occurrenceSearchTableLockColumn"
        selectedColumnsLocalStoreKey="occurrenceSearchSelectedColumns"
        columns={columns}
        data={occurrences}
        loading={loading}
        rowCount={data?.occurrenceSearch?.documents.total}
        pagination={paginationState}
        setPaginationState={setPaginationState}
        availableTableColumns={availableTableColumns}
        defaultEnabledTableColumns={defaultEnabledTableColumns}
      />
    </div>
  );
}
