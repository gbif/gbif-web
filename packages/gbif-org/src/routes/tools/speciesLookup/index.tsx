import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab, ToolLayout } from '../_shared/toolLayout';
import { ApiContent } from './help';

const SpeciesLookupPage = React.lazy(() => import('./SpeciesLookupPage'));

export const speciesLookupRoute: RouteObjectWithPlugins = {
  id: 'speciesLookup',
  path: 'tools/species-lookup',
  loader: createToolLayoutLoader('species_matching'),
  element: <ToolLayout defaultTitle="Species lookup" apiContent={<ApiContent />} />,
  children: [
    {
      index: true,
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <SpeciesLookupPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
