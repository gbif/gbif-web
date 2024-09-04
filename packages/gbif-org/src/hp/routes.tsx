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
import { Config } from '@/contexts/config/config';
import { DatasetPage, DatasetPageSkeleton, datasetLoader } from '@/routes/dataset/key/datasetKey';
import { DatasetKeyAbout } from '@/routes/dataset/key/about';
import { DatasetKeyDashboard } from '@/routes/dataset/key/dashboard';
import { DatasetKeyOccurrences } from '@/routes/dataset/key/occurrences';
import { DatasetKeyDownload } from '@/routes/dataset/key/download';
import {
  PublisherPage,
  PublisherPageSkeleton,
  publisherLoader,
} from '@/routes/publisher/key/publisherKey';
import { PublisherKeyAbout } from '@/routes/publisher/key/about';
import { PublisherKeyMetrics } from '@/routes/publisher/key/metrics';
import { NewsPage, NewsPageSkeleton, newsPageLoader } from '@/routes/resource/key/news/news';
import {
  InstitutionKey,
  InstitutionKeyAbout,
  InstitutionKeyCollection,
  InstitutionKeySpecimens,
  institutionLoader,
} from '@/routes/institution/key';
import { RouteId } from '@/hooks/useParentRouteLoaderData';
import { OccurrenceKeyAbout } from '@/routes/occurrence/key/about';
import { OccurrenceKeyPhylo } from '@/routes/occurrence/key/phylogenies';
import { OccurrenceKeyCluster } from '@/routes/occurrence/key/cluster';
import { PublisherKeyCitations } from '@/routes/publisher/key/citations';
import {
  InstallationPage,
  InstallationPageSkeleton,
  installationLoader,
} from '@/routes/installation/key/installationKey';
import { InstallationKeyAbout } from '@/routes/installation/key/about';
import { NetworkPage, NetworkPageSkeleton, networkLoader } from '@/routes/network/key/networkKey';
import { NetworkKeyAbout } from '@/routes/network/key/about';
import { NetworkKeyMetrics } from '@/routes/network/key/metrics';
import { NetworkKeyDataset } from '@/routes/network/key/dataset';
import { NetworkKeyPublisher } from '@/routes/network/key/publisher';
import {
  CollectionKey,
  CollectionKeyAbout,
  CollectionKeyDashboard,
  CollectionKeySpecimens,
  collectionLoader,
} from '@/routes/collection/key';
import { EventPage, EventPageSkeleton, eventPageLoader } from '@/routes/resource/key/event/event';
import { ToolPage, ToolPageSkeleton, toolPageLoader } from '@/routes/resource/key/tool/tool';
import {
  DataUsePage,
  DataUsePageSkeleton,
  dataUsePageLoader,
} from '@/routes/resource/key/dataUse/dataUse';
import {
  ArticlePage,
  ArticlePageSkeleton,
  articlePageLoader,
} from '@/routes/resource/key/article/article';
import {
  DocumentPage,
  DocumentPageSkeleton,
  documentPageLoader,
} from '@/routes/resource/key/document/document';
import {
  ProgrammePage,
  ProgrammePageSkeleton,
  programmePageLoader,
} from '@/routes/resource/key/programme/programme';
import {
  CompositionPage,
  CompositionPageSkeleton,
  compositionPageLoader,
} from '@/routes/resource/key/composition/composition';
import {
  ProjectAboutTab,
  ProjectDatasetsTab,
  ProjectNewsAndEventsTab,
  ProjectNewsAndEventsTabSkeleton,
  ProjectPage,
  ProjectPageSkeleton,
  projectNewsAndEventsLoader,
  projectPageLoader,
} from '@/routes/resource/key/project';
import {
  AliasHandling,
  AliasHandlingSkeleton,
  aliasHandlingLoader,
} from '@/routes/resource/key/aliasHandling';
import { DatasetSearchPage } from '@/routes/dataset/search/datasetSearch';
import { InstitutionSearchPage } from '@/routes/institution/search/searchPage';
import { CollectionSearchPage } from '@/routes/collection/search/searchPage';
import { PublisherSearchPage } from '@/routes/publisher/search/publisherSearch';
import { HpRootLayout } from './hpRootLayout';
import { Outlet } from 'react-router-dom';

const baseRoutes: SourceRouteObject[] = [
  {
    element: <HpRootLayout children={<Outlet />} />,
    children: [
      {
        errorElement: <RootErrorPage />,
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
                id: RouteId.Occurrence,
                path: 'occurrence/:key',
                loader: occurrenceKeyLoader,
                loadingElement: <OccurrenceKeySkeleton />,
                element: <OccurrenceKey />,
                children: [
                  {
                    index: true,
                    element: <OccurrenceKeyAbout />,
                  },
                  {
                    path: 'phylogenies',
                    element: <OccurrenceKeyPhylo />,
                  },
                  {
                    path: 'related',
                    element: <OccurrenceKeyCluster />,
                  },
                ],
              },
              {
                key: 'dataset-search-page',
                path: 'dataset/search',
                element: <DatasetSearchPage />,
              },
              {
                key: 'publisher-search-page',
                path: 'publisher/search',
                element: <PublisherSearchPage />,
              },
              {
                key: 'collection-search-page',
                path: 'collection/search',
                element: <CollectionSearchPage />,
              },
              {
                key: 'institution-search-page',
                path: 'institution/search',
                element: <InstitutionSearchPage />,
              },
              {
                id: RouteId.Dataset,
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
                id: RouteId.Publisher,
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
                    element: <PublisherKeyAbout />,
                  },
                  {
                    path: 'metrics',
                    element: <PublisherKeyMetrics />,
                  },
                  {
                    path: 'citations',
                    element: <PublisherKeyCitations />,
                  },
                ],
              },
              {
                id: RouteId.Installation,
                gbifRedirect: (params) => {
                  if (typeof params.key !== 'string') throw new Error('Invalid key');
                  return `https://www.gbif.org/installation/${params.key}`;
                },
                path: 'installation/:key',
                loader: installationLoader,
                loadingElement: <InstallationPageSkeleton />,
                element: <InstallationPage />,
                children: [
                  {
                    index: true,
                    element: <InstallationKeyAbout />,
                  },
                ],
              },
              {
                id: RouteId.Network,
                gbifRedirect: (params) => {
                  if (typeof params.key !== 'string') throw new Error('Invalid key');
                  return `https://www.gbif.org/network/${params.key}`;
                },
                path: 'network/:key',
                loader: networkLoader,
                loadingElement: <NetworkPageSkeleton />,
                element: <NetworkPage />,
                children: [
                  {
                    index: true,
                    element: <NetworkKeyAbout />,
                  },
                  {
                    path: 'metrics',
                    element: <NetworkKeyMetrics />,
                  },
                  {
                    path: 'dataset',
                    element: <NetworkKeyDataset />,
                  },
                  {
                    path: 'publisher',
                    element: <NetworkKeyPublisher />,
                  },
                ],
              },
              {
                id: RouteId.Institution, // TODO @daniel is there a reason for key vs id?
                gbifRedirect: (params) => {
                  if (typeof params.key !== 'string') throw new Error('Invalid key');
                  return `https://www.gbif.org/institution/${params.key}`;
                },
                path: 'institution/:key',
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
                id: RouteId.Collection,
                gbifRedirect: (params) => {
                  if (typeof params.key !== 'string') throw new Error('Invalid key');
                  return `https://www.gbif.org/collection/${params.key}`;
                },
                path: 'collection/:key',
                loader: collectionLoader,
                element: <CollectionKey />,
                children: [
                  {
                    index: true,
                    element: <CollectionKeyAbout />,
                  },
                  {
                    path: 'specimen',
                    element: <CollectionKeySpecimens />,
                  },
                  {
                    path: 'dashboard',
                    element: <CollectionKeyDashboard />,
                  },
                ],
              },
              {
                path: 'news/:key',
                loader: newsPageLoader,
                loadingElement: <NewsPageSkeleton />,
                element: <NewsPage />,
                isSlugified: true,
              },
              {
                path: 'event/:key',
                loader: eventPageLoader,
                loadingElement: <EventPageSkeleton />,
                element: <EventPage />,
                isSlugified: true,
              },
              {
                path: 'tool/:key',
                loader: toolPageLoader,
                loadingElement: <ToolPageSkeleton />,
                element: <ToolPage />,
                isSlugified: true,
              },
              {
                path: 'data-use/:key',
                loader: dataUsePageLoader,
                loadingElement: <DataUsePageSkeleton />,
                element: <DataUsePage />,
                isSlugified: true,
              },
              {
                path: 'article/:key',
                loader: articlePageLoader,
                loadingElement: <ArticlePageSkeleton />,
                element: <ArticlePage />,
                isSlugified: true,
              },
              {
                path: 'document/:key',
                loader: documentPageLoader,
                loadingElement: <DocumentPageSkeleton />,
                element: <DocumentPage />,
                isSlugified: true,
              },
              {
                path: 'programme/:key',
                loader: programmePageLoader,
                loadingElement: <ProgrammePageSkeleton />,
                element: <ProgrammePage />,
                isSlugified: true,
              },
              {
                path: 'composition/:key',
                loader: compositionPageLoader,
                loadingElement: <CompositionPageSkeleton />,
                element: <CompositionPage />,
                isSlugified: true,
              },
              {
                id: RouteId.Project,
                path: 'project/:key',
                loader: projectPageLoader,
                loadingElement: <ProjectPageSkeleton />,
                element: <ProjectPage />,
                isSlugified: true,
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
                path: ':alias',
                loader: aliasHandlingLoader,
                loadingElement: <AliasHandlingSkeleton />,
                element: <AliasHandling />,
              },
              {
                path: '*',
                // Delegate handling of 404 to RootErrorPage,
                element: <ThrowOn404 />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const configureHostedPortalRoutes = (hostedPortalConfig: Config) =>
  configureRoutes(baseRoutes, hostedPortalConfig);
