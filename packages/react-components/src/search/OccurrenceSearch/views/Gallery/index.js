import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../config/OccurrenceContext';
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
        gbifId
        countryCode
        locality
        gbifClassification{
          acceptedUsage {
            formattedName
          }
        }
        primaryImage {
          identifier
        }
      }
    }
  }
}
`;

function Table() {
  const [from, setFrom] = useState(0);
  const size = 50;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_GALLERY, { lazyLoad: true, keepDataWhileLoading: true });

  const [allData, setAllData] = useState([]);

  useEffect(() => {
    setAllData([...allData, ...data?.occurrenceSearch?.documents?.results || []])
  }, [data]);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig),
        {
          type: 'equals',
          key: 'mediaTypes',
          value: 'StillImage'
        }
      ]
    }
    load({ variables: { predicate, size, from } });
  }, [from, currentFilterContext.filterHash, rootPredicate]);

  useEffect(() => {
    setFrom(0);
    setAllData([])
  }, [currentFilterContext.filterHash, rootPredicate]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  });

  const prev = useCallback(() => {
    setFrom(Math.max(0, from - size));
  });

  const first = useCallback(() => {
    setFrom(0);
  });

  return <>
    <GalleryPresentation
      error={error}
      loading={loading}
      data={allData}
      total={data?.occurrenceSearch?.documents?.total}
      next={next}
      prev={prev}
      first={first}
      size={size}
      from={from} />
  </>
}

export default Table;

