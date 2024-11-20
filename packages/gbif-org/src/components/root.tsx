import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ConfigProvider, Config, OverwriteConfigProvider } from '@/config/config';
import { TooltipProvider } from './ui/tooltip';
import { SkeletonLoadingProvider } from '@/reactRouterPlugins/skeletonLoading';

type Props = {
  config: Config;
  children: React.ReactNode;
  helmetContext?: {};
};

export function Root({ config, helmetContext, children }: Props) {
  return (
    <React.StrictMode>
      <ConfigProvider config={config}>
        <SkeletonLoadingProvider>
          <HelmetProvider context={helmetContext}>
            <Helmet>
              <title>{config.defaultTitle}</title>
            </Helmet>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </HelmetProvider>
        </SkeletonLoadingProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}

export function StandaloneRoot({ config, children }: Omit<Props, 'helmetContext'>) {
  return (
    <React.StrictMode>
      <OverwriteConfigProvider config={config}>
        <SkeletonLoadingProvider>
          <HelmetProvider>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </HelmetProvider>
        </SkeletonLoadingProvider>
      </OverwriteConfigProvider>
    </React.StrictMode>
  );
}
