import { Outlet, redirectDocument } from 'react-router-dom';
import { GbifRootLayout, headerLoader } from './gbifRootLayout';
import { SourceRouteObject } from '@/types';
import { configureRoutes } from '@/utils/configureRoutes';
import { HomePage, homepageLoader } from '@/routes/homePage';
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
import {
  PublisherPage,
  PublisherPageSkeleton,
  publisherLoader,
} from '@/routes/publisher/key/publisherKey';
import { NewsPage, NewsPageSkeleton, newsPageLoader } from '@/routes/resource/key/news/news';
import { PublisherKeyAbout } from '@/routes/publisher/key/about';
import { PublisherKeyMetrics } from '@/routes/publisher/key/metrics';
import { DatasetKeyAbout } from '@/routes/dataset/key/about';
import { DatasetKeyDashboard } from '@/routes/dataset/key/dashboard';
import { DatasetKeyOccurrences } from '@/routes/dataset/key/occurrences';
import { DatasetKeyDownload } from '@/routes/dataset/key/download';
import {
  DataUsePage,
  DataUsePageSkeleton,
  dataUsePageLoader,
} from '@/routes/resource/key/dataUse/dataUse';
import { EventPage, EventPageSkeleton, eventPageLoader } from '@/routes/resource/key/event/event';
import {
  ArticlePage,
  ArticlePageSkeleton,
  articlePageLoader,
} from '@/routes/resource/key/article/article';
import { ToolPage, ToolPageSkeleton, toolPageLoader } from '@/routes/resource/key/tool/tool';
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
  DocumentPage,
  DocumentPageSkeleton,
  documentPageLoader,
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
} from '@/routes/resource/key/project';
import { RouteId } from '@/hooks/useParentRouteLoaderData';
import {
  AliasHandling,
  AliasHandlingSkeleton,
  aliasHandlingLoader,
} from '@/routes/resource/key/aliasHandling';
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
  InstitutionKey,
  InstitutionKeyAbout,
  InstitutionKeyCollection,
  InstitutionKeySpecimens,
  institutionLoader,
} from '@/routes/institution/key';
import {
  CollectionKey,
  CollectionKeyAbout,
  CollectionKeyDashboard,
  CollectionKeySpecimens,
  collectionLoader,
} from '@/routes/collection/key';
import { OccurrenceKeyCluster } from '@/routes/occurrence/key/cluster';
import { OccurrenceKeyPhylo } from '@/routes/occurrence/key/phylogenies';
import { OccurrenceKeyAbout } from '@/routes/occurrence/key/about';
import {
  ConfirmEndorsmentPage,
  confirmEndorsmentLoader,
} from '@/routes/publisher/ConfirmEndorsment';
import { BecomeAPublisherPage, becomeAPublisherPageLoader } from '@/routes/custom/becomeAPublisher';
import { SuggestDatasetPage } from '@/routes/custom/suggestDataset';
import { DatasetSearchPage } from '@/routes/dataset/search/datasetSearch';
import { PublisherSearchPage } from '@/routes/publisher/search/publisherSearch';
import { CollectionSearchPage } from '@/routes/collection/search/searchPage';
import { InstitutionSearchPage } from '@/routes/institution/search/searchPage';
import { OccurrenceFragment, occurrenceFragmentLoader } from '@/routes/occurrence/key/fragment';
import { resourceRedirectLoader } from '@/routes/resource/key/resourceRedirect';
import { ResourceSearchPage } from '@/routes/resource/search/resourceSearch';

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
            loader: homepageLoader,
          },
          {
            path: 'login',
            element: <NotImplemented />,
          },
          {
            path: 'suggest-dataset',
            element: <SuggestDatasetPage />,
          },
          {
            path: 'become-a-publisher',
            element: <BecomeAPublisherPage />,
            loader: becomeAPublisherPageLoader,
          },
          {
            key: 'occurrence-search-page',
            path: 'occurrence/search',
            element: <OccurrenceSearchPage />,
          },
          {
            path: 'occurrence/:key/fragment',
            element: <OccurrenceFragment />,
            loader: occurrenceFragmentLoader,
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
            path: 'developer/summary',
            loader: () => redirectDocument('https://techdocs.gbif.org/en/openapi'),
          },
          {
            id: RouteId.Dataset,
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
            path: 'publisher/confirm',
            element: <ConfirmEndorsmentPage />,
            loader: confirmEndorsmentLoader,
          },
          {
            id: RouteId.Country,
            gbifRedirect: (params) => {
              if (typeof params.key !== 'string') throw new Error('Invalid key');
              return `https://www.gbif.org/country/${params.key}`;
            },
            path: 'country/:key',
            element: <NotImplemented />,
          },
          {
            path: 'participant/:key',
            element: <NotImplemented />,
          },
          {
            path: 'species/search',
            element: <NotImplemented />,
          },
          {
            path: 'species/:key',
            element: <NotImplemented />
          },
          {
            path: 'resource/search',
            element: <NotImplemented />
          },
          {
            path: 'tools/species-lookup',
            element: <NotImplemented />
          },
          {
            path: 'tools/name-parser',
            element: <NotImplemented />
          },
          {
            path: 'tools/sequence-id',
            element: <NotImplemented />
          },
          {
            path: 'tools/data-validator',
            element: <NotImplemented />
          },
          {
            path: 'tools/observation-trends',
            element: <NotImplemented />
          },
          {
            path: 'occurrence-snapshots',
            element: <NotImplemented />
          },
          {
            path: 'analytics/global',
            element: <NotImplemented />
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
            path: 'resource/:key',
            loader: resourceRedirectLoader,
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
];

export const configureGbifRoutes = (gbifConfig: Config) => configureRoutes(baseRoutes, gbifConfig);


function NotImplemented() {
  return <main className="g-h-full g-text-center">
    <h1 className="g-mt-48 g-text-4xl g-font-bold g-text-slate-400">Not implemented yet</h1>
  </main>
}