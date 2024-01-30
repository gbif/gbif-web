import { DynamicLink } from '@/components/DynamicLink';
import { Tabs } from '@/components/Tabs';
import { DatasetQuery, DatasetQueryVariables } from '@/gql/graphql';
import { ArticleSkeleton } from '@/routes/resource/key/components/ArticleSkeleton';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLoaderData } from 'react-router-dom';

const DATASET_QUERY = /* GraphQL */ `
  query Dataset($key: ID!) {
    dataset(key: $key) {
      title
      publishingOrganizationKey
      publishingOrganizationTitle
    }
  }
`;

export function datasetLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<DatasetQuery, DatasetQueryVariables>(DATASET_QUERY, { key });
}

export const DatasetPageSkeleton = ArticleSkeleton;

export function DatasetPage() {
  const { data } = useLoaderData() as { data: DatasetQuery };

  if (data.dataset == null) throw new Error('404');
  const dataset = data.dataset;

  return (
    <>
      <Helmet>
        <title>{dataset.title}</title>
      </Helmet>

      <h1 className="text-3xl">{dataset.title}</h1>
      {dataset.publishingOrganizationTitle && (
        <p>
          Published by{' '}
          <DynamicLink
            className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
            to={`/publisher/${dataset.publishingOrganizationKey}`}
          >
            {dataset?.publishingOrganizationTitle}
          </DynamicLink>{' '}
          -{' '}
          <span className="text-red-500">
            TODO phrase should be translated. If it links to a publisher page on the site or 2
            gbif.org or somewhere else depends on the hp. And it should take color and rounding from
            the theme config
          </span>
        </p>
      )}
      <div className="text-red-500 mt-4 mb-4">
        <p>
          TODO have tabs that are accessible and can be used as either state push, href links or not
          url linkable tabs (simple react state only) For the dataset page the tabs would have state
          in the url and work as state push
        </p>
        <p>Notice that occurrence search lives in one of the tabs.</p>
        <p>
          The fonts should be themed as well. It is fine that the hp owner have to add the fonts
          themselves to the site head
        </p>
      </div>
      <Tabs
        links={[
          { to: '.', children: 'About' },
          { to: 'dashboard', children: 'Dashboard' },
          { to: 'occurrences', children: 'Occurrences' },
          { to: 'download', children: 'Download' },
        ]}
      />
      <Outlet />
    </>
  );
}
