import { DataHeader } from '@/components/dataHeader';
import {
  defaultDateFormatProps,
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
} from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage, PeopleIcon } from '@/components/highlights';
import { DoiTag, LicenceTag } from '@/components/identifierTag';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { useConfig } from '@/config/config';
import { NotFoundError } from '@/errors';
import {
  DatasetOccurrenceSearchQuery,
  DatasetOccurrenceSearchQueryVariables,
  DatasetQuery,
  DatasetQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
import { createContext, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdLink } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

const DATASET_QUERY = /* GraphQL */ `
  query Dataset($key: ID!) {
    literatureSearch(gbifDatasetKey: [$key]) {
      documents {
        total
      }
    }
    totalTaxa: taxonSearch(datasetKey: [$key], origin: [SOURCE]) {
      count
    }
    accepted: taxonSearch(datasetKey: [$key], origin: [SOURCE], status: [ACCEPTED]) {
      count
    }
    synonyms: taxonSearch(
      datasetKey: [$key]
      origin: [SOURCE]
      status: [SYNONYM, HETEROTYPIC_SYNONYM, PROPARTE_SYNONYM, HOMOTYPIC_SYNONYM]
    ) {
      count
    }
    dataset(key: $key) {
      key
      checklistBankDataset {
        key
      }
      type
      title
      created
      modified
      deleted
      duplicateOfDataset {
        key
        title
      }
      metrics {
        colCoveragePct
        nubCoveragePct
        nubMatchingCount
        colMatchingCount
      }
      pubDate
      description
      purpose
      temporalCoverages
      logoUrl
      publishingOrganizationKey
      publishingOrganizationTitle
      homepage
      additionalInfo
      installation {
        key
        title
        organization {
          key
          title
        }
      }
      volatileContributors {
        key
        firstName
        lastName
        position
        organization
        address
        userId
        email
        phone
        type
        _highlighted
        roles
      }
      contactsCitation {
        key
        abbreviatedName
        firstName
        lastName
        userId
        roles
      }
      geographicCoverages {
        description
        boundingBox {
          minLatitude
          maxLatitude
          minLongitude
          maxLongitude
          globalCoverage
        }
      }
      taxonomicCoverages {
        description
        coverages {
          scientificName
          commonName
          rank {
            interpreted
          }
        }
      }
      bibliographicCitations {
        identifier
        text
      }
      samplingDescription {
        studyExtent
        sampling
        qualityControl
        methodSteps
      }
      dataDescriptions {
        charset
        name
        format
        formatVersion
        url
      }
      citation {
        text
      }
      license
      project {
        title
        abstract
        studyAreaDescription
        designDescription
        funding
        contacts {
          firstName
          lastName

          organization
          position
          roles
          type

          address
          city
          postalCode
          province
          country

          homepage
          email
          phone
          userId
        }
        identifier
      }
      endpoints {
        key
        type
        url
      }
      identifiers {
        key
        type
        identifier
      }
      doi
      machineTags {
        namespace
        name
        value
      }
      gridded {
        percent
      }
    }
  }
`;

const OCURRENCE_SEARCH_QUERY = /* GraphQL */ `
  query DatasetOccurrenceSearch(
    $from: Int
    $size: Int
    $predicate: Predicate
    $imagePredicate: Predicate
    $coordinatePredicate: Predicate
    $clusterPredicate: Predicate
  ) {
    occurrenceSearch(predicate: $predicate) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          dynamicProperties
        }
      }
    }
    withImages: occurrenceSearch(predicate: $imagePredicate) {
      documents(size: 0) {
        total
      }
    }
    withCoordinates: occurrenceSearch(predicate: $coordinatePredicate) {
      documents(size: 0) {
        total
      }
    }
    withClusters: occurrenceSearch(predicate: $clusterPredicate) {
      documents(size: 0) {
        total
      }
    }
  }
`;

// create context to pass data to children
export const DatasetKeyContext = createContext<{
  key?: string;
  datasetKey?: string;
  dynamicProperties?: string;
  contentMetrics?: DatasetOccurrenceSearchQuery;
}>({});

export function datasetLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<DatasetQuery, DatasetQueryVariables>(DATASET_QUERY, { key });
}

export const DatasetPageSkeleton = ArticleSkeleton;

export function DatasetPage() {
  const config = useConfig();
  const { data } = useLoaderData() as { data: DatasetQuery };

  if (data.dataset == null) throw new NotFoundError();
  const dataset = data.dataset;
  const deletedAt = dataset.deleted;
  const contactThreshold = 6;
  const contactsCitation = dataset.contactsCitation?.filter((c) => c.abbreviatedName) || [];

  const {
    data: occData,
    error,
    load,
    loading,
  } = useQuery<DatasetOccurrenceSearchQuery, DatasetOccurrenceSearchQueryVariables>(
    OCURRENCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  // check for various tabs
  let hasPhylogeny = false;
  if (occData?.occurrenceSearch?.documents?.results?.[0]?.dynamicProperties) {
    try {
      const parsedDynamicProperties = JSON.parse(
        occData?.occurrenceSearch?.documents?.results?.[0]?.dynamicProperties
      );
      if (parsedDynamicProperties?.phylogenies?.[0]?.phyloTreeFileName)
        // is there a phylogeny by convention
        hasPhylogeny = true;
    } catch (error) {
      // ignore parsing errors. it just means that the dynamicProperties are not a JSON object
      hasPhylogeny = false;
    }
  }
  const hasTaxonomy = !!dataset?.checklistBankDataset?.key;
  const hasOccurrences = !!(
    !config?.datasetKey?.disableInPageOccurrenceSearch &&
    occData?.occurrenceSearch?.documents?.total
  );
  const hasLiterature = data?.literatureSearch?.documents?.total > 0;

  const tabs = useMemo<{ to: string; children: React.ReactNode }[]>(() => {
    const tabsToDisplay: { to: string; children: React.ReactNode }[] = [
      { to: '.', children: 'About' },
    ];
    if (
      (dataset?.type === 'OCCURRENCE' || hasOccurrences) &&
      !config?.datasetKey?.disableInPageOccurrenceSearch
    ) {
      tabsToDisplay.push({ to: 'occurrences', children: 'Occurrences' });
    }
    if (hasPhylogeny) {
      tabsToDisplay.push({ to: 'phylogeny', children: 'Phylogenies' });
    }
    if (hasTaxonomy) {
      tabsToDisplay.push({
        to: `${import.meta.env.PUBLIC_CHECKLIST_BANK_WEBSITE}/dataset/gbif-${
          dataset.key
        }/classification`,
        children: (
          <>
            <SimpleTooltip
              title={
                <FormattedMessage
                  id="dataset.exploreInChecklistBank"
                  defaultMessage="Explore taxonomy via Checklist Bank"
                />
              }
            >
              <FormattedMessage id="dataset.exploreInChecklistBank" defaultMessage="Taxonomy" />
              <MdLink />
            </SimpleTooltip>
          </>
        ),
      });
    }
    if (hasLiterature) tabsToDisplay.push({ to: 'citations', children: 'Citations' });
    tabsToDisplay.push({ to: 'download', children: 'Download' });
    return tabsToDisplay;
  }, [
    hasPhylogeny,
    hasTaxonomy,
    hasOccurrences,
    dataset?.key,
    dataset?.type,
    config?.datasetKey?.disableInPageOccurrenceSearch,
  ]);

  useEffect(() => {
    if (dataset.key === null) return;
    const datasetPredicate = {
      type: PredicateType.Equals,
      key: 'datasetKey',
      value: dataset.key,
    };
    load({
      variables: {
        predicate: datasetPredicate,
        imagePredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
          ],
        },
        coordinatePredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' },
          ],
        },
        clusterPredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'isInCluster', value: 'true' },
          ],
        },
        size: 1,
        from: 0,
      },
    });
  }, [load, dataset.key]);

  return (
    <>
      <Helmet>
        <title>{dataset.title}</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={dataset?.key?.toString()} />}
        // doi={dataset.doi}
      ></DataHeader>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <ArticlePreTitle
              secondary={
                <FormattedMessage
                  id="dataset.registeredDate"
                  values={{
                    DATE: (
                      <FormattedDate
                        value={dataset.created ?? undefined}
                        {...defaultDateFormatProps}
                      />
                    ),
                  }}
                />
              }
            >
              <FormattedMessage id={`dataset.longType.${dataset.type}`} />
            </ArticlePreTitle>
            {/* it would be nice to know for sure which fields to expect */}
            <ArticleTitle
              dangerouslySetTitle={{ __html: dataset.title || 'No title provided' }}
            ></ArticleTitle>

            {dataset.publishingOrganizationTitle && (
              <div className="g-mt-2">
                <FormattedMessage id="dataset.publishedBy" />{' '}
                <DynamicLink
                  className="hover:g-underline g-text-primary-500"
                  to={`/publisher/${dataset.publishingOrganizationKey}`}
                  pageId="publisherKey"
                  variables={{ key: dataset.publishingOrganizationKey }}
                >
                  {dataset?.publishingOrganizationTitle}
                </DynamicLink>
              </div>
            )}

            {deletedAt && <DeletedMessage date={deletedAt} />}

            {/* It would be great if we could point from a deleted dataset to the version it has been replaced with. But duplicates only exist in the API the opposite direction. So for now I've disabled this */}
            {/* {dataset.duplicateOfDataset && (
              <ErrorMessage>
                <FormattedMessage
                  id="phrases.replacedBy"
                  values={{
                    newItem: (
                      <DynamicLink
                        className="g-me-4"
                        to={`/dataset/${dataset.duplicateOfDataset.key}`}
                        pageId="datasetKey"
                        variables={{ key: dataset.duplicateOfDataset.key }}
                      >
                        {dataset.duplicateOfDataset.title}
                      </DynamicLink>
                    ),
                  }}
                />
              </ErrorMessage>
            )} */}

            <HeaderInfo>
              <HeaderInfoMain>
                <FeatureList>
                  {contactsCitation.length > 0 && (
                    <GenericFeature>
                      <PeopleIcon />
                      {contactsCitation.length < contactThreshold && (
                        <span>{contactsCitation.map((c) => c.abbreviatedName).join(' • ')}</span>
                      )}
                      {contactsCitation.length >= contactThreshold && (
                        <FormattedMessage
                          id="counts.nAuthors"
                          values={{ total: contactsCitation.length }}
                        />
                      )}
                    </GenericFeature>
                  )}
                  <Homepage url={dataset.homepage} />
                  <GenericFeature>
                    <LicenceTag value={dataset.license} />
                  </GenericFeature>
                  <GenericFeature>
                    <DoiTag id={dataset.doi} />
                  </GenericFeature>
                </FeatureList>
              </HeaderInfoMain>
            </HeaderInfo>
            <div className="g-border-b g-mt-4"></div>
            <Tabs links={tabs} />
          </ArticleTextContainer>
        </PageContainer>
        <DatasetKeyContext.Provider
          value={{
            datasetKey: data?.dataset?.key,
            dynamicProperties:
              occData?.occurrenceSearch?.documents?.results?.[0]?.dynamicProperties || undefined,
            contentMetrics: occData,
          }}
        >
          <Outlet />
        </DatasetKeyContext.Provider>
      </article>
    </>
  );
}
