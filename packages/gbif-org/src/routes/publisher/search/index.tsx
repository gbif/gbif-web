import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { PublisherSearchPage } from './publisherSearch';

export const publisherSearchRoute: RouteObjectWithPlugins = {
  id: 'publisher-search',
  path: 'publisher/search',
  element: <PublisherSearchPage />,
};
