import { Config } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { Outlet } from 'react-router-dom';
import { HpRootLayout } from './hpRootLayout';

export const hostedPortalRoutes = [
  ...notImplementedRoutes,
  // Must be last as alias handling will require match on whildcard
  ...dataRoutes,
];

export function createHostedPortalRoutes(config: Config) {
  return applyReactRouterPlugins(
    [
      {
        element: <HpRootLayout children={<Outlet />} />,
        children: [
          {
            errorElement: <RootErrorPage />,
            children: hostedPortalRoutes,
          },
        ],
      },
    ],
    config
  );
}
