import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ToolQuery, ToolQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle } from '../components/ArticleTitle';
import { PublishedDate } from '../components/PublishedDate';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { SecondaryLinks } from '../components/SecondaryLinks';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import styles from './tool.module.css';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ToolQuery,
  ToolQueryVariables
>(/* GraphQL */ `
  query Tool($key: String!) {
    tool(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        file {
          url
          details {
            image {
              width
              height
            }
          }
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
      citation
      createdAt
      author
      rights
      rightsHolder
      publicationDate
    }
  }
`);

export function Tool() {
  const { data } = useTypedLoaderData();

  if (data.tool == null) throw new Error('404');
  const resource = data.tool;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>Tool</ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          <PublishedDate className="mt-2" date={resource.publicationDate} />

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

          {resource.secondaryLinks && (
            <ArticleAuxiliary>
              <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
            </ArticleAuxiliary>
          )}

          {resource.author && (
            <ArticleAuxiliary label="Author">
              <div
                className={styles.underlineLinks}
                dangerouslySetInnerHTML={{ __html: resource.author }}
              />
            </ArticleAuxiliary>
          )}

          {resource.rights && (
            <ArticleAuxiliary label="Rights">
              <div
                className={styles.underlineLinks}
                dangerouslySetInnerHTML={{ __html: resource.rights }}
              />
            </ArticleAuxiliary>
          )}

          {resource.rightsHolder && (
            <ArticleAuxiliary label="Rights Holder">
              <div
                className={styles.underlineLinks}
                dangerouslySetInnerHTML={{ __html: resource.rightsHolder }}
              />
            </ArticleAuxiliary>
          )}
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export async function toolLoader({ request, params, config, locale }: LoaderArgs) {
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
