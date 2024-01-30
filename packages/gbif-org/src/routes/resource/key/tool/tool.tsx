import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ToolQuery, ToolQueryVariables } from '@/gql/graphql';
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
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { required } from '@/utils/required';

const TOOL_QUERY = /* GraphQL */ `
  query Tool($key: String!) {
    tool(id: $key) {
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
      citation
      createdAt
      author
      rights
      rightsHolder
      publicationDate
    }
  }
`;

export async function toolLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<ToolQuery, ToolQueryVariables>(TOOL_QUERY, { key });
}

export function Tool() {
  const { data } = useLoaderData() as { data: ToolQuery };

  if (data.tool == null) throw new Error('404');
  const resource = data.tool;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.tool" />
          </ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          <PublishedDate className="mt-2" date={resource.publicationDate} />

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

          {resource.secondaryLinks && (
            <ArticleAuxiliary>
              <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
            </ArticleAuxiliary>
          )}

          {resource.author && (
            <ArticleAuxiliary label={<FormattedMessage id="cms.resource.author" />}>
              <div
                className={styles.underlineLinks}
                dangerouslySetInnerHTML={{ __html: resource.author }}
              />
            </ArticleAuxiliary>
          )}

          {resource.rights && (
            <ArticleAuxiliary label={<FormattedMessage id="cms.resource.rights" />}>
              <div
                className={styles.underlineLinks}
                dangerouslySetInnerHTML={{ __html: resource.rights }}
              />
            </ArticleAuxiliary>
          )}

          {resource.rightsHolder && (
            <ArticleAuxiliary label={<FormattedMessage id="cms.resource.rightsHolder" />}>
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
