import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React, { Suspense } from 'react';
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
        <Suspense fallback={null}>
          <NameParserPage />
        </Suspense>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
