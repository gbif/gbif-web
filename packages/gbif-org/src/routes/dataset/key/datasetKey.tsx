import { DynamicLink } from '@/components/dynamicLink';
import {
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
  defaultDateFormatProps,
} from '@/components/headerComponents';
import { Homepage, FeatureList, GenericFeature, PeopleIcon } from '@/components/highlights';
import { LicenceTag } from '@/components/identifierTag';
import { Tabs } from '@/components/tabs';
import { DatasetQuery, DatasetQueryVariables } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';

const DATASET_QUERY = /* GraphQL */ `
  query Dataset($key: ID!) {
    literatureSearch(gbifDatasetKey: [$key]) {
      documents {
        total
      }
    }
    totalTaxa: taxonSearch(datasetKey: [$key], origin: [SOURCE]){
      count
    }
    accepted: taxonSearch(datasetKey: [$key], origin: [SOURCE], status: [ACCEPTED]){
      count
    }
    synonyms: taxonSearch(datasetKey: [$key], origin: [SOURCE], status: [SYNONYM, HETEROTYPIC_SYNONYM, PROPARTE_SYNONYM, HOMOTYPIC_SYNONYM]){
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
      }
      gridded {
        percent
      }
    }
  }
`;

export function datasetLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<DatasetQuery, DatasetQueryVariables>(DATASET_QUERY, { key });
}

export const DatasetPageSkeleton = ArticleSkeleton;

export function DatasetPage() {
  const { data } = useLoaderData() as { data: DatasetQuery };

  if (data.dataset == null) throw new Error('404');
  const dataset = data.dataset;

  const deletedAt = dataset.deleted;
  const contactThreshold = 6;
  const contactsCitation = dataset.contactsCitation?.filter((c) => c.abbreviatedName) || [];

  return (
    <article>
      <Helmet>
        <title>{dataset.title}</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>

      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className='g-max-w-screen-xl'>
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
            <div className='g-mt-2'>
              <FormattedMessage id="dataset.publishedBy" />{' '}
              <DynamicLink
                className='hover:g-underline g-text-primary-500'
                to={`/publisher/${dataset.publishingOrganizationKey}`}
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
          <div className='g-border-b g-mt-4'></div>
          <Tabs
            links={[
              { to: '.', children: 'About' },
              { to: 'occurrences', children: 'Occurrences' },
              { to: 'download', children: 'Download' },
              // { to: 'citations', children: 'Citations' },
            ]}
          />
        </ArticleTextContainer>
      </PageContainer>

      <Outlet />
    </article>
  );
}
