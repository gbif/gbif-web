import { DataHeader } from '@/components/dataHeader';
import { ErrorMessage } from '@/components/errorMessage';
import { DeletedMessage, HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { LongDate } from '@/components/dateFormats';
import {
  CitationIcon,
  FeatureList,
  GenericFeature,
  GenericFeatureSkeleton,
  Homepage,
  OccurrenceIcon,
} from '@/components/highlights';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  PublisherQuery,
  PublisherQueryVariables,
  PublisherStatsQuery,
  PublisherStatsQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { isPositiveNumber } from '@/utils/isPositiveNumber';

const PUBLISHER_QUERY = /* GraphQL */ `
  query Publisher($key: ID!) {
    publisher: organization(key: $key) {
      key
      title
      description
      deleted
      created
      homepage
      numPublishedDatasets
      logoUrl: thumborLogoUrl(height: 500, width: 500, fitIn: true)

      latitude
      longitude
      address
      city
      country
      email
      phone
      postalCode
      province

      endorsingNode {
        title
        participant {
          id
          name
          type
          countryCode
        }
      }
      endorsingNodeKey
      endorsementApproved

      installation {
        count
        results {
          key
          title
        }
      }

      contacts {
        key
        type
        firstName
        lastName
        email
        phone
        homepage
        organization
        roles
        userId
      }
    }
  }
`;

const SLOW_PUBLISHER_QUERY = /* GraphQL */ `
  query PublisherStats($key: ID!, $jsonKey: JSON!) {
    occurrenceSearch(predicate: { type: equals, key: "publishingOrg", value: $jsonKey }) {
      documents(size: 0) {
        total
      }
    }
    hostedDatasets: datasetSearch(hostingOrg: [$key]) {
      facet {
        publishingOrg(limit: 5000) {
          count
        }
        publishingCountry(limit: 5000) {
          count
        }
      }
      count
    }

    hostedOccurrences: occurrenceSearch(
      predicate: { type: equals, key: "hostingOrganizationKey", value: $jsonKey }
    ) {
      documents(size: 0) {
        total
      }
    }
    literatureSearch(publishingOrganizationKey: [$key]) {
      documents {
        total
      }
    }
  }
`;

export async function publisherLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<PublisherQuery, PublisherQueryVariables>(PUBLISHER_QUERY, {
    key,
  });

  const { errors, data } = await response.json();

  throwCriticalErrors({
    path404: ['publisher'],
    errors,
    requiredObjects: [data?.publisher],
  });

  // throwCriticalErrors will throw if the publisher is not found, so we can safely assume it exists with !
  return { errors, publisher: data!.publisher! };
}

export type PublisherKeyLoaderResult = Awaited<ReturnType<typeof publisherLoader>>;

export function PublisherPage() {
  const { toast } = useToast();
  const { publisher, errors } = useLoaderData() as PublisherKeyLoaderResult;

  const {
    data: slowData,
    load,
    error,
  } = useQuery<PublisherStatsQuery, PublisherStatsQueryVariables>(SLOW_PUBLISHER_QUERY);

  // Load slow data
  useEffect(() => {
    load({ variables: { key: publisher.key, jsonKey: publisher.key } });
  }, [publisher, load]);

  const intl = useIntl();

  useEffect(() => {
    if (errors) {
      toast({
        title: intl.formatMessage({ id: 'phrases.unableToLoadAllContent' }),
        variant: 'destructive',
      });
    }
  }, [errors, toast, intl]);

  const { occurrenceSearch, hostedDatasets, literatureSearch, hostedOccurrences } = slowData ?? {};

  const deletedAt = publisher.deleted;

  const tabs = [{ to: '.', children: <FormattedMessage id="publisher.tabs.aboutPublisher" /> }];
  // only add occurrence tab if there are occurrences
  if (occurrenceSearch?.documents.total > 0) {
    tabs.push({ to: 'metrics', children: <FormattedMessage id="publisher.tabs.metrics" /> });
  }

  return (
    <article>
      <PageMetaData
        path={`/publisher/${publisher.key}`}
        title={publisher.title}
        description={publisher.description}
        noindex={!!deletedAt}
        nofollow={!!deletedAt}
        imageUrl={publisher.logoUrl}
      />
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={publisher?.key?.toString()} />}
      />

      <PageContainer topPadded hasDataHeader className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle
            clickable
            secondary={
              !publisher.created ? null : (
                <FormattedMessage
                  id="publisher.header.sinceDate"
                  values={{
                    DATE: <LongDate value={publisher.created} />,
                  }}
                />
              )
            }
          >
            <DynamicLink pageId="publisherSearch">
              <FormattedMessage id={`publisher.header.publisher`} />
            </DynamicLink>
          </ArticlePreTitle>
          {/* it would be nice to know for sure which fields to expect */}
          <ArticleTitle dangerouslySetTitle={{ __html: publisher.title || 'No title provided' }} />

          {deletedAt && <DeletedMessage date={deletedAt} />}
          {!deletedAt && !publisher.endorsementApproved && (
            <ErrorMessage>
              <FormattedMessage id="publisher.notYetEndorsed" />
            </ErrorMessage>
          )}

          <HeaderInfo>
            <HeaderInfoMain>
              {publisher?.homepage?.[0] && (
                <FeatureList>
                  <Homepage url={publisher?.homepage?.[0]} />
                </FeatureList>
              )}
              <FeatureList>
                {!error && !slowData && <GenericFeatureSkeleton />}
                {isPositiveNumber(occurrenceSearch?.documents.total) && (
                  <GenericFeature>
                    <OccurrenceIcon />
                    <DynamicLink
                      className="hover:g-underline g-text-inherit"
                      pageId="occurrenceSearch"
                      searchParams={{ publishingOrg: publisher.key }}
                    >
                      <FormattedMessage
                        id="counts.nOccurrences"
                        values={{ total: occurrenceSearch?.documents.total }}
                      />
                    </DynamicLink>
                  </GenericFeature>
                )}
                {isPositiveNumber(hostedOccurrences?.documents.total) && (
                  <GenericFeature>
                    <OccurrenceIcon />
                    <DynamicLink
                      className="hover:g-underline g-text-inherit"
                      pageId="occurrenceSearch"
                      searchParams={{ hostingOrganizationKey: publisher.key }}
                    >
                      <FormattedMessage
                        id="counts.nOccurrencesHosted"
                        values={{ total: hostedOccurrences?.documents.total }}
                      />
                    </DynamicLink>
                  </GenericFeature>
                )}
                {isPositiveNumber(publisher?.numPublishedDatasets) && (
                  <GenericFeature>
                    <DynamicLink
                      className="hover:g-underline g-text-inherit"
                      pageId="datasetSearch"
                      searchParams={{ publishingOrg: publisher.key }}
                    >
                      <FormattedMessage
                        id="counts.nPublishedDatasets"
                        values={{ total: publisher.numPublishedDatasets ?? 0 }}
                      />
                    </DynamicLink>
                  </GenericFeature>
                )}
                {isPositiveNumber(hostedDatasets?.count) && (
                  <GenericFeature>
                    <DynamicLink
                      className="hover:g-underline g-text-inherit"
                      pageId="datasetSearch"
                      searchParams={{ hostingOrg: publisher.key }}
                    >
                      <FormattedMessage
                        id="counts.nHostedDatasets"
                        values={{
                          total: hostedDatasets?.count,
                        }}
                      />{' '}
                      (
                      <FormattedMessage
                        id="counts.nPublishers"
                        values={{ total: hostedDatasets?.facet?.publishingOrg?.length || 0 }}
                      />
                      ,{' '}
                      <FormattedMessage
                        id="counts.nCountries"
                        values={{ total: hostedDatasets?.facet?.publishingCountry?.length || 0 }}
                      />
                      )
                    </DynamicLink>
                  </GenericFeature>
                )}
                {isPositiveNumber(literatureSearch?.documents.total) && (
                  <GenericFeature>
                    <CitationIcon />
                    <DynamicLink
                      className="hover:g-underline g-text-inherit"
                      pageId="literatureSearch"
                      searchParams={{ publishingOrganizationKey: publisher.key }}
                    >
                      <FormattedMessage
                        id="counts.nCitations"
                        values={{ total: literatureSearch?.documents.total }}
                      />
                    </DynamicLink>
                  </GenericFeature>
                )}
              </FeatureList>
            </HeaderInfoMain>
          </HeaderInfo>
          <div className="g-border-b g-mt-4"></div>
          <Tabs links={tabs} />
        </ArticleTextContainer>
      </PageContainer>

      <Outlet />
    </article>
  );
}

export const PublisherPageSkeleton = ArticleSkeleton;
