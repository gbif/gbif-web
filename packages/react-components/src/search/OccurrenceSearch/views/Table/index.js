import React, { useEffect, useContext, useState, useCallback, Component } from "react";
import { FilterContext } from "../../../..//widgets/Filter/state";
import predicateMapping from '../../../OccurrenceSearch/config/predicateMapping';
import { useQuery } from '../../../../dataManagement/graphql';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { TablePresentation } from './TablePresentation';

const OCCURRENCE_TABLE = `
query table($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total
      size
      from
      results {
        gbifId
        gbifClassification{
          acceptedUsage {
            rank
            formattedName
          }
        }
        year
				basisOfRecord
        datasetTitle
        publisherTitle
        countryCode
      }
    }
  }
}
`;

// const predicate = {
//   "type": "in",
//   "key": "year",
//   "values": [1901, 1910]
// };


function Table() {
  const [from, setFrom] = useState(0);
  const size = 20;
  const currentFilterContext = useContext(FilterContext);
  const { data, error, loading, load, cancel } = useQuery(OCCURRENCE_TABLE, { lazyLoad: true, keepDataWhileLoading: true });

  useEffect(() => {
    const predicate = filter2predicate(currentFilterContext.filter, predicateMapping);
    load({ variables: { predicate, size, from } });
  }, [currentFilterContext.filterHash, from]);

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
    />
  </>
}

export default Table;

