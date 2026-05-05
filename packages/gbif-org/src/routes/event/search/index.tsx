import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { EventSearchPage } from './eventSearchPage';

export const eventSearchRouteId = 'eventSearch';

export const eventSearchRoute: RouteObjectWithPlugins = {
  id: eventSearchRouteId,
  path: 'event/search',
  element: <EventSearchPage />,
};
