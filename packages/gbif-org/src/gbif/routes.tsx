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
import { News, NewsSkeleton, newsLoader } from '@/routes/resource/key/news/news';
import { PublisherAboutTab } from '@/routes/publisher/key/AboutTab';
import { PublisherOccurrencesTab } from '@/routes/publisher/key/OccurrencesTab';
import { DatasetAboutTab } from '@/routes/dataset/key/AboutTab';
import { DatasetDashboardTab } from '@/routes/dataset/key/DashboardTab';
import { DatasetOccurrencesTab } from '@/routes/dataset/key/OccurrencesTab';
import { DatasetDownloadTab } from '@/routes/dataset/key/DownloadTab';
import { DataUse, dataUseLoader } from '@/routes/resource/key/data-use/data-use';
import { Event, eventLoader } from '@/routes/resource/key/event/event';
import { Article, articleLoader } from '@/routes/resource/key/article/article';
import { Tool, toolLoader } from '@/routes/resource/key/tool/tool';
import { Project, projectLoader, AboutTab as ProjectAboutTab, DatasetsTab as ProjectDatasetsTab, projectNewsLoader, projectDatasetsLoader, NewsTab as ProjectNewsTab, projectAboutLoader } from '@/routes/resource/key/project';
import { Programme, ProgrammeSkeleton, programmeLoader } from '@/routes/resource/key/programme/programme';
import { Composition, CompositionSkeleton, compositionLoader } from '@/routes/resource/key/composition/composition';

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
            loadingElement: <NewsSkeleton />,
            element: <News />,
          },
          {
            path: 'article/:key',
            loader: articleLoader,
            loadingElement: <p>Loading article...</p>,
            element: <Article />,
          },
          {
            path: 'event/:key',
            loader: eventLoader,
            loadingElement: <p>Loading event...</p>,
            element: <Event />,
          },
          {
            path: 'tool/:key',
            loader: toolLoader,
            loadingElement: <p>Loading tool...</p>,
            element: <Tool />,
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
            path: 'programme/:key',
            loader: programmeLoader,
            loadingElement: <ProgrammeSkeleton />,
            element: <Programme />,
          },
          {
            path: 'composition/:key',
            loader: compositionLoader,
            loadingElement: <CompositionSkeleton />,
            element: <Composition />,
          },
          {
            path: 'project/:key',
            loader: projectLoader,
            loadingElement: <p>Loading data use...</p>,
            element: <Project />,
            children: [
              {
                index: true,
                element: <ProjectAboutTab />,
                loader: projectAboutLoader,
              },
              {
                path: 'news',
                element: <ProjectNewsTab />,
                loader: projectNewsLoader,
              },
              {
                path: 'datasets',
                element: <ProjectDatasetsTab />,
                loader: projectDatasetsLoader,
              },
            ],
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
