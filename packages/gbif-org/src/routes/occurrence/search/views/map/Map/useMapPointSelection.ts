import { useCallback, useState } from 'react';
import useQuery from '@/hooks/useQuery';
import {
  OccurrencePointQuery,
  OccurrencePointQueryVariables,
  Predicate,
  PredicateType,
} from '@/gql/graphql';
import Geohash from 'latlon-geohash';
import { PointClickData } from './types';

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

export function useMapPointSelection() {
  const [listVisible, setListVisible] = useState<boolean>(false);
  
  const {
    data: pointData,
    error: pointError,
    loading: pointLoading,
    load: pointLoad,
  } = useQuery<OccurrencePointQuery, OccurrencePointQueryVariables>(OCCURRENCE_POINT, {
    lazyLoad: true,
  });

  const loadPointData = useCallback(
    ({ geohash, predicate: layerPredicate }: PointClickData) => {
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
          layerPredicate,
          {
            type: 'within',
            key: 'geometry',
            value: wkt,
          },
        ].filter((x) => x),
      };
      pointLoad({ variables: { predicate } });
      setListVisible(true);
    },
    [pointLoad]
  );

  const showList = useCallback((show: boolean) => {
    setListVisible(show);
  }, []);

  return {
    listVisible,
    showList,
    pointData,
    pointError,
    pointLoading,
    loadPointData,
  };
}