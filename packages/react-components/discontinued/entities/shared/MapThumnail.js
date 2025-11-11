import React, { useEffect, useContext } from 'react';
import { useQuery } from '../../dataManagement/api';
import { ThumbnailMap } from '../../components';
// import { filter2predicate } from '../../dataManagement/filterAdapter';
import OccurrenceContext from '../../search/SearchContext';

export function MapThumbnail({
  showMapWithoutData,
  // ignoreRootScope,
  predicate,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_MAP, { lazyLoad: true });

  useEffect(() => {
    const predicates = [
      predicate,
      {
        type: 'equals',
        key: 'hasCoordinate',
        value: true
      }
    ];
    // if (!ignoreRootScope) {
    //   predicates.push(rootPredicate);
    // }
    const constructedPredicate = {
      type: 'and',
      predicates: predicates.filter(x => x)
    }
    load({ keepDataWhileLoading: false, variables: { predicate: constructedPredicate } });
  }, [predicate]);

  if (loading || error || !data) return null;
  const total = data?.occurrenceSearch?.documents?.total;
  if (total === 0 && !showMapWithoutData) return null;

  console.log(data);
  const predicateHash = data.occurrenceSearch._v1PredicateHash;
  return <ThumbnailMap filter={{predicateHash}} {...props} />
};
// https://api.gbif.org/v2/map/occurrence/adhoc/1/1/0.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=-603233766&

const OCCURRENCE_MAP = `
query map($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents {
      total
    }
    _v1PredicateHash
  }
}
`;

