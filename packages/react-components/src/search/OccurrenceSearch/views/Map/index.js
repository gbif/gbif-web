import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../config/OccurrenceContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import MapPresentation from './MapPresentation';
import Geohash from 'latlon-geohash';

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

const OCCURRENCE_POINT = `
query point($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents {
      total
      results {
        gbifId
        gbifClassification{
          usage {
            rank
            formattedName
          }
        }
      }
    }
  }
}
`;
const wktBBoxTemplate = '((W S,E S,E N,W N,W S))';

function Map() {
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_MAP, { lazyLoad: true, keepDataWhileLoading: true });
  const { data: pointData, error: pointError, loading: pointLoading, load: pointLoad } = useQuery(OCCURRENCE_POINT, { lazyLoad: true });

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

  const loadPointData = useCallback(({geohash}) => {
    const latLon = Geohash.bounds(geohash);
    const N = latLon.ne.lat, S = latLon.sw.lat, W = latLon.sw.lon, E = latLon.ne.lon;
    const wkt = 'POLYGON' + wktBBoxTemplate.replace(/N/g, N).replace(/S/g, S).replace(/W/g, W).replace(/E/g, E);

    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig),
        {
          type: 'within',
          key: 'scoordinates',
          value: wkt
        }
      ]
    }
    pointLoad({ variables: { predicate } });
  }, [currentFilterContext.filterHash, rootPredicate]);

  const options = {
    loading,
    error,
    total: data?.occurrenceSearch?.documents?.total,
    query: data?.occurrenceSearch?._meta?.query || {},
    rootPredicate,
    predicateConfig,
    loadPointData,
    pointData,
    pointLoading,
    pointError
  }

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} />
  } else {
    return <h1>Map placeholder</h1>
  }
}

export default Map;

