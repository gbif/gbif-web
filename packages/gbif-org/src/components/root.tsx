// import '@/index.css';
import { Config, ConfigProvider, OverwriteConfigProvider } from '@/config/config';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type Props = {
  config: Config;
  children: React.ReactNode;
  helmetContext?: {};
};

export function Root({ config, helmetContext, children }: Props) {
  return (
    <React.StrictMode>
      <ConfigProvider config={config}>
        <HelmetProvider context={helmetContext}>
          <Helmet>
            <title>{config.defaultTitle}</title>
          </Helmet>
          {children}
        </HelmetProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}

export function StandaloneRoot({ config, children }: Omit<Props, 'helmetContext'>) {
  return (
    <React.StrictMode>
      <OverwriteConfigProvider config={config}>
        <HelmetProvider>{children}</HelmetProvider>
      </OverwriteConfigProvider>
    </React.StrictMode>
  );
}
