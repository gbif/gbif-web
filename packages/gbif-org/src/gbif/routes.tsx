import { Config } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { analyticsRoute } from '@/routes/analytics';
import { becomeAPublisherRoute } from '@/routes/custom/becomeAPublisher';
import { gbifNetworkRoute } from '@/routes/custom/gbifNetwork/gbifNetwork';
import { suggestDatasetRoute } from '@/routes/custom/suggestDataset';
import { homePageRoute } from '@/routes/home';
import { omniSearchRoute } from '@/routes/omniSearch';
import { confirmEndorsmentRoute } from '@/routes/publisher/ConfirmEndorsment';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { userRoutes } from '@/routes/user';
import { Outlet } from 'react-router-dom';
import { GbifRootLayout, headerLoader } from './gbifRootLayout';

export function createGbifRoutes(config: Config) {
  return applyReactRouterPlugins(
    [
      {
        element: <GbifRootLayout children={<Outlet />} />,
        loader: headerLoader,
        errorElement: <RootErrorPage />,
        shouldRevalidate() {
          return false;
        },
        children: [
          {
            errorElement: <RootErrorPage />,
            children: [
              homePageRoute,
              ...userRoutes,
              omniSearchRoute,

              // custom pages
              becomeAPublisherRoute,
              confirmEndorsmentRoute,
              gbifNetworkRoute,
              suggestDatasetRoute,
              analyticsRoute,

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
