import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import React, { Suspense } from 'react';
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
        <Suspense fallback={null}>
          <SequenceIdPage />
        </Suspense>
      ),
    },
    {
      path: 'about',
      element: <ToolAboutTab />,
    },
  ],
};
