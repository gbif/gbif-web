import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { installationLoader, InstallationPage, InstallationPageSkeleton } from './installationKey';
import { InstallationKeyAbout } from './about';
import { InstallationQuery } from '@/gql/graphql';

const id = 'installation-key';

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
