import { Config } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { becomeAPublisherRoute } from '@/routes/custom/becomeAPublisher';
import { gbifNetworkRoute } from '@/routes/custom/gbifNetwork/gbifNetwork';
import { suggestDatasetRoute } from '@/routes/custom/suggestDataset';
import { homePageRoute } from '@/routes/homePage';
import { confirmEndorsmentRoute } from '@/routes/publisher/ConfirmEndorsment';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { Outlet } from 'react-router-dom';
import { GbifRootLayout, headerLoader } from './gbifRootLayout';

export function createGbifRoutes(config: Config) {
  return applyReactRouterPlugins(
    [
      {
        element: <GbifRootLayout children={<Outlet />} />,
        loader: headerLoader,
        shouldRevalidate() {
          return false;
        },
        children: [
          {
            errorElement: <RootErrorPage />,
            children: [
              homePageRoute,

              // custom pages
              becomeAPublisherRoute,
              confirmEndorsmentRoute,
              gbifNetworkRoute,
              suggestDatasetRoute,

              ...notImplementedRoutes,

              // Must be last as alias handling will require match on whildcard
              ...dataRoutes,
            ],
          },
        ],
      },
    ],
    config
  );
}
