import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { InstitutionSearchPage } from './institutionSearch';

export const institutionSearchRoute: RouteObjectWithPlugins = {
  id: 'institutionSearch',
  path: 'institution/search',
  gbifRedirect: (_, { grSciCollLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GRSCICOLL}${grSciCollLocalePrefix}/institution/search`;
  },
  element: <InstitutionSearchPage />,
};
