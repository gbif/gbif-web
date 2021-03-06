import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
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
        key
        basisOfRecord
        eventDate
        gbifClassification{
          usage {
            rank
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
const wktBBoxTemplate = '((W S,E S,E N,W N,W S))';

function Map() {
  const currentFilterContext = useContext(FilterContext);
  const { labelMap, rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_MAP, { lazyLoad: true, keepDataWhileLoading: true });
  const { data: pointData, error: pointError, loading: pointLoading, load: pointLoad } = useQuery(OCCURRENCE_POINT, { lazyLoad: true });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig),
        {
          type: 'equals',
          key: 'hasCoordinate',
          value: true
        }
      ].filter(x => x)
    }
    load({ variables: { predicate } });
  }, [currentFilterContext.filterHash, rootPredicate]);

  const loadPointData = useCallback(({geohash, count}) => {
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
      ].filter(x => x)
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
    pointError,
    labelMap
  }

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} />
  } else {
    return <h1>Map placeholder</h1>
  }
}

export default Map;

