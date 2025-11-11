import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { GalleryPresentation } from './GalleryPresentation';

const OCCURRENCE_GALLERY = `
query gallery($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
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

function Gallery({ size: defaultSize = 50, ...props }) {
  const [from, setFrom] = useState(0);
  const size = defaultSize;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_GALLERY, { lazyLoad: true, throwNetworkErrors: true, queryTag: 'gallery' });

  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const all = [...allData, ...data?.occurrenceSearch?.documents?.results || []];
    // get unique by key
    const unique = all.reduce((acc, cur) => {
      if (acc.find(x => x.key === cur.key)) {
        return acc;
      }
      return [...acc, cur];
    }, []);
    setAllData(unique);
  }, [data]);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig),
        {
          type: 'equals',
          key: 'mediaType',
          value: 'StillImage'
        }
      ].filter(x => x)
    }
    load({ keepDataWhileLoading: true, variables: { predicate, size, from } });
  }, [from, currentFilterContext.filterHash, rootPredicate]);

  useEffect(() => {
    setFrom(0);
    setAllData([])
  }, [currentFilterContext.filterHash, rootPredicate]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  }, [from, size]);

  return <GalleryPresentation
    error={error}
    loading={loading}
    data={allData}
    total={data?.occurrenceSearch?.documents?.total}
    next={next}
    size={size}
    from={from}
    {...props}
  />
}

export default Gallery;

