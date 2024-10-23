import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { publisherLoader, PublisherPage, PublisherPageSkeleton } from './publisherKey';
import { PublisherKeyAbout } from './about';
import { PublisherKeyMetrics } from './metrics';
import { PublisherKeyCitations } from './citations';
import { PublisherQuery } from '@/gql/graphql';

const id = 'publisher-key';

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
