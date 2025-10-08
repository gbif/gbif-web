import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Config } from '@/config/config';
import { dataRoutes } from '@/config/routes';
import { notImplementedRoutes } from '@/notImplementedRoutes';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { analyticsRoute } from '@/routes/analytics';
import { becomeAPublisherRoute } from '@/routes/custom/becomeAPublisher';
import { occurrenceSnapshotsRoute } from '@/routes/custom/occurrenceSnapshots';
import { faqRoute } from '@/routes/custom/faq';
import { gbifNetworkRoute } from '@/routes/custom/gbifNetwork/gbifNetwork';
import { suggestDatasetRoute } from '@/routes/custom/suggestDataset';
import { homePageRoute } from '@/routes/home';
import { occurrenceDownloadRequestRoute } from '@/routes/occurrence/download/request';
import { occurrenceDownloadSqlRoute } from '@/routes/occurrence/download/sql';
import { omniSearchRoute } from '@/routes/omniSearch';
import { confirmEndorsmentRoute } from '@/routes/publisher/ConfirmEndorsment';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { userRoutes } from '@/routes/user';
import { literatureButtonWidgetRoute, literatureSearchWidgetRoute } from '@/routes/widgets';
import { Outlet } from 'react-router-dom';
import { GbifRootLayout, headerLoader } from './gbifRootLayout';
import { mdtRoute } from '@/routes/custom/mdt';

export function createGbifRoutes(config: Config) {
  return applyReactRouterPlugins(
    [
      {
        element: (
          <GbifRootLayout
            children={
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            }
          />
        ),
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
              occurrenceDownloadSqlRoute,
              occurrenceDownloadRequestRoute,
              occurrenceSnapshotsRoute,
              // custom pages
              becomeAPublisherRoute,
              confirmEndorsmentRoute,
              gbifNetworkRoute,
              mdtRoute,
              suggestDatasetRoute,
              analyticsRoute,
              faqRoute,
              ...notImplementedRoutes,

              // Must be last as alias handling will require match on whildcard
              ...dataRoutes,
            ],
          },
        ],
      },
      literatureSearchWidgetRoute,
      literatureButtonWidgetRoute,
    ],
    config
  );
}
