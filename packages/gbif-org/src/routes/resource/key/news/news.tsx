import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { NewsQuery, NewsQueryVariables } from '@/gql/graphql';
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
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';

const NEWS_QUERY = /* GraphQL */ `
  query News($key: String!) {
    news(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        ...ArticleBanner
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
`;

export async function newsPageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<NewsQuery, NewsQueryVariables>(NEWS_QUERY, { key });
}

export function NewsPage() {
  const { data } = useLoaderData() as { data: NewsQuery };

  if (data.news == null) throw new Error('404');
  const resource = data.news;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer>
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.news" />
          </ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          <PublishedDate className="mt-2" date={resource.createdAt} />

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <ArticleFooterWrapper>
            <ArticleTags resource={resource} className="mt-8" />
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export function NewsPageSkeleton() {
  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticlePreTitle>
          <FormattedMessage id="cms.contentType.news" />
        </ArticlePreTitle>
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
