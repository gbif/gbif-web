import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { useCallback, useContext, useEffect, useState } from 'react';
import { searchConfig } from '../../searchConfig';
import { useOrderedList } from '../browseList/useOrderedList';
import { MediaPresentation } from './mediaPresentation';

const OCCURRENCE_MEDIA = `
query occurrenceMedia($predicate: Predicate, $size: Int, $from: Int) {
  occurrenceSearch(predicate: $predicate) {
    documents(size: $size, from: $from) {
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
        gbifClassification{
          usage {
            formattedName
          }
        }
        primaryImage {
          identifier: thumbor(height: 400)
        }
        formattedCoordinates
        volatile {
          features {
            isSpecimen
            isTreament
            isSequenced
            isClustered
            isSamplingEvent
          }
        }
      }
    }
  }
}
`;

export function Media({ size: defaultSize = 50 }) {
  const [from, setFrom] = useState(0);
  const size = defaultSize;
  const currentFilterContext = useContext(FilterContext);
  const [mediaTypes, setMediaTypes] = useState(['StillImage']);
  const { scope } = useSearchContext();
  const { data, error, loading, load } = useQuery(OCCURRENCE_MEDIA, {
    lazyLoad: true,
    throwAllErrors: true,
  });
  const { setOrderedList } = useOrderedList();
  const [, setPreviewKey] = useStringParam({ key: 'entity' });

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
  }, [data]);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        scope,
        filter2predicate(currentFilterContext.filter, searchConfig),
        {
          type: 'in',
          key: 'mediaType',
          // values: ['StillImage', 'MovingImage', 'Sound'],
          values: ['StillImage'],
        },
      ].filter((x) => x),
    };
    load({ keepDataWhileLoading: true, variables: { predicate, size, from } });
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
  );
}
