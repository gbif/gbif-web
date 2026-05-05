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
import { MediaPresentation } from './mediaPresentation';
import { MediaSortMode, MediaSortState } from './mediaSort';

const OCCURRENCE_MEDIA = /* GraphQL */ `
  query occurrenceMediaSearch(
    $q: String
    $predicate: Predicate
    $size: Int
    $from: Int
    $sortBy: OccurrenceSortBy
    $sortOrder: SortOrder
    $shuffle: Int
    $checklistKey: ID
  ) {
    occurrenceSearch(q: $q, predicate: $predicate) {
      documents(
        size: $size
        from: $from
        sortBy: $sortBy
        sortOrder: $sortOrder
        shuffle: $shuffle
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
            }
            taxonMatch {
              usage {
                canonicalName
              }
            }
          }
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

const DEFAULT_SORT: MediaSortState = {
  mode: 'default',
  sortBy: undefined,
  sortOrder: SortOrder.Asc,
};

export function Media({ size: defaultSize = 50 }) {
  const [from, setFrom] = useState(0);
  const searchContext = useSearchContext();
  const size = defaultSize;
  const { toast } = useToast();
  const currentFilterContext = useContext(FilterContext);
  const [mediaTypes] = useState(['StillImage']);
  const { scope } = useSearchContext();
  const [sortState, setSortState] = useLocalStorage<MediaSortState>(
    'occurrenceMediaSort',
    DEFAULT_SORT
  );
  const [shuffleSeed, setShuffleSeed] = useState<number | undefined>(undefined);
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
  }, [data, error, toast]);

  useEffect(() => {
    if (error) {
      if (data?.occurrenceSearch?.documents.results) {
        // ignore errors for now - I do not see how they can be critical enough to warn the user given the query we have. At worst the name will show without formatting.
        // notify the user with a toast about the error but contnue to show the images
        // toast({
        //   title: 'Unable to load all content',
        //   variant: 'destructive',
        // });
      } else {
        throw error;
      }
    }
  }, [error, allData, toast]);

  // Generate a shuffle seed on first entry into random mode (e.g. after a page reload
  // when the persisted sortState already has mode==='random'). Otherwise clear it.
  useEffect(() => {
    if (sortState.mode === 'random') {
      setShuffleSeed((current) =>
        typeof current === 'number' ? current : Math.floor(Math.random() * 1_000_000)
      );
    } else if (typeof shuffleSeed === 'number') {
      setShuffleSeed(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState.mode]);

  useEffect(() => {
    const query = getAsQuery({ filter: currentFilterContext.filter, searchContext, searchConfig });
    const predicate: Predicate = {
      type: PredicateType.And,
      predicates: [
        query.predicate,
        {
          type: 'in',
          key: 'mediaType',
          // values: ['StillImage', 'MovingImage', 'Sound'],
          values: ['StillImage'],
        },
      ].filter((x) => x),
    };
    const isSort = sortState.mode === 'sort' && sortState.sortBy;
    const isRandom = sortState.mode === 'random' && typeof shuffleSeed === 'number';
    load({
      keepDataWhileLoading: true,
      variables: {
        predicate,
        q: query.q,
        size,
        from,
        sortBy: isSort ? (sortState.sortBy as OccurrenceSortBy) : undefined,
        sortOrder: isSort ? sortState.sortOrder : undefined,
        shuffle: isRandom ? shuffleSeed : undefined,
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    from,
    currentFilterContext.filterHash,
    scope,
    load,
    size,
    sortState.mode,
    sortState.sortBy,
    sortState.sortOrder,
    shuffleSeed,
  ]);

  // Reset pagination + accumulated data when filters or sort change.
  useEffect(() => {
    setFrom(0);
    setAllData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentFilterContext.filterHash,
    scope,
    sortState.mode,
    sortState.sortBy,
    sortState.sortOrder,
    shuffleSeed,
  ]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  }, [from, size]);

  const onSortChange = useCallback(
    (mode: MediaSortMode, sortBy?: OccurrenceSortBy) => {
      if (mode === 'random') {
        // Generate a fresh seed every time the user (re-)picks random.
        setShuffleSeed(Math.floor(Math.random() * 1_000_000));
        setSortState({ mode: 'random', sortBy: undefined, sortOrder: SortOrder.Asc });
      } else if (mode === 'sort' && sortBy) {
        // Toggle ASC/DESC if the same field is picked again.
        if (sortState.mode === 'sort' && sortState.sortBy === sortBy) {
          setSortState({
            mode: 'sort',
            sortBy,
            sortOrder: sortState.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc,
          });
        } else {
          setSortState({ mode: 'sort', sortBy, sortOrder: SortOrder.Asc });
        }
      } else {
        setSortState(DEFAULT_SORT);
      }
    },
    [setSortState, sortState]
  );

  const onSortOrderChange = useCallback(
    (order: SortOrder) => {
      if (sortState.mode === 'sort') {
        setSortState({ ...sortState, sortOrder: order });
      }
    },
    [setSortState, sortState]
  );

  return (
    <ErrorBoundary>
      <MediaPresentation
        mediaTypes={mediaTypes}
        results={allData}
        loading={loading}
        error={error}
        endOfRecords={from + size >= data?.occurrenceSearch?.documents?.total}
        next={next}
        total={data?.occurrenceSearch?.documents?.total}
        onSelect={({ key }: { key: string | number }) => selectPreview(key)}
        sortState={sortState}
        onSortChange={onSortChange}
        onSortOrderChange={onSortOrderChange}
      />
    </ErrorBoundary>
  );
}
