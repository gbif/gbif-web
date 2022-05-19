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
    _v1PredicateHash
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
  const { labelMap, rootPredicate, predicateConfig, more } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_MAP, { lazyLoad: true });
  const { data: pointData, error: pointError, loading: pointLoading, load: pointLoad } = useQuery(OCCURRENCE_POINT, { lazyLoad: true });

  useEffect(() => {
    loadHashAndCount({
      filter: currentFilterContext.filter,
      predicateConfig,
      rootPredicate
    });
  }, [currentFilterContext.filterHash, rootPredicate, predicateConfig]);

  const loadHashAndCount = useCallback(({filter, predicateConfig, rootPredicate}) => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(filter, predicateConfig),
        {
          type: 'equals',
          key: 'hasCoordinate',
          value: true
        }
      ].filter(x => x)
    }
    load({ keepDataWhileLoading: true, variables: { predicate } });
  }, []);

  let registrationEmbargo;
  /**
   * Allow the map to register the predicate again. This can be useful when tile with status code 400 errors come back. 
   * But it should only be allowed to do every so often as we do not want to send request 500 times a second when an error is persistent.
   * In theory it should only ever be called once and that is in the relatively rare case when the tile server is redployed just as someone is browsing the map.
   */
  const registerPredicate = useCallback(() => {
    if (registrationEmbargo) return;
    registrationEmbargo = true;
    window.setTimeout(() => registrationEmbargo = false, 10000);//only allow registering an error every 10 seconds.
    loadHashAndCount({
      filter: currentFilterContext.filter,
      predicateConfig,
      rootPredicate
    });
  }, [currentFilterContext.filterHash, rootPredicate, predicateConfig]);

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
      ].filter(x => x)
    }
    pointLoad({ variables: { predicate } });
  }, [currentFilterContext.filterHash, rootPredicate]);

  const q = currentFilterContext.filter?.must?.q?.[0];
  
  const options = {
    loading,
    error,
    total: data?.occurrenceSearch?.documents?.total,
    query: data?.occurrenceSearch?._meta?.query || {},
    predicateHash: data?.occurrenceSearch?._v1PredicateHash,
    rootPredicate,
    predicateConfig,
    loadPointData,
    registerPredicate,
    pointData,
    pointLoading,
    pointError,
    labelMap,
    q,
    defaultMapSettings: more?.mapSettings
  }

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} />
  } else {
    return <h1>Map placeholder</h1>
  }
}

export default Map;

