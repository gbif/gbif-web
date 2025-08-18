import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { CollectionSearchPage } from './collectionSearch';

export const collectionSearchRoute: RouteObjectWithPlugins = {
  id: 'collectionSearch',
  path: 'collection/search',
  gbifRedirect: (_, { grSciCollLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GRSCICOLL}${grSciCollLocalePrefix}/collection/search`;
  },
  element: <CollectionSearchPage />,
};
