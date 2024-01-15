import { LoaderArgs } from '@/types';
import { ProjectNewsQuery, ProjectNewsQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { NewsResult } from '../news/NewsResult';
import { EventResult } from '../event/EventResult';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProjectNewsQuery,
  ProjectNewsQueryVariables
>(/* GraphQL */ `
  query ProjectNews($key: String!) {
    gbifProject(id: $key) {
      news {
        id
        title
        excerpt
        primaryImage {
          file {
            url: thumbor(width: 300, height: 150)
          }
        }
        createdAt
      }
      events {
        id
        title
        excerpt
        country
        location
        venue
        start
        end
        primaryLink {
          url
        }
        gbifsAttendee
        allDayEvent
      }
    }
  }
`);

export function NewsTab() {
  const { data } = useTypedLoaderData();

  if (data.gbifProject == null) throw new Error('404');
  const resource = data.gbifProject;

  // sort events by start date descending
  const sortedEvents = resource.events?.map(x => x).sort((a, b) => (a.start > b.start ? -1 : 1));

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

export async function projectNewsLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}
