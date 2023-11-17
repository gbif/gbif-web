import { Outlet } from 'react-router-dom';
import { GbifRootLayout } from '@/components/GbifRootLayout';
import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/HomePage';
import { NotFound } from '@/routes/NotFound';
import { RootErrorPage } from '@/routes/RootErrorPage';
import {
  DetailedOccurrencePage,
  DetailedOccurrencePageLoading,
  loader as detailedOccurrenceLoader,
} from '@/routes/occurrence/key/DetailedOccurrencePage';
import {
  OccurrenceSearchPage,
  loader as occurrenceSearchLoader,
} from '@/routes/occurrence/search/OccurrenceSearchPage';
import { Config } from '@/contexts/config';
import { DatasetPage, datasetLoader } from '@/routes/dataset/key/DatasetPage';
import { PublisherPage, publisherLoader } from '@/routes/publisher/key/PublisherPage';
import { News, newsLoader } from '@/routes/resource/key/news/news';
import { PublisherAboutTab } from '@/routes/publisher/key/AboutTab';
import { PublisherOccurrencesTab } from '@/routes/publisher/key/OccurrencesTab';
import { DatasetAboutTab } from '@/routes/dataset/key/AboutTab';
import { DatasetDashboardTab } from '@/routes/dataset/key/DashboardTab';
import { DatasetOccurrencesTab } from '@/routes/dataset/key/OccurrencesTab';
import { DatasetDownloadTab } from '@/routes/dataset/key/DownloadTab';

async function fakeLoader() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {};
}

const baseRoutes: SourceRouteObject[] = [
  {
    element: <GbifRootLayout children={<Outlet />} />,
    children: [
      {
        errorElement: <RootErrorPage />,
        children: [
          {
            index: true,
            loader: fakeLoader,
            element: <HomePage />,
            loadingElement: <p>Loading home page...</p>,
          },
          {
            key: 'occurrence-search-page',
            path: 'occurrence/search',
            loader: occurrenceSearchLoader,
            element: <OccurrenceSearchPage />,
            loadingElement: <p>Loading occurrence search...</p>,
          },
          {
            key: 'occurrence-page',
            path: 'occurrence/:key',
            loader: detailedOccurrenceLoader,
            element: <DetailedOccurrencePage />,
            loadingElement: <DetailedOccurrencePageLoading />,
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
            loadingElement: <p>Loading dataset...</p>,
            children: [
              {
                index: true,
                loader: fakeLoader,
                element: <DatasetAboutTab />,
                loadingElement: <p>Loading dataset about...</p>,
              },
              {
                path: 'dashboard',
                element: <DatasetDashboardTab />,
              },
              {
                path: 'occurrences',
                loader: fakeLoader,
                element: <DatasetOccurrencesTab />,
                loadingElement: <p>Loading dataset occurrences...</p>,
              },
              {
                path: 'download',
                loader: fakeLoader,
                element: <DatasetDownloadTab />,
                loadingElement: <p>Loading dataset download...</p>,
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
            loadingElement: <p>Loading publisher...</p>,
            children: [
              {
                index: true,
                loader: fakeLoader,
                element: <PublisherAboutTab />,
                loadingElement: <p>Loading publisher about...</p>,
              },
              {
                path: 'occurrences',
                loader: fakeLoader,
                element: <PublisherOccurrencesTab />,
                loadingElement: <p>Loading publisher occurrences...</p>,
              },
            ],
          },
          {
            path: 'resource/:key',
            loader: newsLoader,
            element: <News />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
];

export const configureGbifRoutes = (gbifConfig: Config) => configureRoutes(baseRoutes, gbifConfig);
