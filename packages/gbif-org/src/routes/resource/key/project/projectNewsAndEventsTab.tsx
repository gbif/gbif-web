import { CardListSkeleton } from '@/components/skeletonLoaders';
import { ProjectNewsAndEventsQuery, ProjectNewsAndEventsQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { required } from '@/utils/required';
import { sortByNewToOld } from '@/utils/sort';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { HelpLine } from '../../../../components/helpText';
import { NoResultsTab } from '../components/noResultsTab';
import { EventResult } from '../event/eventResult';
import { NewsResult } from '../news/newsResult';
import { throwCriticalErrors } from '@/routes/rootErrorPage';

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
    help(identifier: "how-to-add-events-to-my-project-page") {
      title
    }
  }
`;

export async function projectNewsAndEventsLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the URL');

  const response = await graphql.query<
    ProjectNewsAndEventsQuery,
    ProjectNewsAndEventsQueryVariables
  >(PROJECT_NEWS_QUERY, {
    key,
  });

  const { data, errors } = await response.json();

  throwCriticalErrors({
    path404: ['gbifProject'],
    errors,
    requiredObjects: [data?.gbifProject],
  });

  return {
    errors,
    data: {
      ...data,
      gbifProject: data.gbifProject!,
    },
  };
}

type ProjectNewsAndEventsLoaderResult = Awaited<ReturnType<typeof projectNewsAndEventsLoader>>;

export function ProjectNewsAndEventsTab() {
  const { data } = useLoaderData() as ProjectNewsAndEventsLoaderResult;

  const resource = data.gbifProject;

  const sortedNewsAndEvents = useMemo(
    () =>
      [...(resource.news ?? []), ...(resource.events ?? [])].sort(
        sortByNewToOld((x) => new Date(x.__typename === 'MeetingEvent' ? x.start : x.createdAt))
      ),
    [resource.news, resource.events]
  );

  const help = data.help;

  return (
    <div className="g-pt-4 g-max-w-3xl g-m-auto">
      <p className="g-pb-4 g-text-gray-600 g-text-sm g-text-right">
        <HelpLine title={help?.title} id="how-to-add-events-to-my-project-page" icon />
      </p>

      {sortedNewsAndEvents.length === 0 && (
        <NoResultsTab>
          <FormattedMessage id="cms.resource.noNewsOrEvents" />
        </NoResultsTab>
      )}

      {sortedNewsAndEvents.map((item) => {
        switch (item.__typename) {
          case 'MeetingEvent':
            return <EventResult key={item.id} event={item} />;
          case 'News':
            return <NewsResult key={item.id} news={item} />;
        }
      })}
    </div>
  );
}

export function ProjectNewsAndEventsTabSkeleton() {
  return <CardListSkeleton />;
}
