import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab } from '../_shared/toolLayout';
import { DerivedDatasetLayout } from './derivedDatasetLayout';
import { ApiContent } from './help';

const DerivedDatasetPage = React.lazy(() => import('./DerivedDatasetPage'));
const EditDerivedDatasetPage = React.lazy(() => import('./EditDerivedDatasetPage'));

export const derivedDatasetRoute: RouteObjectWithPlugins = {
  id: 'derivedDataset',
  path: 'derived-dataset',
  loader: createToolLayoutLoader('derived_dataset'),
  element: <DerivedDatasetLayout defaultTitle="Derived dataset" apiContent={<ApiContent />} />,
  children: [
    {
      index: true,
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <DerivedDatasetPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'edit/:doiPrefix/:doiSuffix',
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <EditDerivedDatasetPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
