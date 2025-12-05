import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { LiteratureSearchPage } from './literatureSearch';

export const literatureSearchRoute: RouteObjectWithPlugins = {
  id: 'literatureSearch',
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }, searchParams) => {
    const params = { ...searchParams, contentType: 'literature' };
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return `${
      import.meta.env.PUBLIC_GBIF_ORG
    }${gbifOrgLocalePrefix}/resource/search?${queryString}`;
  },
  path: 'literature/search',
  element: <LiteratureSearchPage />,
};
