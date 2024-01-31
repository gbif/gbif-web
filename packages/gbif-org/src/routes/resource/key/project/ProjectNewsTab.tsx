import { LoaderArgs } from '@/types';
import { ProjectNewsQuery, ProjectNewsQueryVariables } from '@/gql/graphql';
import { NewsResult } from '../news/NewsResult';
import { EventResult } from '../event/EventResult';
import { useLoaderData } from 'react-router-dom';
import { required } from '@/utils/required';
import { useMemo } from 'react';
import { sortByNewToOld } from '@/utils/sort';
import { TabListSkeleton } from './TabListSkeleton';

const PROJECT_NEWS_QUERY = /* GraphQL */ `
  query ProjectNews($key: String!) {
    gbifProject(id: $key) {
      news {
        __typename
        createdAt
        ...NewsResult
      }
      events {
        __typename
        start
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

  const sortedNewsAndEvents = useMemo(
    () =>
      [...(resource.news ?? []), ...(resource.events ?? [])].sort(
        sortByNewToOld((x) => new Date(x.__typename === 'Event' ? x.start : x.createdAt))
      ),
    [resource.news, resource.events]
  );

  return (
    <div className="pt-4 max-w-3xl m-auto">
      {sortedNewsAndEvents.map((item) => {
        switch (item.__typename) {
          case 'Event':
            return <EventResult key={item.id} event={item} />;
          case 'News':
            return <NewsResult key={item.id} news={item} />;
        }
      })}
    </div>
  );
}

export function ProjectNewsTabSkeleton() {
  return <TabListSkeleton />;
}
