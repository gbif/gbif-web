import { Tabs } from '@/components/tabs';
import { PublisherQuery, PublisherQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { FormattedDate, FormattedMessage } from 'react-intl';
import {
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
  defaultDateFormatProps,
} from '@/components/headerComponents';
import {
  Homepage,
  FeatureList,
  GenericFeature,
  OccurrenceIcon,
  CitationIcon,
} from '@/components/highlights';

const PUBLISHER_QUERY = /* GraphQL */ `
  query Publisher($key: ID!) {
    publisher: organization(key: $key) {
      title
      description
      deleted
      created
      homepage
      numPublishedDatasets
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
    occurrenceSearch {
      documents(size: 0) {
        total
      }
    }
    hostedDatasets: datasetSearch(hostingOrg: [$key]) {
      count
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

  return graphql.query<PublisherQuery, PublisherQueryVariables>(PUBLISHER_QUERY, { key });
}

export function PublisherPage() {
  const { data } = useLoaderData() as { data: PublisherQuery };

  if (data.publisher == null) throw new Error('404');
  const { publisher, occurrenceSearch, hostedDatasets, literatureSearch } = data;

  const deletedAt = publisher.deleted;

  return (
    <>
      <Helmet>
        <title>{publisher.title}</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>

      <ArticleContainer className="pb-0">
        <ArticleTextContainer className="max-w-screen-xl">
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

          <HeaderInfo>
            <HeaderInfoMain>
              {publisher?.homepage?.[0] && (
                <FeatureList>
                  <Homepage url={publisher?.homepage?.[0]} />
                </FeatureList>
              )}
              <FeatureList>
                {occurrenceSearch?.documents.total > 0 && <GenericFeature>
                  <OccurrenceIcon />
                  <FormattedMessage
                    id="counts.nOccurrences"
                    values={{ total: occurrenceSearch?.documents.total }}
                  />
                </GenericFeature>}
                {publisher.numPublishedDatasets > 0 && <GenericFeature>
                  <FormattedMessage
                    id="counts.nPublishedDatasets"
                    values={{ total: publisher.numPublishedDatasets }}
                  />
                </GenericFeature>}
                {hostedDatasets?.count > 0 && <GenericFeature>
                  <FormattedMessage
                    id="counts.nHostedDatasets"
                    values={{ total: hostedDatasets?.count }}
                  />
                </GenericFeature>}
                {literatureSearch?.documents.total > 0 && <GenericFeature>
                  <CitationIcon />
                  <FormattedMessage
                    id="counts.nCitations"
                    values={{ total: literatureSearch?.documents.total }}
                  />
                </GenericFeature>}
              </FeatureList>
            </HeaderInfoMain>
          </HeaderInfo>
          <div className="border-b"></div>
          <Tabs
            links={[
              { to: '.', children: 'About' },
              { to: 'citations', children: 'Citations' },
              { to: 'metrics', children: 'Occurrence metrics' },
              // { to: 'citations', children: 'Citations' },
            ]}
          />
        </ArticleTextContainer>
      </ArticleContainer>

      <Outlet />
    </>
  );
}

export const PublisherPageSkeleton = ArticleSkeleton;
