import { DataHeader } from '@/components/dataHeader';
import {
  defaultDateFormatProps,
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
} from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage, PeopleIcon } from '@/components/highlights';
import { LicenceTag } from '@/components/identifierTag';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { NotFoundError } from '@/errors';
import {
  DatasetOccurrenceSearchQuery,
  DatasetOccurrenceSearchQueryVariables,
  DatasetQuery,
  DatasetQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
import { createContext, useEffect, useState } from 'react';
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

/* const FIRST_OCCURRENCE_QUERY = `
  query firstOcc($predicate: Predicate){
   occurrenceSearch(predicate: $predicate) {
    documents(size: 1) {
      results {
        dynamicProperties
      }
    }
}
}`; */
const OCURRENCE_SEARCH_QUERY = /* GraphQL */ `
  query DatasetOccurrenceSearch($from: Int, $size: Int, $predicate: Predicate) {
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
  }
`;

export const DatasetKeyContext = createContext<{
  key?: string;
  datasetKey?: string;
  dynamicProperties?: string;
}>({});

export function datasetLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<DatasetQuery, DatasetQueryVariables>(DATASET_QUERY, { key });
}

export const DatasetPageSkeleton = ArticleSkeleton;

export function DatasetPage() {
  const { data } = useLoaderData() as { data: DatasetQuery };
  const [tabs, setTabs] = useState<{ to: string; children: React.ReactNode }[]>([
    { to: '.', children: 'About' },
    { to: 'occurrences', children: 'Occurrences' },
    { to: 'download', children: 'Download' },
  ]);
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

  useEffect(() => {
    load({
      variables: {
        predicate: {
          key: 'datasetKey',
          value: dataset.key,
          type: 'equals',
        },
        size: 1,
        from: 0,
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if (
      occData?.occurrenceSearch?.documents?.results?.[0]?.dynamicProperties &&
      !tabs.find((t) => t.to.includes('phylogenies'))
    ) {
      try {
        const parsedDynamicProperties = JSON.parse(
          occData?.occurrenceSearch?.documents?.results?.[0]?.dynamicProperties
        );
        if (parsedDynamicProperties?.phylogenies?.[0]?.phyloTreeFileName) {
          console.log('pushing phylogenies');
          //tabs.push({ to: 'phylogenies', children: 'Phylogenies' });
          tabs.splice(2, 0, { to: 'phylogenies', children: 'Phylogenies' });
          setTabs([...tabs]);
        }
      } catch (error) {
        /* empty */
      }
    }
  }, [occData, error, dataset.key, tabs]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if (dataset?.checklistBankDataset?.key && !tabs.find((t) => t.to.includes('classification'))) {
      tabs.splice(2, 0, {
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
      setTabs([...tabs]);
    }
  }, [occData, error, dataset.key, dataset?.checklistBankDataset?.key, tabs]);

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
      ></DataHeader>
      <article>
        <PageContainer topPadded className="g-bg-white">
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
          }}
        >
          <Outlet />
        </DatasetKeyContext.Provider>
      </article>
    </>
  );
}
