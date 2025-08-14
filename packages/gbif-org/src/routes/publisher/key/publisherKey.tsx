import { DataHeader } from '@/components/dataHeader';
import { ErrorMessage } from '@/components/errorMessage';
import {
  defaultDateFormatProps,
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
} from '@/components/headerComponents';
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
import { Helmet } from 'react-helmet-async';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

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

  return graphql.query<PublisherQuery, PublisherQueryVariables>(PUBLISHER_QUERY, {
    key,
  });
}

export function PublisherPage() {
  const { toast } = useToast();
  const { data, errors } = useLoaderData() as { data: PublisherQuery };
  const {
    data: slowData,
    load,
    error,
    loading,
  } = useQuery<PublisherStatsQuery, PublisherStatsQueryVariables>(SLOW_PUBLISHER_QUERY);

  useEffect(() => {
    if (data.publisher) {
      load({ variables: { key: data.publisher.key, jsonKey: data.publisher.key } });
    }
  }, [data.publisher, load]);

  // if (data.publisher == null) throw new NotFoundError(); // TODO - handle nout found in data loader. at leat null is not a sufficient test
  useEffect(() => {
    if (errors) {
      if (!data?.publisher) {
        throw new Error('Failed to load dataset');
      }
      toast({
        title: 'Unable to load all content',
        variant: 'destructive',
      });
    }
  }, [errors, toast, data]);

  const { publisher } = data;
  const { occurrenceSearch, hostedDatasets, literatureSearch, hostedOccurrences } = slowData ?? {};

  const deletedAt = publisher.deleted;

  const tabs = [{ to: '.', children: <FormattedMessage id="publisher.tabs.aboutPublisher" /> }];
  // only add occurrence tab if there are occurrences
  if (occurrenceSearch?.documents.total > 0) {
    tabs.push({ to: 'metrics', children: <FormattedMessage id="publisher.tabs.metrics" /> });
  }

  return (
    <article>
      <Helmet>
        <title>{publisher.title}</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>
      <PageMetaData
        path={`/publisher/${publisher.key}`}
        title={publisher.title}
        description={publisher.description}
        noindex={!!publisher?.deleted}
        nofollow={!!publisher?.deleted}
        imageUrl={publisher.logoUrl}
      />
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={publisher?.key?.toString()} />}
      ></DataHeader>

      <PageContainer topPadded hasDataHeader className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle
            secondary={
              <FormattedMessage
                id="publisher.header.sinceDate"
                values={{
                  DATE: (
                    <FormattedDate
                      value={publisher.created ?? undefined}
                      {...defaultDateFormatProps}
                    />
                  ),
                }}
              />
            }
          >
            <FormattedMessage id={`publisher.header.publisher`} />
          </ArticlePreTitle>
          {/* it would be nice to know for sure which fields to expect */}
          <ArticleTitle
            dangerouslySetTitle={{ __html: publisher.title || 'No title provided' }}
          ></ArticleTitle>

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
                {occurrenceSearch?.documents.total > 0 && (
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
                {hostedOccurrences?.documents.total > 0 && (
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
                {(publisher?.numPublishedDatasets ?? 0) > 0 && (
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
                {hostedDatasets?.count > 0 && (
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
                {literatureSearch?.documents.total > 0 && (
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
