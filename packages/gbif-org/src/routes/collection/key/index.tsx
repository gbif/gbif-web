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
  gbifRedirect: ({ key } = {}, { grSciCollLocalePrefix = '' }) => {
    if (typeof key !== 'string') throw new Error('Invalid key');
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GRSCICOLL}${grSciCollLocalePrefix}/collection/${key}`;
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
