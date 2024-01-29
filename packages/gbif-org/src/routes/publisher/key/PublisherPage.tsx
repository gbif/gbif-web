import { Tabs } from '@/components/Tabs';
import { PublisherQuery, PublisherQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLoaderData } from 'react-router-dom';

const PUBLISHER_QUERY = /* GraphQL */ `
  query Publisher($key: ID!) {
    publisher: organization(key: $key) {
      title
    }
  }
`;

export async function publisherLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<PublisherQuery, PublisherQueryVariables>(PUBLISHER_QUERY, { key });
}

export function PublisherPage() {
  const { data } = useLoaderData() as { data: PublisherQuery };

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
