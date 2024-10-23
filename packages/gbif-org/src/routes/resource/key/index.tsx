import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { AliasHandling, aliasHandlingLoader, AliasHandlingSkeleton } from './aliasHandling';
import { ArticlePage, articlePageLoader, ArticlePageSkeleton } from './article/article';
import {
  CompositionPage,
  compositionPageLoader,
  CompositionPageSkeleton,
} from './composition/composition';
import { DataUsePage, dataUsePageLoader, DataUsePageSkeleton } from './dataUse/dataUse';
import { DocumentPage, documentPageLoader, DocumentPageSkeleton } from './document/document';
import { EventPage, eventPageLoader, EventPageSkeleton } from './event/event';
import { NewsPage, newsPageLoader, NewsPageSkeleton } from './news/news';
import { ProgrammePage, programmePageLoader, ProgrammePageSkeleton } from './programme/programme';
import { projectKeyRoute } from './project';
import { resourceRedirectLoader } from './resourceRedirect';
import { ToolPage, toolPageLoader, ToolPageSkeleton } from './tool/tool';

// These routes are all connected by the fact that
// 1. resource/:key will redirect to the appropriate resource page
// 2. [any-resource]/:key will redirect to the appropriate resource page
// For that reason they are all grouped together here.

export const resourceKeyRoutes: RouteObjectWithPlugins[] = [
  projectKeyRoute,
  {
    id: 'article-key',
    path: 'article/:key',
    loader: articlePageLoader,
    loadingElement: <ArticlePageSkeleton />,
    element: <ArticlePage />,
    isSlugified: true,
  },
  {
    id: 'news-key',
    path: 'news/:key',
    loader: newsPageLoader,
    loadingElement: <NewsPageSkeleton />,
    element: <NewsPage />,
    isSlugified: true,
  },
  {
    id: 'event-key',
    path: 'event/:key',
    loader: eventPageLoader,
    loadingElement: <EventPageSkeleton />,
    element: <EventPage />,
    isSlugified: true,
  },
  {
    id: 'tool-key',
    path: 'tool/:key',
    loader: toolPageLoader,
    loadingElement: <ToolPageSkeleton />,
    element: <ToolPage />,
    isSlugified: true,
  },
  {
    id: 'data-use-key',
    path: 'data-use/:key',
    loader: dataUsePageLoader,
    loadingElement: <DataUsePageSkeleton />,
    element: <DataUsePage />,
    isSlugified: true,
  },
  {
    id: 'document-key',
    path: 'document/:key',
    loader: documentPageLoader,
    loadingElement: <DocumentPageSkeleton />,
    element: <DocumentPage />,
    isSlugified: true,
  },
  {
    id: 'programme-key',
    path: 'programme/:key',
    loader: programmePageLoader,
    loadingElement: <ProgrammePageSkeleton />,
    element: <ProgrammePage />,
    isSlugified: true,
  },
  {
    id: 'composition-key',
    path: 'composition/:key',
    loader: compositionPageLoader,
    loadingElement: <CompositionPageSkeleton />,
    element: <CompositionPage />,
    isSlugified: true,
  },
  {
    id: 'resource-redirect-key',
    path: 'resource/:key',
    loader: resourceRedirectLoader,
    loadingElement: <AliasHandlingSkeleton />,
  },
  {
    id: 'alias-handling',
    path: ':alias',
    loader: aliasHandlingLoader,
    loadingElement: <AliasHandlingSkeleton />,
    element: <AliasHandling />,
  },
];
