import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab, ToolLayout } from '../_shared/toolLayout';
import { ApiContent } from './help';

const NameParserPage = React.lazy(() => import('./NameParserPage'));

export const nameParserRoute: RouteObjectWithPlugins = {
  id: 'nameParser',
  path: 'tools/name-parser',
  loader: createToolLayoutLoader('name_parser'),
  element: <ToolLayout defaultTitle="Name parser" apiContent={<ApiContent />} />,
  children: [
    {
      index: true,
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <NameParserPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
