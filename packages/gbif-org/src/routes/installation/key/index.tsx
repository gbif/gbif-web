import { InstallationQuery } from '@/gql/graphql';
import { RouteObjectWithPlugins, useRenderedRouteLoaderData } from '@/reactRouterPlugins';
import { InstallationKeyAbout } from './about';
import { installationLoader, InstallationPage, InstallationPageSkeleton } from './installationKey';

const id = 'installationKey';

export const installationKeyRoute: RouteObjectWithPlugins = {
  id,
  gbifRedirect: ({ key } = {}, { gbifOrgLocalePrefix = '' }) => {
    if (typeof key !== 'string') throw new Error('Invalid key');
    if (key === 'search') return null;
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/installation/${key}`;
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
