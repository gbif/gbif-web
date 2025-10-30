import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Config } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { Outlet } from 'react-router-dom';
import { HpRootLayout } from './hpRootLayout';
import { collectionSearchRoute } from '@/routes/collection/search';
import { institutionSearchRoute } from '@/routes/institution/search';

export const hostedPortalRoutes = [
  ...notImplementedRoutes,

  // HP specefic data routes
  collectionSearchRoute,
  institutionSearchRoute,

  // Must be last as alias handling will require match on whildcard
  ...dataRoutes,
];

export function createHostedPortalRoutes(config: Config) {
  return applyReactRouterPlugins(
    [
      {
        element: (
          <HpRootLayout
            children={
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            }
          />
        ),
        children: [
          {
            children: hostedPortalRoutes,
          },
        ],
      },
    ],
    config
  );
}
