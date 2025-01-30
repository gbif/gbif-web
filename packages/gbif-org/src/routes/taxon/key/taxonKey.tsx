import { NotFoundError } from '@/errors';
import {
  PredicateType,
  TaxonQuery,
  TaxonQueryVariables,
  TaxonSummaryMetricsQuery,
  TaxonSummaryMetricsQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { TaxonKey as Presentation } from './taxonKeyPresentation';

export async function taxonLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<TaxonQuery, TaxonQueryVariables>(TAXON_QUERY, { key });
}

export function TaxonKey() {
  const { data } = useLoaderData() as { data: TaxonQuery };

  const { data: taxonMetrics, load: slowLoad } = useQuery<
    TaxonSummaryMetricsQuery,
    TaxonSummaryMetricsQueryVariables
  >(SLOW_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    const id = data.taxon?.key;
    if (typeof id !== 'undefined') {
      const taxonPredicate = {
        type: PredicateType.Equals,
        key: 'taxonKey',
        value: id,
      };
      slowLoad({
        variables: {
          predicate: taxonPredicate,
        },
      });
    }
  }, [data.taxon?.key]);

  if (data.taxon == null) throw new NotFoundError();
  return <Presentation data={data} taxonMetrics={taxonMetrics} />;
}

export { TaxonPageSkeleton } from './taxonKeyPresentation';

const TAXON_QUERY = /* GraphQL */ `
  query Taxon($key: ID!) {
    taxon(key: $key) {
      key
      scientificName
      kingdom
      formattedName(useFallback: true)
      rank
      taxonomicStatus
      publishedIn
      parents {
        rank
        scientificName
        key
      }
      acceptedTaxon {
        key
        formattedName
      }
    }
  }
`;

const SLOW_QUERY = /* GraphQL */ `
  query TaxonSummaryMetrics {
    taxonSearch {
      facet {
        issue {
          name
          count
        }
      }
    }
  }
`;
