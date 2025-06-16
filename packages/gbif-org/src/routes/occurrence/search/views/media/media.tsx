import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getAsQuery } from '@/components/filters/filterTools';
import { useToast } from '@/components/ui/use-toast';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import {
  OccurrenceMediaSearchQuery,
  OccurrenceMediaSearchQueryVariables,
  Predicate,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useCallback, useContext, useEffect, useState } from 'react';
import { searchConfig } from '../../searchConfig';
import { useEntityDrawer } from '../browseList/useEntityDrawer';
import { useOrderedList } from '../browseList/useOrderedList';
import { MediaPresentation } from './mediaPresentation';

const OCCURRENCE_MEDIA = /* GraphQL */ `
  query occurrenceMediaSearch(
    $q: String
    $predicate: Predicate
    $size: Int
    $from: Int
    $checklistKey: ID
  ) {
    occurrenceSearch(q: $q, predicate: $predicate) {
      documents(size: $size, from: $from) {
        total
        size
        from
        results {
          key
          countryCode
          locality
          basisOfRecord
          scientificName
          typeStatus
          eventDate
          verbatimScientificName
          classification(checklistKey: $checklistKey) {
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

export function Media({ size: defaultSize = 50 }) {
  const [from, setFrom] = useState(0);
  const searchContext = useSearchContext();
  const size = defaultSize;
  const { toast } = useToast();
  const currentFilterContext = useContext(FilterContext);
  const [mediaTypes, setMediaTypes] = useState(['StillImage']);
  const { scope } = useSearchContext();
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
      // check if all results are objects with a scientificName. If there are empty results then the error is to severe to ignore
      const allHaveImages = allData.every((x) => x.scientificName);
      if (allHaveImages) {
        // notify the user with a toast about the error but contnue to show the images
        toast({
          title: 'Unable to load all content',
          variant: 'destructive',
        });
        console.error(error);
      } else {
        throw error;
      }
    }
  }, [error, allData, toast]);

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
    load({ keepDataWhileLoading: true, variables: { predicate, q: query.q, size, from } });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, currentFilterContext.filterHash, scope, load, size]);

  useEffect(() => {
    setFrom(0);
    setAllData([]);
  }, [currentFilterContext.filterHash, scope]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  }, [from, size]);

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
      />
    </ErrorBoundary>
  );
}
