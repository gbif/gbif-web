import { RouteMetadata } from '@/types';
import React from 'react';

const MetadataRoutesContext = React.createContext<RouteMetadata[] | null>(null);

type Props = {
  children?: React.ReactNode;
  metadataRoutes: RouteMetadata[];
};

export function MetadataRoutesProvider({ metadataRoutes, children }: Props) {
  return (
    <MetadataRoutesContext.Provider value={metadataRoutes}>
      {children}
    </MetadataRoutesContext.Provider>
  );
}

export function useMetadataRoutes() {
  const metadataRoutes = React.useContext(MetadataRoutesContext);

  if (!metadataRoutes) {
    throw new Error('useMetadataRoutes must be used within a MetadataRoutesProvider');
  }

  return metadataRoutes;
}
