import { ClientSideOnly } from '@/components/clientSideOnly';
import { getAsQuery } from '@/components/filters/filterTools';
import {
  FallbackTableOptions,
  RowLinkOptions,
  useAvailableAndDefaultEnabledColumns,
  usePaginationState,
} from '@/components/searchTable';
import { SearchTable } from '@/components/searchTable/index';
import { SearchTableServerFallback } from '@/components/searchTable/table';
import { useToast } from '@/components/ui/use-toast';
import { ViewHeader } from '@/components/ViewHeader';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { EventSearchQuery, EventSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useEntityDrawer } from '@/routes/occurrence/search/views/browseList/useEntityDrawer';
import { useOrderedList } from '@/routes/occurrence/search/views/browseList/useOrderedList';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import { useContext, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFilters } from '../../filters';
import { searchConfig } from '../../searchConfig';
import { useEventColumns } from './columns';
import { useParams } from 'react-router-dom';
import { LinkData } from '@/reactRouterPlugins/dynamicLink';

const EVENT_SEARCH_QUERY = /* GraphQL */ `
  query EventSearch($offset: Int, $limit: Int, $query: EventSearchInput, $q: String) {
    eventSearch(q: $q, query: $query, offset: $offset, limit: $limit) {
      limit
      offset
      count
      results {
        eventDate {
          from
          to
        }
        year
        month
        eventID
        locationID
        measurementOrFactTypes
        measurementOrFactMethods
        coordinates
        eventHierarchyJoined
        formattedCoordinates
        country
        countryCode
        datasetTitle
        datasetKey
        samplingProtocol
        eventTypeHierarchy
        eventTypeHierarchyJoined
        stateProvince
        locality
      }
    }
  }
`;

export type SingleEventSearchResult = ExtractPaginatedResult<EventSearchQuery['eventSearch']>;

const keySelector = (item: SingleEventSearchResult) => item?.eventID?.toString() ?? '';

const fallbackOptions: FallbackTableOptions = {
  prefixColumns: ['eventId'],
  defaultEnabledTableColumns: [
    'eventId',
    'country',
    'coordinates',
    'year',
    'eventDate',
    'locality',
    'locationId',
  ],
};

export function EventTable() {
  return (
    <div className="g-flex g-flex-col g-h-full">
      <ClientSideOnly fallback={<SearchTableServerFallback />}>
        <EventTableClient />
      </ClientSideOnly>
    </div>
  );
}

export function EventTableClient() {
  const searchContext = useSearchContext();
  const { key: datasetKey } = useParams<{ key: string }>();

  const [paginationState, setPaginationState] = usePaginationState({ pageSize: 50 });
  const filterContext = useContext(FilterContext);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, load, loading, error } = useQuery<EventSearchQuery, EventSearchQueryVariables>(
    EVENT_SEARCH_QUERY,
    {
      lazyLoad: true,
      keepDataWhileLoading: true,
    }
  );

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        query,
        limit: paginationState.pageSize,
        offset: paginationState.pageIndex * paginationState.pageSize,
      },
    });

    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, filterHash, searchContext, paginationState.pageIndex, paginationState.pageSize]);

  const { filters } = useFilters({ searchConfig });

  const [, setPreviewKey] = useEntityDrawer();

  const columns = useEventColumns({
    showPreview: (key) => setPreviewKey(`e_${datasetKey}___${key}`),
  });
  if (typeof window !== 'undefined') {
    window.gbif = window.gbif || {};
    window.gbif.availableColumnOptions = columns.map((column) => column.id);
  }

  const events = useMemo(() => data?.eventSearch?.results.filter(notNull) ?? [], [data]);

  const { setOrderedList } = useOrderedList();

  // update ordered list on items change
  useEffect(() => {
    setOrderedList(events.map((item) => `e_${item.datasetKey}_${item.eventID}`));
  }, [events, setOrderedList]);

  const { availableTableColumns, defaultEnabledTableColumns } =
    useAvailableAndDefaultEnabledColumns({
      searchMetadata: searchContext,
      columns,
      fallbackOptions,
    });

  const createRowLink = (item: SingleEventSearchResult) => {
    return {
      type: 'link',
      to: `/dataset/${datasetKey}/event/${keySelector(item)}`,
    } as LinkData;
  }; //useRowLink({ rowLinkOptions, keySelector });

  if (!data?.eventSearch?.results && error) {
    throw error;
  }

  return (
    <>
      {/* {!loading && error && <PartialDataWarning />} */}
      <ViewHeader total={data?.eventSearch?.count} loading={loading} message="counts.nResults" />
      <SearchTable
        filters={filters}
        createRowLink={createRowLink}
        keySelector={keySelector}
        lockColumnLocalStoreKey="eventSearchTableLockColumn"
        selectedColumnsLocalStoreKey="eventSearchSelectedColumns"
        columns={columns}
        data={events}
        loading={loading}
        rowCount={data?.eventSearch?.count}
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
