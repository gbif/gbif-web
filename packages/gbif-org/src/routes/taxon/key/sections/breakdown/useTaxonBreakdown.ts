import { TaxonBreakdownQuery, TaxonBreakdownQueryVariables } from '@/gql/graphql';
import { isFamilyOrAbove } from '@/hooks/taxonomyRankHooks';
import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';

export const TAXON_BREAKDOWN = /* GraphQL */ `
  query TaxonBreakdown($key: ID!, $datasetKey: ID!) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
      taxon {
        key: taxonID
        rank: taxonRank
        scientificName
        datasetKey
        checklistBankBreakdown: breakdown(sortByCount: true) {
          id: taxonID
          name: scientificName
          rank: taxonRank
          species
          children: breakdown {
            id: taxonID
            name: scientificName
            rank: taxonRank
            species
            children: breakdown {
              id: taxonID
              name: scientificName
              rank: taxonRank
              species
            }
          }
        }
      }
    }
  }
`;

export function useTaxonBreakdown({
  taxonKey,
  datasetKey,
  taxonRank,
}: {
  taxonKey: string;
  datasetKey: string;
  taxonRank?: string;
}) {
  const isValidRank = taxonRank ? isFamilyOrAbove(taxonRank) : true;
  const { data, load, loading } = useQuery<TaxonBreakdownQuery, TaxonBreakdownQueryVariables>(
    TAXON_BREAKDOWN,
    { variables: { key: taxonKey, datasetKey }, lazyLoad: true }
  );
  useEffect(() => {
    if (isValidRank) {
      load({ variables: { key: taxonKey, datasetKey } });
    }
  }, [taxonKey, datasetKey, isValidRank, load]);

  const breakdown = data?.taxonInfo?.taxon?.checklistBankBreakdown;
  let hasData = isValidRank && !!breakdown && (breakdown?.children?.length ?? 0) > 0;
  if (breakdown?.children?.length === 1 && (breakdown.children?.[0]?.children ?? []).length < 2) {
    hasData = false;
  }
  return { hasData, loading };
}
