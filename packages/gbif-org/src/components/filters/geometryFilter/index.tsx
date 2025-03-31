import { Spinner } from '@/components/ui/spinner';
import React, { Suspense } from 'react';

const GeomFilter = React.lazy(() => import('./geometryFilter'));

export function GeometryFilter({ ...props }) {
  return (
    <Suspense
      fallback={
        <div className="g-mx-auto g-text-center">
          <Spinner className="g-w-12 g-h-12 g-text-center g-inline-block g-my-4" />
        </div>
      }
    >
      <GeomFilter {...props} />
    </Suspense>
  );
}
