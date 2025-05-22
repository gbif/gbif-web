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
import { useToast } from '@/components/ui/use-toast';
import { ViewHeader } from '@/components/ViewHeader';
import { useConfig } from '@/config/config';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import {
  OccurrenceSearchQuery,
  OccurrenceSearchQueryVariables,
  OccurrenceSortBy,
  SortOrder,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useI18n } from '@/reactRouterPlugins';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import useLocalStorage from 'use-local-storage';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { useEntityDrawer } from '../browseList/useEntityDrawer';
import { useOrderedList } from '../browseList/useOrderedList';
import { useOccurrenceColumns } from './columns';

const OCCURRENCE_SEARCH_QUERY = /* GraphQL */ `
  query OccurrenceSearch(
    $from: Int
    $size: Int
    $predicate: Predicate
    $language: String
    $sortBy: OccurrenceSortBy
    $sortOrder: SortOrder
  ) {
    occurrenceSearch(predicate: $predicate) {
      documents(from: $from, size: $size, sortBy: $sortBy, sortOrder: $sortOrder) {
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
          taxon {
            canonicalName
          }
          primaryImage {
            thumbor(width: 80)
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
          fieldNumber
          sex
          lifeStage
          recordNumber
          typeStatus
          preparations
          institutionCode
          institutionKey
          institution {
            code
            name
          }
          collectionCode
          collectionKey
          collection {
            code
            name
          }
          locality
          higherGeography
          stateProvince
          establishmentMeans
          iucnRedListCategory
          stillImageCount
          movingImageCount
          soundCount
          issues(types: ["WARNING", "ERROR"])
          volatile {
            features {
              isSequenced
              isTreament
              isClustered
              isSamplingEvent
            }
            vernacularNames(language: $language, limit: 1) {
              results {
                vernacularName
                source
              }
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

function getNotEmptyString(str: string | null | undefined): string | undefined {
  return str && str.length > 0 && typeof str === 'string' ? str : undefined;
}

export function OccurrenceTable() {
  return (
    <div className="g-flex g-flex-col g-h-full">
      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <OccurrenceTableClient />
      </ClientSideOnly>
    </div>
  );
}

export function OccurrenceTableClient() {
  const [occurrenceSort] = useLocalStorage<{ sortBy?: OccurrenceSortBy; sortOrder: SortOrder }>(
    'occurrenceSort',
    { sortBy: undefined, sortOrder: SortOrder.Asc }
  );
  const { sortBy: occurrenceSortBy, sortOrder: occurrenceSortOrder } = occurrenceSort;
  const { locale } = useI18n();
  const searchContext = useSearchContext();
  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, load, loading, error } = useQuery<
    OccurrenceSearchQuery,
    OccurrenceSearchQueryVariables
  >(OCCURRENCE_SEARCH_QUERY, {
    lazyLoad: true,
    keepDataWhileLoading: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        language: locale.iso3LetterCode,
        predicate: {
          ...query,
        },
        size: paginationState.pageSize,
        from: paginationState.pageIndex * paginationState.pageSize,
        sortBy: getNotEmptyString(occurrenceSortBy) as OccurrenceSortBy | undefined,
        sortOrder: getNotEmptyString(occurrenceSortOrder) as SortOrder | undefined,
      },
    });

    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    load,
    filterHash,
    searchContext,
    paginationState.pageIndex,
    paginationState.pageSize,
    occurrenceSort,
  ]);

  const { filters } = useFilters({ searchConfig });

  const [, showPreview] = useEntityDrawer();
  const columns = useOccurrenceColumns({
    showPreview,
  });
  if (typeof window !== 'undefined') {
    window.gbif = window.gbif || {};
    window.gbif.availableColumnOptions = columns.map((column) => column.id);
  }

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

  if (!data?.occurrenceSearch?.documents && error) {
    throw error;
  }

  return (
    <>
      {/* {!loading && error && <PartialDataWarning />} */}
      <ViewHeader
        total={data?.occurrenceSearch?.documents.total}
        loading={loading}
        message="counts.nResults"
      />
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
    </>
  );
}

function PartialDataWarning({
  customMessageKey,
  customDescriptionKey,
}: {
  customMessageKey?: string;
  customDescriptionKey?: string;
}) {
  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: <FormattedMessage id={customMessageKey ?? 'Not all data could be loaded'} />,
      description: customDescriptionKey ? (
        <FormattedMessage id={customDescriptionKey} />
      ) : undefined,
      variant: 'destructive',
    });
  }, [customMessageKey, customDescriptionKey, toast]);
  return null;
}
