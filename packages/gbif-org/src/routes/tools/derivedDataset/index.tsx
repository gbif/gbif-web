import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React, { Suspense } from 'react';
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
        <Suspense fallback={null}>
          <DerivedDatasetPage />
        </Suspense>
      ),
    },
    {
      path: 'edit/:doiPrefix/:doiSuffix',
      element: (
        <Suspense fallback={null}>
          <EditDerivedDatasetPage />
        </Suspense>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
