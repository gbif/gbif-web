import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getAsQuery } from '@/components/filters/filterTools';
import { FilterContext, FilterType } from '@/contexts/filter';
import { OccurrenceSearchMetadata, SearchMetadata, useSearchContext } from '@/contexts/search';
import {
  OccurrenceMapQuery,
  OccurrenceMapQueryVariables,
  Predicate,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { CSSProperties, useCallback, useContext, useEffect, useMemo } from 'react';
import { searchConfig } from '../../../searchConfig';
import MapPresentation, { MapPresentationProps } from './MapPresentation';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { Skeleton } from '@/components/ui/skeleton';

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

  const handleFeatureChange = useCallback(
    ({ features }: HandleFeatureChangeParams) => {
      currentFilterContext.setFullField('geometry', features ?? [], []);
    },
    [currentFilterContext]
  );

  const q = currentFilterContext.filter?.must?.q?.[0];

  const options: MapPresentationProps = {
    loading,
    total: data?.occurrenceSearch?.documents?.total,
    registerPredicate,
    overlays: [
      {
        id: 'allOccurrences',
        q,
        predicateHash: data?.occurrenceSearch?.metaPredicate,
        predicate: data?.occurrenceSearch?._meta.predicate,
        hidden: false,
      },
    ],
    defaultMapSettings: mapSettings,
    onFeaturesChange: handleFeatureChange,
    features,
    style,
    className,
    mapStyleAttr,
  };

  if (typeof window !== 'undefined') {
    return <MapPresentation {...options} />;
  } else {
    return <Skeleton className="g-w-full g-h-96" />;
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
