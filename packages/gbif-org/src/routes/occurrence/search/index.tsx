import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceSearchPage } from './occurrenceSearchPage';

export const occurrenceSearchRouteId = 'occurrenceSearch';

export const occurrenceSearchRoute: RouteObjectWithPlugins = {
  id: occurrenceSearchRouteId,
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/occurrence/search`;
  },
  path: 'occurrence/search',
  element: <OccurrenceSearchPage />,
};
