import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
import { LoaderArgs } from '@/types';
import { ArticleQuery, ArticleQueryVariables } from '@/gql/graphql';
import { required } from '@/utils/required';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';

import { SecondaryLinks } from '../components/SecondaryLinks';
import { Documents } from '../components/Documents';
import { ArticleSkeleton } from '../components/ArticleSkeleton';

const ARTICLE_QUERY = /* GraphQL */ `
  query Article($key: String!) {
    article(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        ...ArticleBanner
      }
      secondaryLinks {
        label
        url
      }
      documents {
        ...DocumentPreview
      }
      topics
      purposes
      audiences
      citation
      createdAt
    }
  }
`;

export function articlePageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<ArticleQuery, ArticleQueryVariables>(ARTICLE_QUERY, { key });
}

export function ArticlePage() {
  const { data } = useLoaderData() as { data: ArticleQuery };

  if (data.article == null) throw new Error('404');
  const resource = data.article;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          {/* <ArticlePreTitle>News</ArticlePreTitle> */}

          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <hr className="mt-8" />

          {/*
          A list documents and links related to this article can be found below.
          iterature through documents and links and display them as a 2 column grid list. With icons for the corresponding conten types.
          use the title as text and fall back to the filename if no title is provided.
          */}

          {resource.secondaryLinks && (
            <ArticleAuxiliary>
              <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
            </ArticleAuxiliary>
          )}

          {resource.documents && (
            <ArticleAuxiliary>
              <Documents documents={resource.documents} className="mt-8" />
            </ArticleAuxiliary>
          )}

          {resource.citation && (
            <ArticleAuxiliary label="Citation">
              <div dangerouslySetInnerHTML={{ __html: resource.citation }} />
            </ArticleAuxiliary>
          )}

          <ArticleTags resource={resource} className="mt-8" />
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export function ArticlePageSkeleton() {
  return <ArticleSkeleton />;
}
