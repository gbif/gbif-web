import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { CollectionSearchPage } from './searchPage';

export const collectionSearchRoute: RouteObjectWithPlugins = {
  id: 'collection-search',
  path: 'collection/search',
  element: <CollectionSearchPage />,
};
