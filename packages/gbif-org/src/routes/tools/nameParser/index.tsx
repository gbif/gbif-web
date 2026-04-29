import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React, { Suspense } from 'react';

const NameParserPage = React.lazy(() => import('./NameParserPage'));

export const nameParserRoute: RouteObjectWithPlugins = {
  id: 'nameParser',
  path: 'tools/name-parser',
  element: (
    <Suspense fallback={null}>
      <NameParserPage />
    </Suspense>
  ),
};
