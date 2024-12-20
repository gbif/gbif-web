import { InstallationQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { InstallationKeyAbout } from './about';
import { installationLoader, InstallationPage, InstallationPageSkeleton } from './installationKey';

const id = 'installationKey';

export const installationKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: (params) => {
    if (typeof params.key !== 'string') throw new Error('Invalid key');
    if (params.key === 'search') return null;
    return `/installation/${params.key}`;
  },
  path: 'installation/:key',
  loader: installationLoader,
  loadingElement: <InstallationPageSkeleton />,
  element: <InstallationPage />,
  children: [
    {
      index: true,
      element: <InstallationKeyAbout />,
    },
  ],
};

export function useInstallationKeyLoaderData() {
  return useRenderedRouteLoaderData(id) as { data: InstallationQuery };
}
