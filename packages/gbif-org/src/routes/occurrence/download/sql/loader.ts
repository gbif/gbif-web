import {
  OccurrenceDownloadSqlAboutQuery,
  OccurrenceDownloadSqlAboutQueryVariables,
} from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { throwCriticalErrors } from '@/routes/rootErrorPage';

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
