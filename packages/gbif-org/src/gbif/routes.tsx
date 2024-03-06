import { Outlet } from 'react-router-dom';
import { GbifRootLayout, headerLoader } from '@/components/GbifRootLayout';
import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage } from '@/routes/HomePage';
import { NotFound } from '@/routes/NotFound';
import { RootErrorPage } from '@/routes/RootErrorPage';
import {
  DetailedOccurrencePage,
  DetailedOccurrencePageSkeleton,
  detailedOccurrencePageLoader,
} from '@/routes/occurrence/key/DetailedOccurrencePage';
import { OccurrenceSearchPage } from '@/routes/occurrence/search/OccurrenceSearchPage';
import { InputConfig, configBuilder } from '@/contexts/config/config';
import { DatasetPage, DatasetPageSkeleton, datasetLoader } from '@/routes/dataset/key/DatasetPage';
import {
  PublisherPage,
  PublisherPageSkeleton,
  publisherLoader,
} from '@/routes/publisher/key/PublisherPage';
import {
  NewsPage,
  NewsPageSkeleton,
  newsPageLoader,
  newsSlugifyKeySelector,
} from '@/routes/resource/key/news/news';
import { PublisherAboutTab } from '@/routes/publisher/key/AboutTab';
import { PublisherOccurrencesTab } from '@/routes/publisher/key/OccurrencesTab';
import { DatasetAboutTab } from '@/routes/dataset/key/AboutTab';
import { DatasetDashboardTab } from '@/routes/dataset/key/DashboardTab';
import { DatasetOccurrencesTab } from '@/routes/dataset/key/OccurrencesTab';
import { DatasetDownloadTab } from '@/routes/dataset/key/DownloadTab';
import {
  DataUsePage,
  DataUsePageSkeleton,
  dataUsePageLoader,
  dataUseSlugifyKeySelector,
} from '@/routes/resource/key/data-use/data-use';
import {
  EventPage,
  EventPageSkeleton,
  eventPageLoader,
  eventSlugifyKeySelector,
} from '@/routes/resource/key/event/event';
import {
  ArticlePage,
  ArticlePageSkeleton,
  articlePageLoader,
  articleSlugifyKeySelector,
} from '@/routes/resource/key/article/article';
import {
  ToolPage,
  ToolPageSkeleton,
  toolPageLoader,
  toolSlugifyKeySelector,
} from '@/routes/resource/key/tool/tool';
import {
  ProgrammePage,
  ProgrammePageSkeleton,
  programmePageLoader,
  programmeSlugifyKeySelector,
} from '@/routes/resource/key/programme/programme';
import {
  CompositionPage,
  CompositionPageSkeleton,
  compositionPageLoader,
  compositionSlugifyKeySelector,
} from '@/routes/resource/key/composition/composition';
import {
  DocumentPage,
  DocumentPageSkeleton,
  documentPageLoader,
  documentSlugifyKeySelector,
} from '@/routes/resource/key/document/document';
import {
  ProjectAboutTab,
  ProjectDatasetsTab,
  ProjectNewsAndEventsTab,
  ProjectNewsAndEventsTabSkeleton,
  ProjectPage,
  ProjectPageSkeleton,
  projectNewsAndEventsLoader,
  projectPageLoader,
  projectSlugifyKeySelector,
} from '@/routes/resource/key/project';
import { RouteId } from '@/hooks/useParentRouteLoaderData';

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
            element: <OccurrenceSearchPage />,
          },
          {
            key: 'occurrence-page',
            path: 'occurrence/:key',
            loader: detailedOccurrencePageLoader,
            loadingElement: <DetailedOccurrencePageSkeleton />,
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
            loadingElement: <DatasetPageSkeleton />,
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
            loadingElement: <PublisherPageSkeleton />,
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
            loader: newsPageLoader,
            loadingElement: <NewsPageSkeleton />,
            element: <NewsPage />,
            slugifyKeySelector: newsSlugifyKeySelector,
          },
          {
            path: 'event/:key',
            loader: eventPageLoader,
            loadingElement: <EventPageSkeleton />,
            element: <EventPage />,
            slugifyKeySelector: eventSlugifyKeySelector,
          },
          {
            path: 'tool/:key',
            loader: toolPageLoader,
            loadingElement: <ToolPageSkeleton />,
            element: <ToolPage />,
            slugifyKeySelector: toolSlugifyKeySelector,
          },
          {
            path: 'data-use/:key',
            loader: dataUsePageLoader,
            loadingElement: <DataUsePageSkeleton />,
            element: <DataUsePage />,
            slugifyKeySelector: dataUseSlugifyKeySelector,
          },
          {
            path: 'article/:key',
            loader: articlePageLoader,
            loadingElement: <ArticlePageSkeleton />,
            element: <ArticlePage />,
            slugifyKeySelector: articleSlugifyKeySelector,
          },
          {
            path: 'document/:key',
            loader: documentPageLoader,
            loadingElement: <DocumentPageSkeleton />,
            element: <DocumentPage />,
            slugifyKeySelector: documentSlugifyKeySelector,
          },
          {
            path: 'programme/:key',
            loader: programmePageLoader,
            loadingElement: <ProgrammePageSkeleton />,
            element: <ProgrammePage />,
            slugifyKeySelector: programmeSlugifyKeySelector,
          },
          {
            path: 'composition/:key',
            loader: compositionPageLoader,
            loadingElement: <CompositionPageSkeleton />,
            element: <CompositionPage />,
            slugifyKeySelector: compositionSlugifyKeySelector,
          },
          {
            id: RouteId.Project,
            path: 'project/:key',
            loader: projectPageLoader,
            loadingElement: <ProjectPageSkeleton />,
            element: <ProjectPage />,
            slugifyKeySelector: projectSlugifyKeySelector,
            children: [
              {
                index: true,
                element: <ProjectAboutTab />,
              },
              {
                path: 'news',
                element: <ProjectNewsAndEventsTab />,
                loadingElement: <ProjectNewsAndEventsTabSkeleton />,
                loader: projectNewsAndEventsLoader,
              },
              {
                path: 'datasets',
                element: <ProjectDatasetsTab />,
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
  configureRoutes(baseRoutes, configBuilder(gbifConfig));
