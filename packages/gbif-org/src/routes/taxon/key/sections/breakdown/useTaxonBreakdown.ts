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

export function useTaxonBreakdown({ taxonKey, datasetKey }: Props) {
  const { data, loading } = useQuery<TaxonBreakdown2Query, TaxonBreakdown2QueryVariables>(
    TAXON_BREAKDOWN,
    { variables: { key: taxonKey, datasetKey } }
  );
  const breakdown = data?.taxonInfo?.taxon?.checklistBankBreakdown;
  const hasData = !!breakdown && (breakdown?.children?.length ?? 0) > 0;
  return { hasData, loading };
}
