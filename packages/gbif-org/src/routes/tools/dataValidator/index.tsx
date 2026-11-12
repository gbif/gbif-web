import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab } from '../_shared/toolLayout';
import { DATA_VALIDATOR_ROUTE_ID } from './data/useDataValidatorCmsData';
import { DataValidatorKeyLayout } from './dataValidatorKeyLayout';
import { DataValidatorRootLayout } from './dataValidatorLayout';
import { MetadataPageSkeleton } from './document/MetadataSkeleton';
import { ReportPageSkeleton } from './report/ReportSkeleton';

const UploadPage = React.lazy(() => import('./upload/UploadPage'));
const ResultPage = React.lazy(() => import('./report/ResultPage'));
const MetadataPage = React.lazy(() => import('./document/MetadataPage'));
const MyValidationsPage = React.lazy(() => import('./myValidations/MyValidationsPage'));

export const dataValidatorRoute: RouteObjectWithPlugins = {
  id: DATA_VALIDATOR_ROUTE_ID,
  path: 'tools/data-validator',
  // the CMS entry has no machine identifier yet
  loader: createToolLayoutLoader('data_validator', { fallbackId: '81281' }),
  children: [
    {
      element: <DataValidatorRootLayout />,
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
      ],
    },
    {
      path: ':key',
      element: <DataValidatorKeyLayout />,
      children: [
        {
          index: true,
          element: (
            <StaticRenderSuspence fallback={<ReportPageSkeleton />}>
              <ResultPage />
            </StaticRenderSuspence>
          ),
        },
        {
          path: 'document',
          element: (
            <StaticRenderSuspence fallback={<MetadataPageSkeleton />}>
              <MetadataPage />
            </StaticRenderSuspence>
          ),
        },
      ],
    },
  ],
};
