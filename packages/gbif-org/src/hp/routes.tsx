import { Config } from '@/config/config';
import { notFoundRoute } from '@/notFoundPage';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { collectionKeyRoute } from '@/routes/collection/key';
import { collectionSearchRoute } from '@/routes/collection/search';
import { datasetKeyRoute } from '@/routes/dataset/key';
import { datasetSearchRoute } from '@/routes/dataset/search';
import { installationKeyRoute } from '@/routes/installation/key';
import { institutionKeyRoute } from '@/routes/institution/key';
import { institutionSearchRoute } from '@/routes/institution/search';
import { literatureSearchRoute } from '@/routes/literature/search';
import { networkKeyRoute } from '@/routes/network/key';
import { occurrenceKeyRoutes } from '@/routes/occurrence/key';
import { occurrenceSearchRoute } from '@/routes/occurrence/search';
import { publisherKeyRoute } from '@/routes/publisher/key';
import { publisherSearchRoute } from '@/routes/publisher/search';
import { resourceKeyRoutes } from '@/routes/resource/key';
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
            children: [
              // search routes first
              collectionSearchRoute,
              institutionSearchRoute,
              publisherSearchRoute,
              literatureSearchRoute,
              occurrenceSearchRoute,

              // then key routes
              collectionKeyRoute,
              datasetSearchRoute,
              datasetKeyRoute,
              institutionKeyRoute,
              ...occurrenceKeyRoutes,
              publisherKeyRoute,
              installationKeyRoute,
              networkKeyRoute,
              ...resourceKeyRoutes,

              ...notImplementedRoutes,
              notFoundRoute,
            ],
          },
        ],
      },
    ],
    config
  );
}
