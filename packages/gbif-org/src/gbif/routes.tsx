import { Config } from '@/config/config';
import { notFoundRoute } from '@/notFoundPage';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { collectionKeyRoute } from '@/routes/collection/key';
import { collectionSearchRoute } from '@/routes/collection/search';
import { becomeAPublisherRoute } from '@/routes/custom/becomeAPublisher';
import { suggestDatasetRoute } from '@/routes/custom/suggestDataset';
import { datasetKeyRoute } from '@/routes/dataset/key';
import { datasetSearchRoute } from '@/routes/dataset/search';
import { homePageRoute } from '@/routes/homePage';
import { installationKeyRoute } from '@/routes/installation/key';
import { institutionKeyRoute } from '@/routes/institution/key';
import { institutionSearchRoute } from '@/routes/institution/search';
import { networkKeyRoute } from '@/routes/network/key';
import { occurrenceKeyRoutes } from '@/routes/occurrence/key';
import { occurrenceSearchRoute } from '@/routes/occurrence/search';
import { confirmEndorsmentRoute } from '@/routes/publisher/ConfirmEndorsment';
import { publisherKeyRoute } from '@/routes/publisher/key';
import { publisherSearchRoute } from '@/routes/publisher/search';
import { resourceKeyRoutes } from '@/routes/resource/key';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { Outlet } from 'react-router-dom';
import { GbifRootLayout, headerLoader } from './gbifRootLayout';
import { literatureSearchRoute } from '@/routes/literature/search';

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
              collectionKeyRoute,
              collectionSearchRoute,
              becomeAPublisherRoute,
              suggestDatasetRoute,
              datasetKeyRoute,
              datasetSearchRoute,
              installationKeyRoute,
              institutionKeyRoute,
              institutionSearchRoute,
              networkKeyRoute,
              ...occurrenceKeyRoutes,
              occurrenceSearchRoute,
              publisherKeyRoute,
              publisherSearchRoute,
              literatureSearchRoute,
              confirmEndorsmentRoute,
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
