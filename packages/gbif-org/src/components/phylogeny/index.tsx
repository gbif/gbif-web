import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import React from 'react';
import { PhylogenySkeleton } from './phylogenySkeleton';

const LazyPhylogeny = React.lazy(() => import('./phylogeny'));

// phylotree mounts into a live DOM node, so it can never render on the server.
function Phylogeny(props: React.ComponentProps<typeof LazyPhylogeny>) {
  return (
    <StaticRenderSuspence fallback={<PhylogenySkeleton />}>
      <LazyPhylogeny {...props} />
    </StaticRenderSuspence>
  );
}

export { Phylogeny };
