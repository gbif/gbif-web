import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { ResourceSearchPage } from './resourceSearch';

export const resourceSearchRoute: RouteObjectWithPlugins = {
  id: 'resourceSearch',
  path: 'resource/search',
  element: <ResourceSearchPage />,
};
