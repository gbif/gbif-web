import '@/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from '@/components/Root';
import { Config, InputConfig } from '@/contexts/config/config';
import { configureHostedPortalRoutes } from '@/hp/routes';

type Props = {
  config: InputConfig;
};

function HostedPortalApp({ config }: Props): React.ReactElement {
  const { routes, metadataRoutes } = configureHostedPortalRoutes(config);
  const router = createBrowserRouter(routes);

  return (
    <Root config={config} metadataRoutes={metadataRoutes}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>
  );
}

export function render(rootElement: HTMLElement, config: Config) {
  createRoot(rootElement).render(<HostedPortalApp config={config} />);
}
