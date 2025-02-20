import { DownloadKeyQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { DownloadKey, downloadKeyLoader, DownloadKeySkeleton } from './downloadKey';

const id = 'downloadKey';

export const downloadKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    // assumed regex pattern for download keys: /^[0-9]*-[0-9]*$/;
    const pattern = /^[0-9]*-[0-9]*$/;
    if (typeof key !== 'string' || !pattern.test(key)) {
      throw new Error(`'Invalid key (key is of type ${typeof key})`);
    }
    // assuming that download/request and similar routes go first
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/occurrence/download/${key}`;
  },
  path: 'occurrence/download/:key',
  loader: downloadKeyLoader,
  loadingElement: <DownloadKeySkeleton />,
  element: <DownloadKey />,
};

export function usePublisherKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: DownloadKeyQuery };
}
