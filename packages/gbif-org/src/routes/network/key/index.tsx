import { NetworkQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { NetworkKeyAbout } from './about';
import { NetworkKeyDataset } from './dataset';
import { NetworkKeyMetrics } from './metrics';
import { networkLoader, NetworkPage, NetworkPageSkeleton } from './networkKey';
import { NetworkKeyPublisher } from './publisher';

const id = 'network-key';

export const networkKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/network/${params.key}`;
  },
  path: 'network/:key',
  loader: networkLoader,
  loadingElement: <NetworkPageSkeleton />,
  element: <NetworkPage />,
  children: [
    {
      index: true,
      element: <NetworkKeyAbout />,
    },
    {
      path: 'metrics',
      element: <NetworkKeyMetrics />,
    },
    {
      path: 'dataset',
      element: <NetworkKeyDataset />,
    },
    {
      path: 'publisher',
      element: <NetworkKeyPublisher />,
    },
  ],
};

export function useNetworkKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: NetworkQuery };
}
