// @ts-nocheck
import { getAsQuery } from '@/components/filters/filterTools';
import { FilterContext } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import { PredicateType } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import Geohash from 'latlon-geohash';
import { useCallback, useContext, useEffect } from 'react';
import { searchConfig } from '../../../searchConfig';
import MapPresentation from './MapPresentation';

const OCCURRENCE_MAP = `
query map($q: String, $predicate: Predicate){
  occurrenceSearch(q: $q, predicate: $predicate) {
    _meta
    documents {
      total
    }
    metaPredicate
  }
}
`;

const OCCURRENCE_POINT = `
query point($q: String, $predicate: Predicate, $checklistKey: ID){
  occurrenceSearch(q: $q, predicate: $predicate) {
    documents {
      total
      results {
        key
        basisOfRecord
        eventDate
        classification(checklistKey: $checklistKey) {
          taxonMatch {
            usage {
              canonicalName
            }
          }
        }
        primaryImage {
          identifier: thumbor(width: 60, height: 60)
        }
      }
    }
  }
}
`;
const wktBBoxTemplate = '((W S,E S,E N,W N,W S))';

function Map({ style, className, mapProps }) {
  const searchContext = useSearchContext();
  const currentFilterContext = useContext(FilterContext);
  const { scope, mapSettings } = searchContext;
  const { data, error, loading, load } = useQuery(OCCURRENCE_MAP, {
    lazyLoad: true,
    throwAllErrors: true,
  });
  const {
    data: pointData,
    error: pointError,
    loading: pointLoading,
    load: pointLoad,
  } = useQuery(OCCURRENCE_POINT, { lazyLoad: true });

  const loadHashAndCount = useCallback(({ filter, searchContext, searchConfig, load }) => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    const predicate = {
      type: PredicateType.And,
      predicates: [
        query.predicate,
        {
          type: 'equals',
          key: 'hasCoordinate',
          value: true,
        },
      ].filter((x) => x),
    };
    load({ keepDataWhileLoading: true, variables: { predicate, q: query.q } });
  }, []);

  useEffect(() => {
    loadHashAndCount({
      filter: currentFilterContext.filter,
      searchConfig,
      load,
      searchContext,
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, searchContext, scope, load, loadHashAndCount]);

  let registrationEmbargo;
  /**
   * Allow the map to register the predicate again. This can be useful when tile with status code 400 errors come back.
   * But it should only be allowed to do every so often as we do not want to send request 500 times a second when an error is persistent.
   * In theory it should only ever be called once and that is in the relatively rare case when the tile server is redployed just as someone is browsing the map.
   */
  const registerPredicate = useCallback(() => {
    if (registrationEmbargo) return;
    registrationEmbargo = true;
    window.setTimeout(() => (registrationEmbargo = false), 10000); //only allow registering an error every 10 seconds.
    loadHashAndCount({
      filter: currentFilterContext.filter,
      searchConfig,
      searchContext,
      load,
    });
  }, [currentFilterContext.filterHash, searchContext, searchConfig, load]);

  const loadPointData = useCallback(
    ({ geohash }) => {
      const latLon = Geohash.bounds(geohash);
      const N = latLon.ne.lat,
        S = latLon.sw.lat,
        W = latLon.sw.lon,
        E = latLon.ne.lon;
      const wkt =
        'POLYGON' +
        wktBBoxTemplate.replace(/N/g, N).replace(/S/g, S).replace(/W/g, W).replace(/E/g, E);
      const predicate = {
        type: 'and',
        predicates: [
          scope,
          filter2predicate(currentFilterContext.filter, searchConfig),
          {
            type: 'within',
            key: 'geometry',
            value: wkt,
          },
        ].filter((x) => x),
      };
      pointLoad({ variables: { predicate } });
    },
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFilterContext.filterHash, scope, pointLoad]
  );

  const handleFeatureChange = useCallback(
    ({ features }) => {
      currentFilterContext.setFullField('geometry', features ?? []);
    },
    [currentFilterContext]
  );

  const q = currentFilterContext.filter?.must?.q?.[0];

  const options = {
    loading,
    error,
    total: data?.occurrenceSearch?.documents?.total,
    query: data?.occurrenceSearch?._meta?.query || {},
    predicateHash: data?.occurrenceSearch?.metaPredicate,
    rootPredicate: scope,
    predicateConfig: searchConfig,
    loadPointData,
    registerPredicate,
    pointData,
    pointLoading,
    pointError,
    labelMap: {},
    q,
    defaultMapSettings: mapSettings,
    onFeaturesChange: handleFeatureChange,
  };

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} {...{ style, className, mapProps }} />;
    // return <h1>Map placeholder</h1>
  } else {
    return <h1>Map placeholder</h1>;
  }
}

export default Map;
