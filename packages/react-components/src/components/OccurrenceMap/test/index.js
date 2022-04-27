import React, { useEffect, useCallback, useState } from "react";
import { useQuery } from '../../../dataManagement/api';
import MapPresentation from './MapPresentation';
import hash from 'object-hash';

const intervalSize = .25;
const OCCURRENCE_MAP = `
query map($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    _meta
    stats {
      decimalLatitude {
        min
        max
      }
    }
    histogram {
      decimalLongitude(interval: ${intervalSize}) {
        bounds
      }
    }
    documents {
      total
    }
    _v1PredicateHash
  }
}
`;

function Map({ mapSettings, rootPredicate, ...props }) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_MAP, { lazyLoad: true });
  const [bbox, setBbox] = useState();
  const [queryId, setQueryID] = useState(hash(rootPredicate));

  useEffect(() => {
    loadHashAndCount({
      rootPredicate
    });
  }, [queryId]);

  useEffect(() => {
    if (data?.occurrenceSearch) {
      const { stats, histogram } = data?.occurrenceSearch;
      const { decimalLatitude: lat } = stats;
      const { bounds } = histogram.decimalLongitude;
      if (bounds) {
        let box = { south: lat.min, north: lat.max, ...bounds };
        setBbox(box);
      } else {
        setBbox();
      }
    }
  }, [data]);

  const loadHashAndCount = useCallback(({ rootPredicate }) => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
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
    console.log('load anew');
    loadHashAndCount({
      rootPredicate
    });
  }, [queryId]);

  const options = {
    loading,
    error,
    total: data?.occurrenceSearch?.documents?.total,
    query: data?.occurrenceSearch?._meta?.query || {},
    predicateHash: data?.occurrenceSearch?._v1PredicateHash,
    rootPredicate,
    registerPredicate,
    defaultMapSettings: mapSettings,
    bbox
  }

  // if (!bbox) return null;

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} style={{height: 500}}/>
  } else {
    return <h1>Map placeholder</h1>
  }
}

export default Map;

