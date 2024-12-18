import { PublisherQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { PublisherKeyAbout } from './about';
import { PublisherKeyCitations } from './citations';
import { PublisherKeyMetrics } from './metrics';
import { publisherLoader, PublisherPage, PublisherPageSkeleton } from './publisherKey';

const id = 'publisherKey';

export const publisherKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/publisher/${params.key}`;
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
    {
      path: 'citations',
      element: <PublisherKeyCitations />,
    },
  ],
};

export function usePublisherKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: PublisherQuery };
}
