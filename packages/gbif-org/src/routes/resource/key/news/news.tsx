import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { NewsQuery, NewsQueryVariables } from '@/gql/graphql';
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
  NewsQuery,
  NewsQueryVariables
>(/* GraphQL */ `
  query News($key: String!) {
    news(id: $key) {
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
      primaryLink {
        label
        url
      }
      secondaryLinks {
        label
        url
      }
      countriesOfCoverage
      topics
      purposes
      audiences
      citation
      createdAt
    }
  }
`);

export function News() {
  const { data } = useTypedLoaderData();

  if (data.news == null) throw new Error('404');
  const resource = data.news;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer>
          <ArticlePreTitle><FormattedMessage id="cms.contentType.news" /></ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          <PublishedDate className="mt-2" date={resource.createdAt} />

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

export async function newsLoader({ request, params, config, locale }: LoaderArgs) {
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

export function NewsSkeleton() {
  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticlePreTitle>News</ArticlePreTitle>
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
