import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PublisherLabel } from '@/components/filters/displayNames';
import {
  defaultDateFormatProps,
  DeletedMessage,
  HeaderInfo,
  HeaderInfoEdit,
  HeaderInfoMain,
} from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage, PeopleIcon } from '@/components/highlights';
import { LicenceTag } from '@/components/identifierTag';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { useConfig } from '@/config/config';
import { NotFoundError } from '@/errors';
import {
  DatasetOccurrenceSearchQuery,
  DatasetOccurrenceSearchQueryVariables,
  DatasetQuery,
  DatasetQueryVariables,
  DatasetType,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors, usePartialDataNotification } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { getDatasetSchema } from '@/utils/schemaOrg';
import { createContext, useEffect, useMemo } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
import { Button } from '@/components/ui/button';
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
      publishingOrganization {
        title
        homepage
        logoUrl
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
      keywordCollections {
        thesaurus
        keywords
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
        gbifProject {
          title
          primaryImage {
            ...ArticleBanner
          }
        }
      }
      endpoints {
        key
        type
        url
      }
      identifiers(limit: 50) {
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
      localContexts {
        project_page
        title
        description
        notes {
          name
          img_url
          description
          pageUrl
        }
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
    $eventPredicate: Predicate
    $literaturePredicate: Predicate
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
    withEvents: occurrenceSearch(predicate: $eventPredicate) {
      documents(size: 0) {
        total
      }
    }
    literatureSearchScoped: literatureSearch(predicate: $literaturePredicate) {
      documents {
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

export async function datasetLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<DatasetQuery, DatasetQueryVariables>(DATASET_QUERY, { key });
  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['dataset'],
    errors,
    requiredObjects: [data?.dataset],
  });

  return { errors, data };
}

export const DatasetPageSkeleton = ArticleSkeleton;

export function DatasetPage() {
  const config = useConfig();
  const { errors, data } = useLoaderData() as {
    data: DatasetQuery;
    errors: Array<{ message: string; path: [string] }>;
  };
  const notifyOfPartialData = usePartialDataNotification();
  useEffect(() => {
    if (errors) {
      notifyOfPartialData();
    }
  }, [errors, notifyOfPartialData]);

  if (data.dataset == null) throw new NotFoundError();
  const dataset = data.dataset;
  const deletedAt = dataset.deleted;
  const contactThreshold = 6;
  const contactsCitation = dataset.contactsCitation?.filter((c) => c.abbreviatedName) || [];
  const siteOccurrencePredicate = config?.occurrenceSearch?.scope;

  const {
    data: occData,
    load,
    loading,
  } = useQuery<DatasetOccurrenceSearchQuery, DatasetOccurrenceSearchQueryVariables>(
    OCURRENCE_SEARCH_QUERY,
    {
      throwAllErrors: false,
      lazyLoad: true,
      notifyOnErrors: true,
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
  const withEventId = occData?.withEvents?.documents?.total || 0;
  const occurrenceCountOrZero = occData?.occurrenceSearch?.documents?.total || 0;
  const citationCountOrZero = occData?.literatureSearchScoped?.documents?.total || 0;

  const tabs = useMemo<{ to: string; children: React.ReactNode }[]>(() => {
    const tabsToDisplay: { to: string; children: React.ReactNode }[] = [
      { to: '.', children: <FormattedMessage id="dataset.tabs.about" /> },
    ];
    if (dataset.project) {
      tabsToDisplay.push({
        to: 'project',
        children: <FormattedMessage id="dataset.tabs.project" />,
      });
    }
    if (hasPhylogeny) {
      tabsToDisplay.push({ to: 'phylogenies', children: 'Phylogenies' });
    }
    if (hasTaxonomy) {
      tabsToDisplay.push({ to: 'species', children: 'Species' });
      // tabsToDisplay.push({
      //   to: `${import.meta.env.PUBLIC_CHECKLIST_BANK_WEBSITE}/dataset/gbif-${
      //     dataset.key
      //   }/classification`,
      //   children: (
      //     <>
      //       <SimpleTooltip
      //         title={
      //           <FormattedMessage
      //             id="dataset.exploreInChecklistBank"
      //             defaultMessage="Explore taxonomy via Checklist Bank"
      //           />
      //         }
      //       >
      //         <FormattedMessage id="dataset.tabs.taxonomy" defaultMessage="Taxonomy" />
      //         <MdLink />
      //       </SimpleTooltip>
      //     </>
      //   ),
      // });
    }
    if (config.datasetKey?.showEvents && withEventId > 0) {
      tabsToDisplay.push({
        to: 'events',
        children: <FormattedMessage id="dataset.tabs.events" defaultMessage={'Events'} />,
      });
    }
    if (dataset.type !== DatasetType.Metadata) {
      tabsToDisplay.push({
        to: 'metrics',
        children: <FormattedMessage id="dataset.tabs.metrics" defaultMessage={'Metrics'} />,
      });
    }
    tabsToDisplay.push({
      to: 'download',
      children: <FormattedMessage id="dataset.tabs.download" />,
    });
    return tabsToDisplay;
  }, [
    hasPhylogeny,
    hasTaxonomy,
    withEventId,
    dataset?.type,
    dataset?.project,
    config.datasetKey?.showEvents,
  ]);

  useEffect(() => {
    if (dataset.key === null) return;
    const datasetPredicate = {
      type: PredicateType.Equals,
      key: 'datasetKey',
      value: dataset.key,
    };
    const combinedPredicate = siteOccurrencePredicate
      ? {
          type: PredicateType.And,
          predicates: [datasetPredicate, siteOccurrencePredicate],
        }
      : datasetPredicate;

    const literatureScope = config?.literatureSearch?.scope;
    const literatureDatasetScope = {
      type: PredicateType.Equals,
      key: 'gbifDatasetKey',
      value: dataset.key,
    };
    const literaturePredicate = literatureScope
      ? {
          type: PredicateType.And,
          predicates: [literatureScope, literatureDatasetScope],
        }
      : literatureDatasetScope;
    load({
      variables: {
        predicate: combinedPredicate,
        imagePredicate: {
          type: PredicateType.And,
          predicates: [
            combinedPredicate,
            { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
          ],
        },
        coordinatePredicate: {
          type: PredicateType.And,
          predicates: [
            combinedPredicate,
            { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' },
          ],
        },
        clusterPredicate: {
          type: PredicateType.And,
          predicates: [
            combinedPredicate,
            { type: PredicateType.Equals, key: 'isInCluster', value: 'true' },
          ],
        },
        eventPredicate: {
          type: PredicateType.And,
          predicates: [combinedPredicate, { type: PredicateType.IsNotNull, key: 'eventId' }],
        },
        literaturePredicate,
        size: 1,
        from: 0,
      },
    });
  }, [load, dataset.key, siteOccurrencePredicate, config?.literatureSearch?.scope]);

  return (
    <>
      <PageMetaData
        path={`/dataset/${dataset.key}`}
        title={dataset.title}
        description={dataset.description}
        jsonLd={getDatasetSchema(dataset)}
        noindex={!!dataset?.deleted}
        nofollow={!!dataset?.deleted}
      />
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={dataset?.key?.toString()} />}
        doi={dataset.doi}
      ></DataHeader>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <ArticlePreTitle
              clickable
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
              <DynamicLink pageId="datasetSearch">
                <FormattedMessage id={`dataset.longType.${dataset.type}`} />
              </DynamicLink>
            </ArticlePreTitle>
            {/* it would be nice to know for sure which fields to expect */}
            <ArticleTitle
              dangerouslySetTitle={{ __html: dataset.title || 'No title provided' }}
            ></ArticleTitle>

            <div className="g-mt-2">
              <FormattedMessage id="dataset.publishedBy" />{' '}
              <DynamicLink
                className="hover:g-underline g-text-primary-500"
                to={`/publisher/${dataset.publishingOrganizationKey}`}
                pageId="publisherKey"
                variables={{ key: dataset.publishingOrganizationKey }}
              >
                {dataset?.publishingOrganizationTitle ?? (
                  <PublisherLabel id={dataset.publishingOrganizationKey} />
                )}
              </DynamicLink>
            </div>

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
                  {contactsCitation.length < contactThreshold && (
                    <GenericFeature>
                      <PeopleIcon />
                      <span>{contactsCitation.map((c) => c.abbreviatedName).join(' • ')}</span>
                    </GenericFeature>
                  )}
                  {/* It would be good to show this with a link to the contacts, but how to do that so it also works on e.g. the metrics tab? */}
                  {/* https://github.com/gbif/gbif-web/issues/1360 */}
                  {/* {contactsCitation.length >= contactThreshold && (
                    <FormattedMessage
                      id="counts.nAuthors"
                      values={{ total: contactsCitation.length }}
                    />
                  )} */}
                  <Homepage url={dataset.homepage} />
                  <GenericFeature>
                    <LicenceTag value={dataset.license} />
                  </GenericFeature>
                  {/* <GenericFeature>
                    <DoiTag id={dataset.doi} />
                  </GenericFeature> */}
                </FeatureList>
              </HeaderInfoMain>
              <HeaderInfoEdit className="g-flex g-mt-4 g-gap-2">
                {citationCountOrZero > 0 && (
                  <Button asChild variant="outline" className="g-py-1 g-px-2 g-h-[2rem]">
                    <DynamicLink
                      to="literatureSearch"
                      pageId="literatureSearch"
                      searchParams={{ gbifDatasetKey: dataset.key }}
                    >
                      <span className="g-whitespace-nowrap">
                        <FormattedMessage
                          id="counts.nCitations"
                          values={{ total: citationCountOrZero }}
                        />
                      </span>
                    </DynamicLink>
                  </Button>
                )}
                {(occurrenceCountOrZero > 0 || dataset?.type === 'OCCURRENCE') && (
                  <Button className="g-py-1 g-px-2 g-h-[2rem]" asChild isLoading={loading}>
                    <DynamicLink
                      to="occurrenceSearch"
                      pageId="occurrenceSearch"
                      searchParams={{ datasetKey: dataset.key }}
                    >
                      <span className="g-whitespace-nowrap">
                        <FormattedMessage
                          id="counts.nOccurrences"
                          values={{ total: occurrenceCountOrZero }}
                        />
                      </span>
                    </DynamicLink>
                  </Button>
                )}
              </HeaderInfoEdit>
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
          <ErrorBoundary type="PAGE">
            <Outlet />
          </ErrorBoundary>
        </DatasetKeyContext.Provider>
      </article>
    </>
  );
}
