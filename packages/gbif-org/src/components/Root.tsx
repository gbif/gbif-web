import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Config, ConfigProvider } from '@/contexts/config';
import { MetadataRoutesProvider } from '@/contexts/metadataRoutes';
import { RouteMetadata } from '@/types';
import { LoadingElementProvider } from '@/contexts/loadingElement';

type Props = {
  config: Config;
  children: React.ReactNode;
  helmetContext?: {};
  metadataRoutes: RouteMetadata[];
};

export function Root({ config, helmetContext, children, metadataRoutes }: Props) {
  return (
    <React.StrictMode>
      <ConfigProvider config={config}>
        <MetadataRoutesProvider metadataRoutes={metadataRoutes}>
          <LoadingElementProvider>
            <HelmetProvider context={helmetContext}>
              <Helmet>
                <title>{config.defaultTitle}</title>
              </Helmet>
              {children}
            </HelmetProvider>
          </LoadingElementProvider>
        </MetadataRoutesProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
