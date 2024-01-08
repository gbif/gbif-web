import { Outlet } from 'react-router-dom';
import { GbifRootLayout, headerLoader } from '@/components/GbifRootLayout';
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
import { OccurrenceSearchPage } from '@/routes/occurrence/search/OccurrenceSearchPage';
import { InputConfig, processConfig } from '@/contexts/config/config';
import { DatasetPage, datasetLoader } from '@/routes/dataset/key/DatasetPage';
import { PublisherPage, publisherLoader } from '@/routes/publisher/key/PublisherPage';
import { News, newsLoader } from '@/routes/resource/key/news/news';
import { PublisherAboutTab } from '@/routes/publisher/key/AboutTab';
import { PublisherOccurrencesTab } from '@/routes/publisher/key/OccurrencesTab';
import { DatasetAboutTab } from '@/routes/dataset/key/AboutTab';
import { DatasetDashboardTab } from '@/routes/dataset/key/DashboardTab';
import { DatasetOccurrencesTab } from '@/routes/dataset/key/OccurrencesTab';
import { DatasetDownloadTab } from '@/routes/dataset/key/DownloadTab';
import { DataUse, dataUseLoader } from '@/routes/resource/key/data-use/data-use';
import { Article, articleLoader,  } from '@/routes/resource/key/article/article';

const baseRoutes: SourceRouteObject[] = [
  {
    element: <GbifRootLayout children={<Outlet />} />,
    loader: headerLoader,
    children: [
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
            loadingElement: <p>Loading occurrence search...</p>,
            element: <OccurrenceSearchPage />,
          },
          {
            key: 'occurrence-page',
            path: 'occurrence/:key',
            loader: detailedOccurrenceLoader,
            loadingElement: <DetailedOccurrencePageLoading />,
            element: <DetailedOccurrencePage />,
          },
          {
            key: 'dataset-page',
            gbifRedirect: (params) => {
              if (typeof params.key !== 'string') throw new Error('Invalid key');
              return `https://www.gbif.org/dataset/${params.key}`;
            },
            path: 'dataset/:key',
            loader: datasetLoader,
            loadingElement: <p>Loading dataset...</p>,
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
            loadingElement: <p>Loading publisher...</p>,
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
            path: 'news/:key',
            loader: newsLoader,
            loadingElement: <p>Loading news...</p>,
            element: <News />,
          },
          {
            path: 'data-use/:key',
            loader: dataUseLoader,
            loadingElement: <p>Loading data use...</p>,
            element: <DataUse />,
          },
          {
            path: 'article/:key',
            loader: articleLoader,
            loadingElement: <p>Loading data use...</p>,
            element: <Article />,
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

export const configureGbifRoutes = (gbifConfig: InputConfig) =>
  configureRoutes(baseRoutes, processConfig(gbifConfig));
