import { ClientSideOnly } from '@/components/clientSideOnly';
import React from 'react';
const MapComponent = React.lazy(() => import('./Map/index'));

export function Map(props) {
  return (
    <ClientSideOnly>
      <MapComponent {...props} />
    </ClientSideOnly>
  );
}
