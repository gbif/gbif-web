import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceSearchPage } from './occurrenceSearchPage';

export const occurrenceSearchRouteId = 'occurrenceSearch';

export const occurrenceSearchRoute: RouteObjectWithPlugins = {
  id: occurrenceSearchRouteId,
  gbifRedirect: () => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}/occurrence/search`;
  },
  path: 'occurrence/search',
  element: <OccurrenceSearchPage />,
};
