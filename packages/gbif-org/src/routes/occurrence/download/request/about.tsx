import {
  OccurrenceDownloadAboutQuery,
  OccurrenceDownloadAboutQueryVariables,
  OccurrenceDownloadSqlAboutQuery,
} from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { useLoaderData } from 'react-router-dom';

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

type Resource = Extract<OccurrenceDownloadSqlAboutQuery['resource'], { __typename: 'Tool' }>;

export function OccurrenceDownloadAbout() {
  const resource = useLoaderData() as Resource;

  return (
    <ArticleContainer>
      <ArticleTextContainer>
        <ArticleBody dangerouslySetBody={{ __html: resource!.body as string }} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
