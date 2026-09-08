import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab } from '../_shared/toolLayout';
import { ValidationReportLayout } from './ValidationReportLayout';

const ValidationReportPage = React.lazy(() => import('./ValidationReportPage'));

const validationReportPageElement = (
  <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
    <ValidationReportPage />
  </StaticRenderSuspence>
);

export const validationReportRoute: RouteObjectWithPlugins = {
  id: 'validationReport',
  path: 'tools/validation-report',
  loader: createToolLayoutLoader('dp_data_validator'),
  element: <ValidationReportLayout defaultTitle="Darwin Core data package validator" />,
  children: [
    {
      index: true,
      element: validationReportPageElement,
    },
    {
      path: 'dataset/:key',
      element: validationReportPageElement,
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
