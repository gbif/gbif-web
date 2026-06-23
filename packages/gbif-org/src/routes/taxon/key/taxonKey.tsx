import {
  SlowTaxonQuery,
  SlowTaxonQueryVariables,
  TaxonKeyQuery,
  TaxonKeyQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs, useI18n } from '@/reactRouterPlugins';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { NonBackbonePresentation, TaxonKey as Presentation } from './taxonKeyPresentation';
import { NotFoundError } from '@/errors';
import { useConfig } from '@/config/config';

const primaryChecklist = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;

export async function taxonLoader({ params, graphql, locale, config }: LoaderArgs) {
  const key = params.key as string;
  const response = await graphql.query<TaxonKeyQuery, TaxonKeyQueryVariables>(TAXON_QUERY, {
    key,
    datasetKey: config.taxonSearch?.checklistKey ?? primaryChecklist,
    language: locale?.iso3LetterCode ?? 'eng',
    colDatasetKey: import.meta.env.PUBLIC_COL_CHECKLIST_KEY,
  });

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['taxonInfo'],
    errors,
    requiredObjects: [data?.taxonInfo],
  });

  return { errors, data };
}

export async function datasetTaxonLoader({ params, graphql, locale }: LoaderArgs) {
  const key = params.taxonKey as string;
  const response = await graphql.query<TaxonKeyQuery, TaxonKeyQueryVariables>(TAXON_QUERY, {
    key,
    datasetKey: params.key as string,
    language: locale?.iso3LetterCode ?? 'eng',
    colDatasetKey: import.meta.env.PUBLIC_COL_CHECKLIST_KEY,
  });

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['taxonInfo'],
    errors,
    requiredObjects: [data?.taxonInfo],
  });

  return { errors, data };
}

export function TaxonKey() {
  const config = useConfig();
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
    const id = data.taxonInfo?.taxonID;
    if (typeof id !== 'undefined') {
      slowTaxonLoad({
        variables: {
          key: id.toString(),
          datasetKey: config.taxonSearch?.checklistKey ?? primaryChecklist,
        },
      });
    }
  }, [data.taxonInfo?.taxonID, locale, slowTaxonLoad, config]);

  if (data?.taxonInfo == null) throw new NotFoundError();
  return <Presentation data={data} slowTaxon={slowTaxon} slowTaxonLoading={slowTaxonLoading} />;
}

export const NonBackboneTaxon = () => {
  const { data } = useLoaderData() as { data: TaxonKeyQuery };
  return <NonBackbonePresentation data={data} />;
};

export { TaxonPageSkeleton } from './taxonKeyPresentation';

const TAXON_QUERY = /* GraphQL */ `
  query TaxonKey($key: ID!, $datasetKey: ID!, $language: String, $colDatasetKey: ID!) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
      group: taxonomicGroup
      checklistbankURL
      groupIconSVG
      datasetKey
      taxonID
      taxonRank
      scientificName
      taxonomicStatus
      label
      references
      acceptedNameUsageID
      acceptedTaxon {
        taxonID
        label
        scientificName
      }
      occurrenceMedia(limit: 20) {
        count
        results {
          occurrenceKey
          identifier
          license
          rightsHolder
          thumbor(height: 800)
        }
      }
      treatments: related(datasetType: ARTICLE) {
        taxonID
        datasetKey
        references
      }
      relatedColEntries: related(datasetKey: [$colDatasetKey]) {
        taxonID
      }
      relatedInfo {
        griis {
          datasetKey
          taxonID
          locality
          countryCode
          isInvasive
          isCountry
        }
        redlist {
          taxonID
          scientificName
          threatStatus
          references
        }
      }
      synonyms {
        homotypic {
          taxonID
          label
          isOriginalNameUsage
        }
        heterotypic {
          taxonID
          label
          isOriginalNameUsage
        }
      }
      media {
        identifier
        title
        references
        type
        creator
        license
      }
      vernacularNames {
        vernacularName
        language
      }
      bibliography {
        referenceID
        doi
        citation
        remarks
        isNamePublishedIn
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
    }
  }
`;

const SLOW_TAXON = /* GraphQL */ `
  query SlowTaxon($key: ID!, $datasetKey: ID!) {
    taxonInfo(key: $key, datasetKey: $datasetKey) {
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
