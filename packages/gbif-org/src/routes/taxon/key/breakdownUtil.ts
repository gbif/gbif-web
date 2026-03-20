import {
  SourceTaxonQuery,
  SourceTaxonQueryVariables,
  TaxonBreakdownQuery,
  TaxonBreakdownQueryVariables,
} from '@/gql/graphql';
import { GraphQLService } from '@/services/graphQLService';
import { CANCEL_REQUEST } from '@/utils/fetchWithCancel';

const abortController = new AbortController();
const graphqlService = new GraphQLService({
  endpoint: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT,
  abortSignal: abortController.signal,
  locale: 'en',
});

export const getBreakdown = ({ key, datasetKey }: { key: string; datasetKey: string }) => {
  const promise = graphqlService.query<TaxonBreakdownQuery, TaxonBreakdownQueryVariables>(
    TAXON_BREAKDOWN,
    { key, datasetKey }
  );
  return {
    promise: promise.then((res) => res.json()),
    cancel: () => abortController.abort(CANCEL_REQUEST),
  };
};

export const getSourceTaxon = ({
  sourceId,
  datasetKey,
}: {
  sourceId: string;
  datasetKey: string;
}) => {
  const promise = graphqlService.query<SourceTaxonQuery, SourceTaxonQueryVariables>(SOURCE_TAXON, {
    sourceId,
    datasetKey,
  });
  return {
    promise: promise.then((res) => res.json()),
    cancel: () => abortController.abort(CANCEL_REQUEST),
  };
};

const TAXON_BREAKDOWN = /* GraphQL */ `
  query TaxonBreakdown($key: ID!, $datasetKey: ID!) {
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
          }
        }
      }
    }
  }
`;

const SOURCE_TAXON = /* GraphQL_x */ `
  query SourceTaxon($sourceId: ID!, $datasetKey: ID!) {
    taxonBySourceId(sourceId: $sourceId, datasetKey: $datasetKey) {
      key
      nubKey
      scientificName
      taxonID
    }
  }
`;
