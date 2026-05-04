import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React from 'react';
import { ToolCardSkeleton } from '../_shared/toolCardSkeleton';
import { createToolLayoutLoader, ToolAboutTab, ToolLayout } from '../_shared/toolLayout';
import { ApiContent } from './help';

const SequenceIdPage = React.lazy(() => import('./SequenceIdPage'));

export const sequenceIdRoute: RouteObjectWithPlugins = {
  id: 'sequenceId',
  path: 'tools/sequence-id',
  loader: createToolLayoutLoader('sequence_id'),
  element: <ToolLayout defaultTitle="Sequence ID" apiContent={<ApiContent />} />,
  children: [
    {
      index: true,
      element: (
        <StaticRenderSuspence fallback={<ToolCardSkeleton />}>
          <SequenceIdPage />
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
