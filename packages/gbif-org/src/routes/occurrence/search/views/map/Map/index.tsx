import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getAsQuery } from '@/components/filters/filterTools';
import { FilterContext, FilterType } from '@/contexts/filter';
import { OccurrenceSearchMetadata, SearchMetadata, useSearchContext } from '@/contexts/search';
import { filter2predicate } from '@/dataManagement/filterAdapter';
import {
  OccurrenceMapQuery,
  OccurrenceMapQueryVariables,
  OccurrencePointQuery,
  OccurrencePointQueryVariables,
  Predicate,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import Geohash from 'latlon-geohash';
import { CSSProperties, useCallback, useContext, useEffect, useMemo } from 'react';
import { searchConfig } from '../../../searchConfig';
import MapPresentation from './MapPresentation';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';

const OCCURRENCE_MAP = /* GraphQL */ `
  query occurrenceMap($q: String, $predicate: Predicate) {
    occurrenceSearch(q: $q, predicate: $predicate) {
      _meta
      documents {
        total
      }
      metaPredicate
    }
  }
`;

const OCCURRENCE_POINT = /* GraphQL */ `
  query occurrencePoint($q: String, $predicate: Predicate, $checklistKey: ID) {
    occurrenceSearch(q: $q, predicate: $predicate) {
      documents {
        total
        results {
          key
          basisOfRecord
          eventDate
          classification(checklistKey: $checklistKey) {
            usage {
              name
            }
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

interface MapProps {
  style?: CSSProperties;
  className?: string;
  mapStyleAttr?: CSSProperties;
}

interface LoadHashAndCountParams {
  filter: FilterType;
  searchContext: SearchMetadata;
  searchConfig: FilterConfigType;
  load: (options: {
    keepDataWhileLoading: boolean;
    variables: OccurrenceMapQueryVariables;
  }) => void;
}

interface LoadPointDataParams {
  geohash: string;
}

interface HandleFeatureChangeParams {
  features: any[];
}

function Map({ style, className, mapStyleAttr }: MapProps) {
  const searchContext: OccurrenceSearchMetadata = useSearchContext();
  const currentFilterContext = useContext(FilterContext);
  const { scope, mapSettings } = searchContext;
  const { data, error, loading, load } = useQuery<OccurrenceMapQuery, OccurrenceMapQueryVariables>(
    OCCURRENCE_MAP,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );
  const {
    data: pointData,
    error: pointError,
    loading: pointLoading,
    load: pointLoad,
  } = useQuery<OccurrencePointQuery, OccurrencePointQueryVariables>(OCCURRENCE_POINT, {
    lazyLoad: true,
  });

  const loadHashAndCount = useCallback(
    ({ filter, searchContext, searchConfig, load }: LoadHashAndCountParams) => {
      const query = getAsQuery({ filter, searchContext, searchConfig });
      const predicate: Predicate = {
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
    },
    []
  );

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

  // use memo to store the current geometries (filter.must?.geometry ?? []).map((x) => x.toString())
  const features = useMemo(() => {
    return (currentFilterContext.filter?.must?.geometry ?? []).map((x: any) => x.toString());
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash]);

  let registrationEmbargo: boolean;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, searchContext, searchConfig, load]);

  const loadPointData = useCallback(
    ({ geohash }: LoadPointDataParams) => {
      const latLon = Geohash.bounds(geohash);
      const N = latLon.ne.lat,
        S = latLon.sw.lat,
        W = latLon.sw.lon,
        E = latLon.ne.lon;
      const wkt =
        'POLYGON' +
        wktBBoxTemplate
          .replace(/N/g, String(N))
          .replace(/S/g, String(S))
          .replace(/W/g, String(W))
          .replace(/E/g, String(E));
      const predicate: Predicate = {
        type: PredicateType.And,
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
    ({ features }: HandleFeatureChangeParams) => {
      currentFilterContext.setFullField('geometry', features ?? [], []);
    },
    [currentFilterContext]
  );

  const q = currentFilterContext.filter?.must?.q?.[0];

  const options = {
    loading,
    error,
    total: data?.occurrenceSearch?.documents?.total,
    rootPredicate: scope,
    predicateConfig: searchConfig,
    loadPointData,
    registerPredicate,
    pointData,
    pointLoading,
    pointError,
    overlays: [
      {
        id: 'allOccurrences',
        q,
        predicateHash: data?.occurrenceSearch?.metaPredicate,
      },
    ],
    defaultMapSettings: mapSettings,
    onFeaturesChange: handleFeatureChange,
    features,
  };

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} {...{ style, className, mapStyleAttr }} />;
  } else {
    return <h1>Map placeholder</h1>;
  }
}

const MapBoundary = (props: MapProps) => {
  return (
    <ErrorBoundary type="BLOCK">
      <Map {...props} />
    </ErrorBoundary>
  );
};

export default MapBoundary;
