import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceSearchPage } from './occurrenceSearchPage';

export const occurrenceSearchRouteId = 'occurrenceSearch';

export const occurrenceSearchRoute: RouteObjectWithPlugins = {
  id: occurrenceSearchRouteId,
  gbifRedirect: () => {
    return `/occurrence/search`;
  },
  path: 'occurrence/search',
  element: <OccurrenceSearchPage />,
};
