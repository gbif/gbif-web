import { ExtractPaginatedResult } from '@/types';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import { usePaginationState } from '@/components/searchTable/usePaginationState';
import useQuery from '@/hooks/useQuery';
import { useContext, useEffect, useMemo } from 'react';
import { getAsQuery } from '@/components/filters/filterTools';
import { useOccurrenceColumns } from './columns';
import { notNull } from '@/utils/notNull';
import { useOrderedList } from '../browseList/useOrderedList';
import { FilterContext } from '@/contexts/filter';
import { useStringParam } from '@/hooks/useParam';
import { searchConfig } from '../../searchConfig';
import SearchTable from '@/components/searchTable/table';
import { useConfig } from '@/config/config';
import { useSearchContext } from '@/contexts/search';
import { useFilters } from '../../filters';
import { Row } from '@tanstack/react-table';
import { ViewHeader } from '@/components/ViewHeader';

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

const createRowLink = (row: Row<SingleOccurrenceSearchResult>) => `/occurrence/${row.original.key}`;

export function OccurrenceTable() {
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

  const columns = useOccurrenceColumns({ showPreview: setPreviewKey, filters });

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
