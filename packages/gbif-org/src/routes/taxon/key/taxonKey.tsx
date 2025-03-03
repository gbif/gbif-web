import { NotFoundError } from '@/errors';
import {
  NonBackboneSlowTaxonQuery,
  NonBackboneSlowTaxonQueryVariables,
  SlowTaxonQuery,
  SlowTaxonQueryVariables,
  TaxonKeyQuery,
  TaxonKeyQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs, useI18n } from '@/reactRouterPlugins';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { NonBackbonePresentation, TaxonKey as Presentation } from './taxonKeyPresentation';
import { imagePredicate, typeSpecimenPredicate } from './taxonUtil';

export async function taxonLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<TaxonKeyQuery, TaxonKeyQueryVariables>(TAXON_QUERY, {
    key,
    predicate: typeSpecimenPredicate(Number(key)),
    imagePredicate: imagePredicate(Number(key)),
  });
}

export function TaxonKey() {
  const { data } = useLoaderData() as { data: TaxonKeyQuery };

  return data?.taxon?.nubKey === data?.taxon?.key ? <BackboneTaxon /> : <NonBackboneTaxon />;
}

const BackboneTaxon = () => {
  const { data } = useLoaderData() as { data: TaxonKeyQuery };
  const { locale } = useI18n();
  const {
    data: slowTaxon,
    load: slowTaxonLoad,
    loading: slowTaxonLoading,
  } = useQuery<SlowTaxonQuery, SlowTaxonQueryVariables>(SLOW_TAXON, {
    lazyLoad: true,
    throwAllErrors: true,
  });
  /* const { data: taxonMetrics, load: slowLoad } = useQuery<
    TaxonSummaryMetricsQuery,
    TaxonSummaryMetricsQueryVariables
  >(SLOW_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  }); */

  useEffect(() => {
    const id = data.taxon?.key;
    if (typeof id !== 'undefined') {
      slowTaxonLoad({
        variables: {
          language: locale?.iso3LetterCode ?? 'eng',
          key: id.toString(),
        },
      });
    }
  }, [data?.taxon?.key]);

  if (data?.taxon == null) throw new NotFoundError();
  return <Presentation data={data} slowTaxon={slowTaxon} slowTaxonLoading={slowTaxonLoading} />;
};

const NonBackboneTaxon = () => {
  const { data } = useLoaderData() as { data: TaxonKeyQuery };
  const { locale } = useI18n();

  const {
    data: slowTaxon,
    load: slowTaxonLoad,
    loading: slowTaxonLoading,
  } = useQuery<NonBackboneSlowTaxonQuery, NonBackboneSlowTaxonQueryVariables>(
    NON_BACKBONE_SLOW_TAXON,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );
  /* const { data: taxonMetrics, load: slowLoad } = useQuery<
    TaxonSummaryMetricsQuery,
    TaxonSummaryMetricsQueryVariables
  >(SLOW_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  }); */

  useEffect(() => {
    const id = data.taxon?.key;
    if (typeof id !== 'undefined') {
      slowTaxonLoad({
        variables: {
          language: locale?.iso3LetterCode ?? 'eng',
          key: id.toString(),
        },
      });
    }
  }, [data?.taxon?.key]);
  return (
    <NonBackbonePresentation
      data={data}
      slowTaxon={slowTaxon}
      slowTaxonLoading={slowTaxonLoading}
    />
  );
};

export { TaxonPageSkeleton } from './taxonKeyPresentation';

const TAXON_QUERY = /* GraphQL */ `
  query TaxonKey($key: ID!, $predicate: Predicate, $imagePredicate: Predicate) {
    taxon(key: $key) {
      key
      nubKey
      scientificName
      kingdom
      formattedName(useFallback: true)
      rank
      taxonomicStatus
      publishedIn
      dataset {
        citation {
          text
          citationProvidedBySource
        }
      }
      vernacularCount: vernacularNames(limit: 10, offset: 0) {
        results {
          taxonKey
        }
      }
      parents {
        rank
        scientificName
        key
      }
      acceptedTaxon {
        key
        formattedName
        scientificName
      }
      synonyms(limit: 10, offset: 0) {
        results {
          key
        }
      }
    }
    imagesCount: occurrenceSearch(predicate: $imagePredicate) {
      documents(size: 0) {
        total
      }
    }
    typesSpecimenCount: occurrenceSearch(predicate: $predicate) {
      documents(from: 0, size: 0) {
        total
      }
    }
  }
`;

const SLOW_TAXON = /* GraphQL */ `
  query SlowTaxon($key: ID!, $language: String) {
    taxon(key: $key) {
      key
      basionymKey
      vernacularNames(limit: 1, language: $language) {
        results {
          vernacularName
          source
        }
      }
      combinations {
        key
        nameKey
        acceptedKey
        canonicalName
        authorship
        scientificName
        formattedName
        rank
        taxonomicStatus
        numDescendants
      }
      synonyms(limit: 100, offset: 0) {
        limit
        offset
        endOfRecords
        results {
          key
          nameKey
          acceptedKey
          canonicalName
          authorship
          scientificName
          formattedName
          rank
          taxonomicStatus
          numDescendants
        }
      }
      wikiData {
        source {
          id
          url
        }
        identifiers {
          id
          label
          description
          url
        }
      }
    }
  }
`;

const NON_BACKBONE_SLOW_TAXON = /* GraphQL */ `
  query NonBackboneSlowTaxon($key: ID!) {
    taxon(key: $key) {
      key
      nubKey
      scientificName
      kingdom
      formattedName(useFallback: true)
      rank
      taxonomicStatus
      publishedIn
      media {
        limit
        endOfRecords
        results {
          identifier
          creator
          rightsHolder
        }
      }
      dataset {
        citation {
          text
          citationProvidedBySource
        }
      }
      vernacularCount: vernacularNames(limit: 10, offset: 0) {
        results {
          taxonKey
        }
      }
      parents {
        rank
        scientificName
        key
      }
      acceptedTaxon {
        key
        formattedName
        scientificName
      }
      combinations {
        key
        nameKey
        acceptedKey
        canonicalName
        authorship
        scientificName
        formattedName
        rank
        taxonomicStatus
        numDescendants
      }
      synonyms(limit: 100, offset: 0) {
        limit
        offset
        endOfRecords
        results {
          key
          nameKey
          acceptedKey
          canonicalName
          authorship
          scientificName
          formattedName
          rank
          taxonomicStatus
          numDescendants
        }
      }
    }
  }
`;
