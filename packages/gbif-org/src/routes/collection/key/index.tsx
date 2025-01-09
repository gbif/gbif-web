import { CollectionQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import CollectionKeyAbout from './About';
import { CollectionKey, collectionLoader } from './collectionKey';
import CollectionKeyDashboard from './Dashboard';
import CollectionKeySpecimens from './Specimen';

const id = 'collectionKey';

export const collectionKeyRoute: RouteObjectWithPlugins = {
  id,
  path: 'collection/:key',
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/collection/${params.key}`;
  },
  loader: collectionLoader,
  shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }) {
    if (currentUrl.pathname === nextUrl.pathname) return false;
    return defaultShouldRevalidate;
  },
  element: <CollectionKey />,
  children: [
    {
      index: true,
      element: <CollectionKeyAbout />,
    },
    {
      path: 'specimens',
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
