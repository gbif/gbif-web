import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProgrammeQuery, ProgrammeQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import {
  ArticleBanner,
  ArticleBannerSkeleton,
} from '@/routes/resource/key/components/ArticleBanner';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle, ArticleTitleSkeleton } from '../components/ArticleTitle';
import { PublishedDate, PublishedDateSkeleton } from '../components/PublishedDate';
import { ArticleIntro, ArticleIntroSkeleton } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody, ArticleBodySkeleton } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { FormattedMessage } from 'react-intl';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProgrammeQuery,
  ProgrammeQueryVariables
>(/* GraphQL */ `
  query Programme($key: String!) {
    programme(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        file {
          url
          normal: thumbor(width: 1200, height: 500)
          mobile: thumbor(width: 800, height: 400)
        }
        description
        title
      }
    }
  }
`);

export function Programme() {
  const { data } = useTypedLoaderData();

  if (data.programme == null) throw new Error('404');
  const resource = data.programme;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer>
          <ArticlePreTitle><FormattedMessage id="cms.contentType.news" /></ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          {/* <PublishedDate className="mt-2" date={resource.createdAt} /> */}

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage ?? null} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <hr className="mt-8" />

          <ArticleTags resource={resource} className="mt-8" />
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export async function programmeLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}

export function ProgrammeSkeleton() {
  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticlePreTitle>Programme</ArticlePreTitle>
        <ArticleTitleSkeleton className="mt-3" />
        <PublishedDateSkeleton className="mt-3" />
        <ArticleIntroSkeleton className="mt-3" />
      </ArticleTextContainer>

      <ArticleBannerSkeleton className="mt-10" />

      <ArticleTextContainer className="mt-6">
        <ArticleBodySkeleton />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
