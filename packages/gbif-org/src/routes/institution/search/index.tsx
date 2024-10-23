import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { InstitutionSearchPage } from './searchPage';

export const institutionSearchRoute: RouteObjectWithPlugins = {
  id: 'institution-search',
  path: 'institution/search',
  element: <InstitutionSearchPage />,
};
