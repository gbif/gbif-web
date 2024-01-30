import { LoaderArgs } from '@/types';
import { ProjectNewsQuery, ProjectNewsQueryVariables } from '@/gql/graphql';
import { NewsResult } from '../news/NewsResult';
import { EventResult } from '../event/EventResult';
import { useLoaderData } from 'react-router-dom';
import { required } from '@/utils/required';

const PROJECT_NEWS_QUERY = /* GraphQL */ `
  query ProjectNews($key: String!) {
    gbifProject(id: $key) {
      news {
        ...NewsResult
      }
      events {
        ...EventResult
      }
    }
  }
`;

export function projectNewsLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the URL');

  return graphql.query<ProjectNewsQuery, ProjectNewsQueryVariables>(PROJECT_NEWS_QUERY, {
    key,
  });
}

export function ProjectNewsTab() {
  const { data } = useLoaderData() as { data: ProjectNewsQuery };

  if (data.gbifProject == null) throw new Error('404');
  const resource = data.gbifProject;

  // sort events by start date descending
  const sortedEvents = resource.events?.map((x) => x).sort((a, b) => (a.start > b.start ? -1 : 1));

  return (
    <div className="pt-4 max-w-3xl m-auto">
      {resource.news &&
        resource.news
          .filter((x) => x)
          .map((item) => {
            return <NewsResult key={item?.id} news={item} />;
          })}
      {sortedEvents &&
        sortedEvents
          .filter((x) => x)
          .map((item) => {
            return <EventResult key={item?.id} event={item} />;
          })}
    </div>
  );
}

export function ProjectNewsTabSkeleton() {
  return <p>Loading...</p>;
}
