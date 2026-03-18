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
import { useLink } from '@/reactRouterPlugins/dynamicLink';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { useEffect } from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { NonBackbonePresentation, TaxonKey as Presentation } from './taxonKeyPresentation';
import { NotFoundError } from '@/errors';

const primaryChecklist = '7ddf754f-d193-4cc9-b351-99906754a03b'; // TODO taxonapi: move to env file

export async function taxonLoader({ params, graphql, locale }: LoaderArgs) {
  const key = params.taxonKey || (params.key as string);
  const response = await graphql.query<TaxonKeyQuery, TaxonKeyQueryVariables>(TAXON_QUERY, {
    key,
    datasetKey: primaryChecklist,
    language: locale?.iso3LetterCode ?? 'eng', // TODO taxonapi: get from user preferences
  });

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['taxonInfo.taxon'],
    errors,
    requiredObjects: [data?.taxonInfo?.taxon],
  });

  return { errors, data };
}

export function TaxonKey() {
  const { data } = useLoaderData() as { data: TaxonKeyQuery };
  const createLink = useLink();

  if (data?.taxonInfo?.taxon?.datasetKey === primaryChecklist) {
    // TODO taxonapi hardcoded main taxonomy
    return <BackboneTaxon />;
  } else {
    // let { to } = createLink({
    //   pageId: 'datasetKey',
    //   variables: { key: `${data?.taxon?.datasetKey}/species/${data?.taxon?.key}` },
    // });
    // if (!to) to = `/dataset/${data?.taxon?.datasetKey}/species/${data?.taxon?.key}`;
    // return <Navigate to={to} />;
  }
}

const BackboneTaxon = () => {
  const { data } = useLoaderData() as { data: TaxonKeyQuery }; // TODO I do not get why this data isn't just passed as a prop from the parent route
  const { locale } = useI18n();
  const {
    data: slowTaxon,
    load: slowTaxonLoad,
    loading: slowTaxonLoading,
  } = useQuery<SlowTaxonQuery, SlowTaxonQueryVariables>(SLOW_TAXON, {
    lazyLoad: true,
    throwAllErrors: false,
  });

  useEffect(() => {
    const id = data.taxonInfo?.taxon?.taxonID;
    if (typeof id !== 'undefined') {
      slowTaxonLoad({
        variables: {
          language: locale?.iso3LetterCode ?? 'eng',
          key: id.toString(),
          datasetKey: primaryChecklist,
        },
      });
    }
  }, [data.taxonInfo?.taxon?.taxonID, locale, slowTaxonLoad]);

  if (data?.taxonInfo == null) throw new NotFoundError();
  return <Presentation data={data} slowTaxon={slowTaxon} slowTaxonLoading={slowTaxonLoading} />;
};

export const NonBackboneTaxon = ({ headLess = false }) => {
  const { data } = useLoaderData() as { data: TaxonKeyQuery };

  const {
    data: slowTaxon,
    load: slowTaxonLoad,
    loading: slowTaxonLoading,
  } = useQuery<NonBackboneSlowTaxonQuery, NonBackboneSlowTaxonQueryVariables>(
    NON_BACKBONE_SLOW_TAXON,
    {
      lazyLoad: true,
      throwAllErrors: false,
    }
  );

  useEffect(() => {
    const id = data.taxonInfo?.taxon?.taxonID;
    if (typeof id !== 'undefined') {
      slowTaxonLoad({
        variables: {
          key: id.toString(),
          datasetKey: primaryChecklist,
        },
      });
    }
  }, [data.taxonInfo?.taxon?.taxonID, slowTaxonLoad]);
  return (
    <NonBackbonePresentation
      headLess={headLess}
      data={data}
      slowTaxon={slowTaxon}
      slowTaxonLoading={slowTaxonLoading}
    />
  );
};

export { TaxonPageSkeleton } from './taxonKeyPresentation';

const TAXON_QUERY = /* GraphQL */ `
  query TaxonKey($key: ID!, $datasetKey: ID!, $language: String) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
      taxon {
        datasetKey
        taxonID
        taxonRank
        scientificName
        taxonomicStatus
        label
        references
        acceptedNameUsageID
        namePublishedIn
        sourceID
        dataset {
          key
          title
        }
        acceptedTaxon {
          taxonID
          label
          scientificName
        }
        occurrenceMedia {
          count
          results {
            occurrenceKey
            identifier
            thumbor
          }
        }
        relatedInfo {
          griis {
            datasetKey
            taxonID
            locality
            countryCode
            establishmentMeans
            pathway
            dataset {
              title
            }
            isCountry
          }
          redlist {
            taxonID
            scientificName
            threatStatus
          }
        }
      }
      synonyms {
        homotypic {
          taxonID
          label
        }
        heterotypic {
          taxonID
          label
        }
      }
      vernacularNames {
        vernacularName
        language
      }
      vernacularName(language: $language) {
        vernacularName
      }
      classification {
        taxonID
        scientificName
        scientificNameAuthorship
        taxonRank
      }
      # key
      # nubKey
      # sourceTaxon {
      #   key
      #   references
      #   datasetKey
      #   dataset {
      #     title
      #   }
      # }
      # issues
      # scientificName
      # canonicalName
      # origin
      # kingdom
      # formattedName(useFallback: true)
      # rank
      # taxonomicStatus
      # publishedIn
      # references
      # datasetKey
      # speciesCount
      # distributionsCount: distributions(limit: 10, offset: 0) {
      #   results {
      #     taxonKey
      #   }
      # }
      # iucnStatus {
      #   references
      #   distribution {
      #     taxonKey
      #     threatStatus
      #   }
      # }
      # dataset {
      #   title
      #   key
      #   citation {
      #     text
      #     citationProvidedBySource
      #   }
      # }
      # vernacular: vernacularNames(limit: 100, offset: 0) {
      #   results {
      #     taxonKey
      #     language
      #     vernacularName
      #   }
      # }
      # parents {
      #   rank
      #   scientificName
      #   canonicalName
      #   formattedName
      #   key
      # }
      # acceptedTaxon {
      #   key
      #   formattedName
      #   scientificName
      # }
      # synonyms(limit: 100, offset: 0) {
      #   results {
      #     key
      #     scientificName
      #     canonicalName
      #     authorship
      #     rank
      #     publishedIn
      #   }
      # }
      # imagesCount: occurrenceMedia(limit: 0, offset: 0) {
      #   count
      # }
    }
  }
`;

const SLOW_TAXON = /* GraphQL */ `
  query SlowTaxon($key: ID!, $datasetKey: ID!) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
      taxon {
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
  }
`;

const NON_BACKBONE_SLOW_TAXON = /* GraphQL */ `
  query NonBackboneSlowTaxon($key: ID!, $datasetKey: ID!) {
    taxon: taxonInfo(key: $key, datasetKey: $datasetKey) {
      group
      # key
      # nubKey
      # scientificName
      # kingdom
      # formattedName(useFallback: true)
      # rank
      # taxonomicStatus
      # publishedIn
      # media {
      #   limit
      #   endOfRecords
      #   results {
      #     identifier
      #     creator
      #     rightsHolder
      #   }
      # }
      # dataset {
      #   citation {
      #     text
      #     citationProvidedBySource
      #   }
      # }
      # vernacular: vernacularNames(limit: 10, offset: 0) {
      #   results {
      #     taxonKey
      #   }
      # }
      # parents {
      #   rank
      #   scientificName
      #   key
      # }
      # acceptedTaxon {
      #   key
      #   formattedName
      #   scientificName
      # }
      # combinations {
      #   key
      #   nameKey
      #   acceptedKey
      #   canonicalName
      #   authorship
      #   scientificName
      #   formattedName
      #   rank
      #   taxonomicStatus
      #   numDescendants
      # }
      # synonyms(limit: 100, offset: 0) {
      #   limit
      #   offset
      #   endOfRecords
      #   results {
      #     key
      #     nameKey
      #     acceptedKey
      #     canonicalName
      #     authorship
      #     scientificName
      #     formattedName
      #     rank
      #     taxonomicStatus
      #     numDescendants
      #   }
      # }
    }
  }
`;
