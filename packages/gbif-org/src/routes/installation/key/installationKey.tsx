import { DataHeader } from '@/components/dataHeader';
import {
  defaultDateFormatProps,
  DeletedMessage,
  HeaderInfo,
  HeaderInfoMain,
} from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage } from '@/components/highlights';
import PageMetaData from '@/components/PageMetaData';
import { NotFoundError } from '@/errors';
import { InstallationQuery, InstallationQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors, usePartialDataNotification } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

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

      dataset(limit: 0) {
        count
      }
    }
  }
`;

export async function installationLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<InstallationQuery, InstallationQueryVariables>(
    INSTALLATION_QUERY,
    { key }
  );
  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['installation'],
    errors,
    requiredObjects: [data?.installation],
  });

  return { errors, data };
}

export function InstallationPage() {
  const { data, errors } = useLoaderData() as { data: InstallationQuery };
  const notifyOfPartialData = usePartialDataNotification();
  useEffect(() => {
    if (errors) {
      notifyOfPartialData();
    }
  }, [errors, notifyOfPartialData]);

  if (data.installation == null) throw new NotFoundError();
  const { installation } = data;

  const deletedAt = installation.deleted;

  return (
    <article className="g-bg-background">
      <PageMetaData
        title={installation.title}
        description={installation?.description}
        noindex={!!installation?.deleted}
        nofollow={!!installation?.deleted}
        path={`/installation/${installation.key}`}
      />

      <DataHeader
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={installation?.key?.toString()} />}
      ></DataHeader>

      <PageContainer topPadded hasDataHeader>
        <ArticleTextContainer className="g-max-w-screen-lg">
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
      </PageContainer>

      <div className="g-bg-slate-100">
        <ArticleContainer>
          <ArticleTextContainer className="g-max-w-screen-lg">
            <Outlet />
          </ArticleTextContainer>
        </ArticleContainer>
      </div>
    </article>
  );
}

export const InstallationPageSkeleton = ArticleSkeleton;
