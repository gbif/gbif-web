import { LoaderArgs } from '@/types';
import { ProjectNewsAndEventsQuery, ProjectNewsAndEventsQueryVariables } from '@/gql/graphql';
import { NewsResult } from '../news/NewsResult';
import { EventResult } from '../event/EventResult';
import { useLoaderData } from 'react-router-dom';
import { required } from '@/utils/required';
import { useMemo } from 'react';
import { sortByNewToOld } from '@/utils/sort';
import { TabListSkeleton } from './TabListSkeleton';
import { HelpLine } from '../../../../components/HelpText';
import { NoResultsTab } from '../components/NoResultsTab';

const PROJECT_NEWS_QUERY = /* GraphQL */ `
  query ProjectNewsAndEvents($key: String!) {
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

export function projectNewsAndEventsLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the URL');

  return graphql.query<ProjectNewsAndEventsQuery, ProjectNewsAndEventsQueryVariables>(
    PROJECT_NEWS_QUERY,
    {
      key,
    }
  );
}

export function ProjectNewsAndEventsTab() {
  const { data } = useLoaderData() as { data: ProjectNewsAndEventsQuery };

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
      <p className="pb-4 text-gray-600 text-sm text-right">
        <HelpLine id="how-to-add-events-to-my-project-page" icon/>
      </p>

      {/* TODO: Needs translation */}
      {sortedNewsAndEvents.length === 0 && (
        <NoResultsTab>No news and events linked to this project</NoResultsTab>
      )}

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

export function ProjectNewsAndEventsTabSkeleton() {
  return <TabListSkeleton />;
}
