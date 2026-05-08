import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getAsQuery } from '@/components/filters/filterTools';
import { useToast } from '@/components/ui/use-toast';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import {
  OccurrenceMediaSearchQuery,
  OccurrenceMediaSearchQueryVariables,
  OccurrenceSortBy,
  Predicate,
  PredicateType,
  SortOrder,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useCallback, useContext, useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import { searchConfig } from '../../searchConfig';
import { useEntityDrawer } from '../browseList/useEntityDrawer';
import { useOrderedList } from '../browseList/useOrderedList';
import { MediaGrouped } from './mediaGrouped';
import { MediaPresentation } from './mediaPresentation';
import { DEFAULT_MEDIA_GROUP_STATE, MediaGroupState } from './mediaSort';

// Fixed seed for the "Random" mode. Keeping this constant means pagination is
// stable and revisits show the same shuffle order.
const SHUFFLE_SEED = 12345;

const OCCURRENCE_MEDIA = /* GraphQL */ `
  query occurrenceMediaSearch(
    $q: String
    $predicate: Predicate
    $size: Int
    $from: Int
    $shuffle: Int
    $sortBy: OccurrenceSortBy
    $sortOrder: SortOrder
    $checklistKey: ID
  ) {
    occurrenceSearch(q: $q, predicate: $predicate) {
      documents(
        size: $size
        from: $from
        shuffle: $shuffle
        sortBy: $sortBy
        sortOrder: $sortOrder
      ) {
        total
        size
        from
        results {
          key
          countryCode
          locality
          basisOfRecord
          typeStatus
          eventDate
          verbatimScientificName
          classification(checklistKey: $checklistKey) {
            usage {
              name
              key
            }
            taxonMatch {
              usage {
                canonicalName
              }
            }
          }
          recordedBy
          datasetKey
          datasetTitle
          primaryImage {
            identifier: thumbor(height: 400)
          }
          formattedCoordinates
          volatile {
            features {
              isSpecimen
            }
          }
        }
      }
    }
  }
`;

export function Media({ size: defaultSize = 50 }) {
  const [from, setFrom] = useState(0);
  const searchContext = useSearchContext();
  const size = defaultSize;
  const { toast } = useToast();
  const currentFilterContext = useContext(FilterContext);
  const [mediaTypes] = useState(['StillImage']);
  const { scope } = useSearchContext();
  const [groupState, setGroupState] = useLocalStorage<MediaGroupState>(
    'occurrenceMediaGroup',
    DEFAULT_MEDIA_GROUP_STATE
  );
  const { data, error, loading, load } = useQuery<
    OccurrenceMediaSearchQuery,
    OccurrenceMediaSearchQueryVariables
  >(OCCURRENCE_MEDIA, {
    lazyLoad: true,
    throwAllErrors: false,
  });
  const { setOrderedList } = useOrderedList();
  const [, setPreviewKey] = useEntityDrawer();

  const [allData, setAllData] = useState([]);

  const isGrouped = groupState.mode === 'group' && !!groupState.groupBy;

  const updateList = useCallback(() => {
    setOrderedList(allData.map((item) => `o_${item.key}`));
  }, [allData, setOrderedList]);

  const selectPreview = useCallback(
    (key: string | number) => {
      updateList();
      setPreviewKey(`o_${key}`);
    },
    [setPreviewKey, updateList]
  );

  useEffect(() => {
    if (isGrouped) return;
    setAllData((prev) => {
      const all = [...prev, ...(data?.occurrenceSearch?.documents?.results || [])];
      // get unique by key
      const unique = all.reduce((acc, cur) => {
        if (acc.find((x) => x.key === cur.key)) {
          return acc;
        }
        return [...acc, cur];
      }, []);
      return unique;
    });
  }, [data, error, toast, isGrouped]);

  useEffect(() => {
    if (error && !isGrouped) {
      if (data?.occurrenceSearch?.documents.results) {
        // ignore errors for now - I do not see how they can be critical enough to warn the user given the query we have. At worst the name will show without formatting.
      } else {
        throw error;
      }
    }
  }, [error, allData, toast, isGrouped, data]);

  useEffect(() => {
    const query = getAsQuery({ filter: currentFilterContext.filter, searchContext, searchConfig });
    const predicate: Predicate = {
      type: PredicateType.And,
      predicates: [
        query.predicate,
        {
          type: 'in',
          key: 'mediaType',
          values: ['StillImage'],
        },
      ].filter((x) => x),
    };
    const isRandom = groupState.mode === 'random';
    const yearSort =
      groupState.mode === 'yearDesc'
        ? { sortBy: OccurrenceSortBy.Year, sortOrder: SortOrder.Desc }
        : groupState.mode === 'yearAsc'
          ? { sortBy: OccurrenceSortBy.Year, sortOrder: SortOrder.Asc }
          : undefined;
    // When grouped, the grouped view fetches its own images. We still run this query
    // with size:0 so the top-of-page count keeps showing the total records with images.
    load({
      keepDataWhileLoading: true,
      variables: {
        predicate,
        q: query.q,
        size: isGrouped ? 0 : size,
        from: isGrouped ? 0 : from,
        shuffle: isRandom ? SHUFFLE_SEED : undefined,
        sortBy: yearSort?.sortBy,
        sortOrder: yearSort?.sortOrder,
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, currentFilterContext.filterHash, scope, load, size, groupState.mode, isGrouped]);

  // Reset pagination + accumulated data when filters or grouping change.
  useEffect(() => {
    setFrom(0);
    setAllData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, scope, groupState.mode, groupState.groupBy]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  }, [from, size]);

  const onGroupStateChange = useCallback(
    (next: MediaGroupState) => {
      setGroupState(next);
    },
    [setGroupState]
  );

  return (
    <ErrorBoundary>
      <MediaPresentation
        mediaTypes={mediaTypes}
        results={isGrouped ? [] : allData}
        loading={loading}
        error={isGrouped ? undefined : error}
        endOfRecords={from + size >= data?.occurrenceSearch?.documents?.total}
        next={next}
        total={data?.occurrenceSearch?.documents?.total}
        onSelect={({ key }: { key: string | number }) => selectPreview(key)}
        groupState={groupState}
        onGroupStateChange={onGroupStateChange}
      >
        {isGrouped && groupState.groupBy && (
          <MediaGrouped
            groupBy={groupState.groupBy}
            onGroupByChange={(groupBy) => onGroupStateChange({ mode: 'group', groupBy })}
          />
        )}
      </MediaPresentation>
    </ErrorBoundary>
  );
}
