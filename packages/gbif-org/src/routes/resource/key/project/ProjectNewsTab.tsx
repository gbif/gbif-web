import { LoaderArgs } from '@/types';
import { ProjectNewsQuery, ProjectNewsQueryVariables } from '@/gql/graphql';
import { NewsResult } from '../news/NewsResult';
import { EventResult } from '../event/EventResult';
import { useLoaderData } from 'react-router-dom';
import { required } from '@/utils/required';
import { useMemo } from 'react';
import { notNull } from '@/utils/notNull';

const PROJECT_NEWS_QUERY = /* GraphQL */ `
  query ProjectNews($key: String!) {
    gbifProject(id: $key) {
      news {
        __typename
        ...NewsResult
      }
      events {
        __typename
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
      // Combine news and events
      [...(resource.news ?? []), ...(resource.events ?? [])]
        // Add a sortByDate to each entry
        .map((x) => {
          switch (x.__typename) {
            case 'Event':
              return {
                ...x,
                sortByDate: new Date(x.start),
              };
            case 'News':
              return {
                ...x,
                sortByDate: new Date(x.createdAt),
              };
          }
        })
        // Remove null entries
        .filter(notNull)
        .sort((a, b) => {
          if (a.sortByDate == null || b.sortByDate == null) return 0;
          return a.sortByDate > b.sortByDate ? -1 : 1;
        }),
    [resource.events, resource.news]
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
  return <p>Loading...</p>;
}
