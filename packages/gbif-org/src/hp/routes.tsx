import { Config } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { notFoundRoute } from '@/notFoundPage';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { Outlet } from 'react-router-dom';
import { HpRootLayout } from './hpRootLayout';

export function createHostedPortalRoutes(config: Config) {
  return applyReactRouterPlugins(
    [
      {
        element: <HpRootLayout children={<Outlet />} />,
        children: [
          {
            errorElement: <RootErrorPage />,
            children: [...dataRoutes, ...notImplementedRoutes, notFoundRoute],
          },
        ],
      },
    ],
    config
  );
}
