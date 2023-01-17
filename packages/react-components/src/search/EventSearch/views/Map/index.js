import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../..//widgets/Filter/state';
import EventContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import MapPresentation from './MapPresentation';
import { getBboxFromFeature } from './esTileHash';
import SiteContext from "../../../../dataManagement/SiteContext";
import { ErrorBoundary } from "../../../../components";

const EVENT_MAP = `
query map($predicate: Predicate){
  eventSearch(predicate: $predicate) {
    _meta
    documents {
      total
    }
    _tileServerToken    
  }
}
`;

const EVENT_POINT = `
query point($predicate: Predicate){
  eventSearch(predicate: $predicate) {
    documents {
      total
      results {
        datasetTitle
        datasetKey
        eventID
        eventType {
          concept
        }
        measurementOrFactTypes
        year
      }
    }
  }
}
`;


function Map() {
  const siteContext = useContext(SiteContext);
  const currentFilterContext = useContext(FilterContext);
  const { labelMap, rootPredicate, predicateConfig, more } = useContext(EventContext);
  const { data, error, loading, load } = useQuery(EVENT_MAP, { lazyLoad: true, throwAllErrors: true, queryTag: 'map' });
  const { data: pointData, error: pointError, loading: pointLoading, load: pointLoad } = useQuery(EVENT_POINT, { lazyLoad: true, queryTag: 'mapPoints' });

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
        filter2predicate(filter, predicateConfig)
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

  const wktBBoxTemplate = '((W S,E S,E N,W N,W S))';

  const loadPointData = useCallback(({geohash}) => {
    const bbox = getBboxFromFeature(geohash);
    const N = bbox.north, S = bbox.south, W = bbox.west, E = bbox.east;
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
    total: data?.eventSearch?.documents?.total,
    query: data?.eventSearch?._meta?.query || {},
    predicateHash: data?.eventSearch?._tileServerToken,
    rootPredicate,
    predicateConfig,
    loadPointData,
    registerPredicate,
    pointData,
    pointLoading,
    pointError,
    labelMap,
    defaultMapSettings: siteContext.mapSettings ? siteContext.mapSettings : more?.mapSettings
  }

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} />
  } else {
    return <h1>Map placeholder</h1>
  }
}

export default props => <ErrorBoundary><Map {...props} /></ErrorBoundary>;

