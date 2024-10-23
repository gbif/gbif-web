import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { CollectionSearchPage } from './collectionSearch';

export const collectionSearchRoute: RouteObjectWithPlugins = {
  id: 'collection-search',
  path: 'collection/search',
  element: <CollectionSearchPage />,
};
