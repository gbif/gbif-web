import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React, { Suspense } from 'react';

const SpeciesLookupPage = React.lazy(() => import('./SpeciesLookupPage'));

export const speciesLookupRoute: RouteObjectWithPlugins = {
  id: 'speciesLookup',
  path: 'tools/species-lookup',
  element: (
    <Suspense fallback={null}>
      <SpeciesLookupPage />
    </Suspense>
  ),
};
