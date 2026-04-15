import rankEnum from '@/enums/basic/rank.json';
import { useEffect, useState } from 'react';

const majorRanks = new Set(['KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS', 'SPECIES']);

const fmIndex = rankEnum.indexOf('FAMILY');
const spIndex = rankEnum.indexOf('SPECIES');

export function useNextMajorRank(rank: string) {
  const [nextRank, setNextRank] = useState<string | null>(null);
  useEffect(() => {
    const idx = rankEnum.indexOf(rank);
    if (idx > -1) {
      const nextIdx = rankEnum.findIndex((r, i) => i > idx && majorRanks.has(r));
      setNextRank(nextIdx > -1 ? rankEnum[nextIdx] : null);
    }
  }, [rank]);

  return nextRank;
}

export function useIsSpeciesOrBelow(rank: string) {
  const [isSpeciesOrBelow, setIsSpeciesOrBelow] = useState(false);
  useEffect(() => {
    setIsSpeciesOrBelow(rankEnum.indexOf(rank) >= spIndex);
  }, [rank]);

  return isSpeciesOrBelow;
}

export function useIsFamilyOrAbove(rank: string) {
  const [isFamilyOrAbove, setIsFamilyOrAbove] = useState(false);
  useEffect(() => {
    setIsFamilyOrAbove(rankEnum.indexOf(rank) <= fmIndex);
  }, [rank]);

  return isFamilyOrAbove;
}

export function useIsAboveFamily(rank: string) {
  const [isAboveFamily, setIsAboveFamily] = useState(false);
  useEffect(() => {
    setIsAboveFamily(rankEnum.indexOf(rank) < fmIndex);
  }, [rank]);

  return isAboveFamily;
}
