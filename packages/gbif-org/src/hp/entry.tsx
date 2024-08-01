import '@/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from '@/components/root';
import { Config } from '@/contexts/config/config';
import { configureHostedPortalRoutes } from '@/hp/routes';
import { merge } from 'ts-deepmerge';
import { Endpoints, getDefaultEndpointsBasedOnGbifEnv } from '@/contexts/config/endpoints';

type Props = {
  config: Config;
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

export function render(
  rootElement: HTMLElement,
  config: Omit<Config, keyof Endpoints> & Partial<Endpoints>
) {
  const configWithDefaults = merge.withOptions(
    { allowUndefinedOverrides: false },
    config,
    getDefaultEndpointsBasedOnGbifEnv(config.gbifEnv)
  ) as Config;

  createRoot(rootElement).render(<HostedPortalApp config={configWithDefaults} />);
}
