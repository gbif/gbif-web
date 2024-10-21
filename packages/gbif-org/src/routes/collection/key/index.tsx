import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { CollectionKey, collectionLoader } from './collectionKey';
import CollectionKeyAbout from './About';
import CollectionKeyDashboard from './Dashboard';
import CollectionKeySpecimens from './Specimen';
import { CollectionQuery } from '@/gql/graphql';

const id = 'collection-key';

export const collectionKeyRoute: RouteObjectWithPlugins = {
  id,
  path: 'collection/:key',
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/collection/${params.key}`;
  },
  loader: collectionLoader,
  element: <CollectionKey />,
  children: [
    {
      index: true,
      element: <CollectionKeyAbout />,
    },
    {
      path: 'specimen',
      element: <CollectionKeySpecimens />,
    },
    {
      path: 'dashboard',
      element: <CollectionKeyDashboard />,
    },
  ],
};

export function useCollectionKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: CollectionQuery };
}
