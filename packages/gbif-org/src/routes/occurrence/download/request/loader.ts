import { OccurrenceDownloadAboutQuery, OccurrenceDownloadAboutQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { throwCriticalErrors } from '@/routes/rootErrorPage';

const OCCURRENCE_DOWNLOAD_ABOUT_QUERY = /* GraphQL */ `
  query OccurrenceDownloadAbout {
    resource(id: "3c9HWziGYZy6ayluASC48F") {
      __typename
      ... on Tool {
        body
      }
    }
  }
`;

export async function occurrenceDownloadAboutLoader({ graphql }: LoaderArgs) {
  const response = await graphql.query<
    OccurrenceDownloadAboutQuery,
    OccurrenceDownloadAboutQueryVariables
  >(OCCURRENCE_DOWNLOAD_ABOUT_QUERY, {});

  const { data, errors } = await response.json();
  throwCriticalErrors({
    path404: ['resource.body'],
    errors,
    requiredObjects: [data?.resource],
  });

  return data.resource;
}
