import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import { TablePresentation } from './TablePresentation';

const OCCURRENCE_TABLE = `
query table($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total
      size
      from
      results {
        key
        gbifClassification{
          usage {
            rank
            formattedName
          }
        }
        year
				basisOfRecord
        datasetTitle
        publisherTitle
        countryCode
        formattedCoordinates

        stillImageCount
        movingImageCount
        soundCount
        typeStatus
        issues
        
        volatile {
          features {
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

function Table() {
  const [from, setFrom] = useUrlState({ param: 'from', defaultValue: 0 });
  const size = 50;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_TABLE, { lazyLoad: true, keepDataWhileLoading: true });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
    load({ variables: { predicate, size, from } });
  }, [currentFilterContext.filterHash, rootPredicate, from]);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    setFrom(0);
  }, [currentFilterContext.filterHash]);

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
    <TablePresentation
      loading={loading}
      data={data}
      next={next}
      prev={prev}
      first={first}
      size={size}
      from={from}
      total={data?.occurrenceSearch?.documents?.total}
    />
  </>
}

export default Table;

