import { InstallationQuery, InstallationQueryVariables } from '@/gql/graphql';
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
import { FeatureList, GenericFeature, Homepage } from '@/components/highlights';

const INSTALLATION_QUERY = /* GraphQL */ `
  query Installation($key: ID!) {
    installation(key: $key) {
      key
      title
      description
      deleted
      created
      homepage
      type
      endpoints {
        type
        url
      }
      organization {
        key
        title
      }

      dataset(limit: 0) {
        count
      }
    }
  }
`;

export async function installationLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<InstallationQuery, InstallationQueryVariables>(INSTALLATION_QUERY, { key });
}

export function InstallationPage() {
  const { data } = useLoaderData() as { data: InstallationQuery };

  if (data.installation == null) throw new Error('404');
  const { installation } = data;

  const deletedAt = installation.deleted;

  return (
    <>
      <Helmet>
        <title>{installation.title}</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="max-w-3xl">
          <ArticlePreTitle
            secondary={
              <FormattedMessage
                id="dataset.registeredDate"
                values={{
                  DATE: (
                    <FormattedDate
                      value={installation.created ?? undefined}
                      {...defaultDateFormatProps}
                    />
                  ),
                }}
              />
            }
          >
            <FormattedMessage id={`installation.installation`} />
          </ArticlePreTitle>
          <ArticleTitle
            dangerouslySetTitle={{ __html: installation.title || 'No title provided' }}
          ></ArticleTitle>

          {deletedAt && <DeletedMessage date={deletedAt} />}

          <HeaderInfo>
            <HeaderInfoMain>
              <FeatureList>
                {installation.homepage && <Homepage url={installation.homepage} />}
                <GenericFeature>
                  <FormattedMessage
                    id="counts.nHostedDatasets"
                    values={{ total: installation.dataset.count }}
                  />
                </GenericFeature>
              </FeatureList>
            </HeaderInfoMain>
          </HeaderInfo>
        </ArticleTextContainer>
      </ArticleContainer>

      <div className="bg-slate-100">
        <ArticleContainer>
          <ArticleTextContainer className="max-w-3xl">
            <Outlet />
          </ArticleTextContainer>
        </ArticleContainer>
      </div>
    </>
  );
}

export const InstallationPageSkeleton = ArticleSkeleton;
