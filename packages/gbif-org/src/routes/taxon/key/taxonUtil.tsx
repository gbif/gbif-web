import rankEnum from '@/enums/basic/rank.json';
import { PredicateType } from '@/gql/graphql';
import { useEffect, useState } from 'react';

export function useIsSpeciesOrBelow(rank: string) {
  const [isSpeciesOrBelow, setIsSpeciesOrBelow] = useState(false);
  const spIndex = rankEnum.indexOf('SPECIES');
  useEffect(() => {
    setIsSpeciesOrBelow(rankEnum.indexOf(rank) >= spIndex);
  }, [rank, spIndex]);

  return isSpeciesOrBelow;
}

export function useIsFamilyOrAbove(rank: string) {
  const [isSpeciesOrBelow, setIsSpeciesOrBelow] = useState(false);
  const fmIndex = rankEnum.indexOf('FAMILY');
  useEffect(() => {
    setIsSpeciesOrBelow(rankEnum.indexOf(rank) <= fmIndex);
  }, [rank, fmIndex]);

  return isSpeciesOrBelow;
}

export const typeSpecimenPredicate = (taxonKey: number) => ({
  type: PredicateType.And,
  predicates: [
    {
      type: PredicateType.Not,
      predicate: {
        type: PredicateType.Equals,
        key: 'typeStatus',
        value: 'NOTATYPE',
      },
    },
    {
      type: PredicateType.Not,
      predicate: {
        type: PredicateType.Equals,
        key: 'datasetKey',
        value: '55b9ac33-0532-46d3-9796-c4c157f2b097',
      },
    },
    {
      type: PredicateType.IsNotNull,
      key: 'typeStatus',
    },
    {
      type: PredicateType.Equals,
      key: 'taxonKey',
      value: taxonKey,
    },
  ],
});

export const imagePredicate = (taxonKey: number) => ({
  type: PredicateType.And,
  predicates: [
    {
      type: PredicateType.Equals,
      key: 'taxonKey',
      value: taxonKey,
    },
    {
      type: PredicateType.Equals,
      key: 'mediaType',
      value: 'StillImage',
    },
  ],
});
