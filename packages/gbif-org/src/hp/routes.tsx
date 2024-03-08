import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/HomePage';
import { ThrowOn404 } from '@/routes/ThrowOn404';
import { RootErrorPage } from '@/routes/RootErrorPage';
import {
  DetailedOccurrencePage,
  DetailedOccurrencePageSkeleton,
  detailedOccurrencePageLoader,
} from '@/routes/occurrence/key/DetailedOccurrencePage';
import { OccurrenceSearchPage } from '@/routes/occurrence/search/OccurrenceSearchPage';
import { InputConfig, configBuilder } from '@/contexts/config/config';
import { DatasetPage, datasetLoader } from '@/routes/dataset/key/DatasetPage';
import { DatasetAboutTab } from '@/routes/dataset/key/AboutTab';
import { DatasetDashboardTab } from '@/routes/dataset/key/DashboardTab';
import { DatasetOccurrencesTab } from '@/routes/dataset/key/OccurrencesTab';
import { DatasetDownloadTab } from '@/routes/dataset/key/DownloadTab';
import { PublisherPage, publisherLoader } from '@/routes/publisher/key/PublisherPage';
import { PublisherAboutTab } from '@/routes/publisher/key/AboutTab';
import { PublisherOccurrencesTab } from '@/routes/publisher/key/OccurrencesTab';
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
