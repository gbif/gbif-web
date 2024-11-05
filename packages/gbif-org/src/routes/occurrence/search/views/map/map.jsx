import { ClientSideOnly } from "@/components/clientSideOnly";
import React from "react";
// const MapComponent = React.lazy(() => import('./test'));
const MapComponent = React.lazy(() => import('./Map/index'));

export function Map() {
  return <ClientSideOnly>
    <MapComponent />
  </ClientSideOnly>
}