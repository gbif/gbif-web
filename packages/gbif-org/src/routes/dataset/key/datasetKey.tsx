import { DynamicLink } from '@/components/dynamicLink';
import {
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
  Hostname,
  defaultDateFormatProps,
} from '@/components/headerComponents';
import { Homepage, FeatureList, GenericFeature } from '@/components/highlights';
import { LicenceTag } from '@/components/identifierTag';
import { Tabs } from '@/components/tabs';
import { DatasetQuery, DatasetQueryVariables } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { MdLink, MdPeople } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';

const DATASET_QUERY = /* GraphQL */ `
  query Dataset($key: ID!) {
    dataset(key: $key) {
      title
      type
      deleted
      created
      publishingOrganizationKey
      publishingOrganizationTitle

      contactsCitation {
        key
        abbreviatedName
        firstName
        lastName
        userId
        roles
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
    <>
      <Helmet>
        <title>{dataset.title}</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>

      <ArticleContainer className="pb-0">
        <ArticleTextContainer className="max-w-screen-xl">
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
            <div className="mt-2">
              <FormattedMessage id="dataset.publishedBy" />{' '}
              <DynamicLink
                className="hover:underline text-primary-500"
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
                    <MdPeople />
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
                <Homepage url="https://www.gbif.org" />
                <GenericFeature>
                  <LicenceTag value="https://creativecommons.org/licenses/by/4.0/legalcode" />
                </GenericFeature>
                <GenericFeature>23 published datasets</GenericFeature>
              </FeatureList>
            </HeaderInfoMain>
            <div className="flex-shrink">edit</div>
          </HeaderInfo>
          <div className="border-b"></div>
          <Tabs
            links={[
              { to: '.', children: 'About' },
              { to: 'occurrences', children: 'Occurrences' },
              { to: 'download', children: 'Download' },
              // { to: 'citations', children: 'Citations' },
            ]}
          />
        </ArticleTextContainer>
      </ArticleContainer>

      <Outlet />
    </>
  );
}
