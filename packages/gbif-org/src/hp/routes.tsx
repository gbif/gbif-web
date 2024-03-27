import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/homePage';
import { ThrowOn404 } from '@/routes/throwOn404';
import { RootErrorPage } from '@/routes/rootErrorPage';
import {
  DetailedOccurrencePage,
  DetailedOccurrencePageSkeleton,
  detailedOccurrencePageLoader,
} from '@/routes/occurrence/key/detailedOccurrencePage';
import { OccurrenceSearchPage } from '@/routes/occurrence/search/occurrenceSearchPage';
import { InputConfig, configBuilder } from '@/contexts/config/config';
import { DatasetPage, datasetLoader } from '@/routes/dataset/key/datasetKey';
import { DatasetAboutTab } from '@/routes/dataset/key/about';
import { DatasetDashboardTab } from '@/routes/dataset/key/dashboard';
import { DatasetOccurrencesTab } from '@/routes/dataset/key/occurrences';
import { DatasetDownloadTab } from '@/routes/dataset/key/download';
import { PublisherPage, publisherLoader } from '@/routes/publisher/key/publisherKey';
import { PublisherAboutTab } from '@/routes/publisher/key/about';
import { PublisherOccurrencesTab } from '@/routes/publisher/key/metrics';
import { NewsPage, newsPageLoader } from '@/routes/resource/key/news/news';

const baseRoutes: SourceRouteObject[] = [
  {
    errorElement: <RootErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        key: 'occurrence-search-page',
        path: 'occurrence/search',
        element: <OccurrenceSearchPage />,
      },
      {
        key: 'occurrence-page',
        path: 'occurrence/:key',
        loader: detailedOccurrencePageLoader,
        element: <DetailedOccurrencePage />,
        loadingElement: <DetailedOccurrencePageSkeleton />,
      },
      {
        key: 'dataset-page',
        gbifRedirect: (params) => {
          if (typeof params.key !== 'string') throw new Error('Invalid key');
          return `https://www.gbif.org/dataset/${params.key}`;
        },
        path: 'dataset/:key',
        loader: datasetLoader,
        element: <DatasetPage />,
        children: [
          {
            index: true,
            element: <DatasetAboutTab />,
          },
          {
            path: 'dashboard',
            element: <DatasetDashboardTab />,
          },
          {
            path: 'occurrences',
            element: <DatasetOccurrencesTab />,
          },
          {
            path: 'download',
            element: <DatasetDownloadTab />,
          },
        ],
      },
      {
        key: 'publisher-page',
        gbifRedirect: (params) => {
          if (typeof params.key !== 'string') throw new Error('Invalid key');
          return `https://www.gbif.org/publisher/${params.key}`;
        },
        path: 'publisher/:key',
        loader: publisherLoader,
        element: <PublisherPage />,
        children: [
          {
            index: true,
            element: <PublisherAboutTab />,
          },
          {
            path: 'occurrences',
            element: <PublisherOccurrencesTab />,
          },
        ],
      },
      {
        path: 'resource/:key',
        loader: newsPageLoader,
        element: <NewsPage />,
      },
      {
        path: '*',
        // Delegate handling of 404 to RootErrorPage,
        element: <ThrowOn404 />,
      },
    ],
  },
];

export const configureHostedPortalRoutes = (hostedPortalConfig: InputConfig) =>
  configureRoutes(baseRoutes, configBuilder(hostedPortalConfig));
