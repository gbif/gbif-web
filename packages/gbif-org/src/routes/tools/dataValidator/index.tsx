import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab } from '../_shared/toolLayout';
import { DataValidatorLayout } from './dataValidatorLayout';

const UploadPage = React.lazy(() => import('./upload/UploadPage'));
const ResultPage = React.lazy(() => import('./report/ResultPage'));
const MetadataPage = React.lazy(() => import('./document/MetadataPage'));
const MyValidationsPage = React.lazy(() => import('./myValidations/MyValidationsPage'));

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
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <MyValidationsPage />
        </StaticRenderSuspence>
      ),
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
