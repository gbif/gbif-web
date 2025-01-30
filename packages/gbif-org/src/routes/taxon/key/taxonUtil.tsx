import rankEnum from '@/enums/basic/rank.json';

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
