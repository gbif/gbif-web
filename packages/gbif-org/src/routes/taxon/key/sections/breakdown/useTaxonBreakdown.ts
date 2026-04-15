import { TaxonBreakdown2Query, TaxonBreakdown2QueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';

export const TAXON_BREAKDOWN = /* GraphQL */ `
  query TaxonBreakdown2($key: ID!, $datasetKey: ID!) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
      taxon {
        key: taxonID
        rank: taxonRank
        scientificName
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
}: {
  taxonKey: string;
  datasetKey: string;
}) {
  const { data, loading } = useQuery<TaxonBreakdown2Query, TaxonBreakdown2QueryVariables>(
    TAXON_BREAKDOWN,
    { variables: { key: taxonKey, datasetKey } }
  );
  const breakdown = data?.taxonInfo?.taxon?.checklistBankBreakdown;
  let hasData = !!breakdown && (breakdown?.children?.length ?? 0) > 0;
  if (breakdown?.children?.length === 1 && (breakdown.children?.[0]?.children ?? []).length < 2) {
    hasData = false;
  }
  return { hasData, loading };
}
