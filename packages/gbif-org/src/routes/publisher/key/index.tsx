import { PublisherQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { PublisherKeyAbout } from './about';
import { PublisherKeyMetrics } from './metrics';
import { publisherLoader, PublisherPage, PublisherPageSkeleton } from './publisherKey';

const id = 'publisherKey';

export const publisherKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ gbifOrgLocalePrefix = '', key } = {}) => {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/publisher/${key}`;
  },
  path: 'publisher/:key',
  loader: publisherLoader,
  loadingElement: <PublisherPageSkeleton />,
  element: <PublisherPage />,
  children: [
    {
      index: true,
      element: <PublisherKeyAbout />,
    },
    {
      path: 'metrics',
      element: <PublisherKeyMetrics />,
    },
    // {
    //   path: 'citations',
    //   element: <PublisherKeyCitations />,
    // },
  ],
};

export function usePublisherKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: PublisherQuery };
}
