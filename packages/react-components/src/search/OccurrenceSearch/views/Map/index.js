import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../config/OccurrenceContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import MapPresentation from './MapPresentation';

const OCCURRENCE_MAP = `
query map($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    _meta
    documents {
      total
    }
  }
}
`;

function Map() {
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_MAP, { lazyLoad: true, keepDataWhileLoading: true });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ]
    }
    load({ variables: { predicate } });
  }, [currentFilterContext.filterHash, rootPredicate]);

  const options = {
    loading, 
    error, 
    total: data?.occurrenceSearch?.documents?.total,
    query: data?.occurrenceSearch?._meta?.query || {},
  }
  
  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} />
  } else {
    return <h1>Map placeholder</h1>
  }
}

export default Map;

