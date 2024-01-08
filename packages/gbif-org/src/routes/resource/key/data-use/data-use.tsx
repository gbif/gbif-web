import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { FormattedMessage } from 'react-intl';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { Pills } from '@/routes/resource/key/components/Pills';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { notNull } from '@/utils/notNull';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle } from '../components/ArticleTitle';
import { PublishedDate } from '../components/PublishedDate';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { DataUseQuery, DataUseQueryVariables } from '@/gql/graphql';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { ArticleTags } from '../components/ArticleTags';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  DataUseQuery,
  DataUseQueryVariables
>(/* GraphQL */ `
  query DataUse($key: String!) {
    dataUse(id: $key) {
      id
      title
      summary
      resourceUsed
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

export function DataUse() {
  const { data } = useTypedLoaderData();

  if (data.dataUse == null) throw new Error('404');
  const resource = data.dataUse;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>Data use</ArticlePreTitle>
          <ArticleTitle>{resource.title}</ArticleTitle>
          <PublishedDate className="mt-2" date={resource.createdAt} />

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}
          <ArticleIntro className="mt-2">
            Data resources used via GBIF : {resource.resourceUsed}
          </ArticleIntro>

          {/* <p className=" dark:text-gray-400 mt-2">
            <span>Data resources used via GBIF : </span>
            <span className="text-primary-600">{resource.resourceUsed}</span>
          </p> */}
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

export async function dataUseLoader({ request, params, config, locale }: LoaderArgs) {
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
