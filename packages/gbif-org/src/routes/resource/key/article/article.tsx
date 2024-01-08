import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ArticleQuery, ArticleQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { FormattedMessage } from 'react-intl';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ArticleQuery,
  ArticleQueryVariables
>(/* GraphQL */ `
  query Article($key: String!) {
    article(id: $key) {
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
      secondaryLinks {
        label
        url
      }
      topics
      purposes
      audiences
      citation
      createdAt
    }
  }
`);

export function Article() {
  const { data } = useTypedLoaderData();

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

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage ?? null} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <hr className="mt-8" />

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

export async function articleLoader({ request, params, config, locale }: LoaderArgs) {
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
