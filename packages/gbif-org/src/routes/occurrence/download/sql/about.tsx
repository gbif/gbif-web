import {
  OccurrenceDownloadSqlAboutQuery,
  OccurrenceDownloadSqlAboutQueryVariables,
} from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { useLoaderData } from 'react-router-dom';

const OCCURRENCE_DOWNLOAD_SQL_ABOUT_QUERY = /* GraphQL */ `
  query OccurrenceDownloadSqlAbout {
    resource(id: "5d1pPGSkLC6jsoUKSIdEz9") {
      __typename
      ... on Tool {
        body
      }
    }
  }
`;

export async function occurrenceDownloadSqlAboutLoader({ graphql }: LoaderArgs) {
  const response = await graphql.query<
    OccurrenceDownloadSqlAboutQuery,
    OccurrenceDownloadSqlAboutQueryVariables
  >(OCCURRENCE_DOWNLOAD_SQL_ABOUT_QUERY, {});

  const { data, errors } = await response.json();
  throwCriticalErrors({
    path404: ['resource.body'],
    errors,
    requiredObjects: [data?.resource],
  });

  return data.resource;
}

type Resource = Extract<OccurrenceDownloadSqlAboutQuery['resource'], { __typename: 'Tool' }>;

export function OccurrenceDownloadSqlAbout() {
  const resource = useLoaderData() as Resource;

  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticleBody dangerouslySetBody={{ __html: resource!.body as string }} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
