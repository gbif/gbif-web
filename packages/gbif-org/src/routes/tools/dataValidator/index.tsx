import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { redirect } from 'react-router-dom';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab } from '../_shared/toolLayout';
import { DataValidatorLayout } from './dataValidatorLayout';

const UploadPage = React.lazy(() => import('./upload/UploadPage'));
const ResultPage = React.lazy(() => import('./report/ResultPage'));
const MetadataPage = React.lazy(() => import('./document/MetadataPage'));

export const dataValidatorRoute: RouteObjectWithPlugins = {
  id: 'dataValidator',
  path: 'tools/data-validator',
  // the CMS entry has no machine identifier yet
  loader: createToolLayoutLoader('data_validator', { fallbackId: '81281' }),
  element: <DataValidatorLayout />,
  children: [
    {
      index: true,
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <UploadPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab hideAttribution />,
    },
    {
      path: 'my-validations',
      loader: ({ locale }: LoaderArgs) =>
        redirect(`${locale.gbifOrgLocalePrefix}/user/validations`),
    },
    {
      path: ':key',
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <ResultPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: ':key/document',
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <MetadataPage />
        </StaticRenderSuspence>
      ),
    },
  ],
};
