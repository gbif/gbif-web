import { NodeDetailsQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { NodeKeyAbout } from './about';
import { NodePage, NodePageSkeleton, nodeLoader } from './nodeKey';

const id = 'nodeKey';

export const nodeKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (typeof key !== 'string' && typeof key !== 'number')
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/node/${key}`;
  },
  path: 'node/:key',
  loader: nodeLoader,
  loadingElement: <NodePageSkeleton />,
  element: <NodePage />,
  children: [
    {
      index: true,
      element: <NodeKeyAbout />,
    },
  ],
};

export function useNodeKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: NodeDetailsQuery };
}
