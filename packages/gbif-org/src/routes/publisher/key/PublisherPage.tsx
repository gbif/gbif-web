import { Tabs } from '@/components/Tabs';
import { PublisherQuery, PublisherQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  PublisherQuery,
  PublisherQueryVariables
>(/* GraphQL */ `
  query Publisher($key: ID!) {
    publisher: organization(key: $key) {
      title
    }
  }
`);

export function PublisherPage() {
  const { data } = useTypedLoaderData();

  if (data.publisher == null) throw new Error('404');
  const publisher = data.publisher;

  return (
    <>
      <Helmet>
        <title>{publisher.title}</title>
      </Helmet>

      <h1 className="text-3xl">{publisher.title}</h1>

      <div className="text-red-500 mt-4 mb-4">
        <p>
          TODO have tabs that are accessible and can be used as either state push, href links or not
          url linkable tabs (simple react state only) For the dataset page the tabs would have state
          in the url and work as state push
        </p>
        <p>Notice that occurrence search lives in one of the tabs.</p>
      </div>
      <Tabs
        links={[
          { to: '.', children: 'About' },
          { to: 'occurrences', children: 'Occurrences' },
        ]}
      />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export async function publisherLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    locale: locale.cmsLocale || locale.code,
    variables: {
      key,
    },
  });
}
