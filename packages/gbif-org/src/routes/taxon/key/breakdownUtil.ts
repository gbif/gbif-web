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

export const getBreakdown = ({ key }: { key: string }) => {
  const promise = graphqlService.query<TaxonBreakdownQuery, TaxonBreakdownQueryVariables>(
    TAXON_BREAKDOWN,
    { key }
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
  query TaxonBreakdown($key: ID!) {
    taxon(key: $key) {
      key
      rank
      scientificName
      checklistBankBreakdown {
        id
        label
        name
        rank
        species
        children {
          id
          label
          name
          rank
          species
        }
      }
    }
  }
`;

const SOURCE_TAXON = /* GraphQL */ `
  query SourceTaxon($sourceId: ID!, $datasetKey: ID!) {
    taxonBySourceId(sourceId: $sourceId, datasetKey: $datasetKey) {
      key
      nubKey
      scientificName
      taxonID
    }
  }
`;
