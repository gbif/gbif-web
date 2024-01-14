import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { NewsQuery, NewsQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle } from '../components/ArticleTitle';
import { PublishedDate } from '../components/PublishedDate';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { Skeleton } from '@/components/ui/skeleton';

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
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>News</ArticlePreTitle>

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
      <ArticleTextContainer className="mb-10">
        <ArticlePreTitle>News</ArticlePreTitle>

        <Skeleton className="w-full h-8 mt-3" />
        <Skeleton className="w-4/6 h-8 mt-1" />

        <Skeleton className="w-32 h-6 mt-3" />

        <Skeleton className="w-full h-6 mt-3" />
        <Skeleton className="w-5/6 h-6 mt-1" />
        <Skeleton className="w-2/6 h-6 mt-1" />
      </ArticleTextContainer>

      <div className="max-w-6xl w-full mt-8 mb-6 m-auto">
        <Skeleton className="w-full aspect-[2/1] md:aspect-[12/5]" />
        <Skeleton className="w-5/6 h-4 mt-1" />
      </div>

      <ArticleTextContainer className="w-[80ch]">
        <Skeleton className="h-6 mt-1 w-[calc(100%-2px)]" />
        <Skeleton className="h-6 mt-1 w-[calc(100%-4px)]" />

        <Skeleton className="h-6 mt-6 w-[calc(100%-3px)]" />
        <Skeleton className="h-6 mt-1 w-[calc(100%-1px)]" />
        <Skeleton className="h-6 mt-1 w-[calc(100%-5px)]" />
        <Skeleton className="h-6 mt-1 w-[calc(100%-7px)]" />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
