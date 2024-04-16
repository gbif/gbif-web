import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/homePage';
import { ThrowOn404 } from '@/routes/throwOn404';
import { RootErrorPage } from '@/routes/rootErrorPage';
import {
  OccurrenceKey,
  OccurrenceKeySkeleton,
  occurrenceKeyLoader,
} from '@/routes/occurrence/key/occurrenceKey';
import { OccurrenceSearchPage } from '@/routes/occurrence/search/occurrenceSearchPage';
import { InputConfig, configBuilder } from '@/contexts/config/config';
import { DatasetPage, datasetLoader } from '@/routes/dataset/key/datasetKey';
import { DatasetKeyAbout } from '@/routes/dataset/key/about';
import { DatasetKeyDashboard } from '@/routes/dataset/key/dashboard';
import { DatasetKeyOccurrences } from '@/routes/dataset/key/occurrences';
import { DatasetKeyDownload } from '@/routes/dataset/key/download';
import { PublisherPage, publisherLoader } from '@/routes/publisher/key/publisherKey';
import { PublisherKeyAbout } from '@/routes/publisher/key/about';
import { PublisherKeyMetrics } from '@/routes/publisher/key/metrics';
import { NewsPage, newsPageLoader } from '@/routes/resource/key/news/news';
import { InstitutionKey, InstitutionKeyAbout, InstitutionKeyCollection, InstitutionKeySpecimens, institutionLoader } from '@/routes/institution/key';

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
        loader: occurrenceKeyLoader,
        element: <OccurrenceKey />,
        loadingElement: <OccurrenceKeySkeleton />,
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
            element: <DatasetKeyAbout />,
          },
          {
            path: 'dashboard',
            element: <DatasetKeyDashboard />,
          },
          {
            path: 'occurrences',
            element: <DatasetKeyOccurrences />,
          },
          {
            path: 'download',
            element: <DatasetKeyDownload />,
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
            element: <PublisherKeyAbout />,
          },
          {
            path: 'occurrences',
            element: <PublisherKeyMetrics />,
          },
        ],
      },
      {
        key: 'institution-page',
        gbifRedirect: (params) => {
          if (typeof params.key !== 'string') throw new Error('Invalid key');
          return `https://www.gbif.org/institution/${params.key}`;
        },
        path: 'institution',
        loader: institutionLoader,
        element: <InstitutionKey />,
        children: [
          {
            index: true,
            element: <InstitutionKeyAbout />,
          },
          {
            path: 'specimen',
            element: <InstitutionKeySpecimens />,
          },
          {
            path: 'collection',
            element: <InstitutionKeyCollection />,
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
