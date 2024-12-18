import { Root } from '@/components/root';
import { Config } from '@/config/config';
import { Endpoints, getDefaultEndpointsBasedOnGbifEnv } from '@/config/endpoints';
import { languagesOptions } from '@/config/languagesOptions';
import { createHostedPortalRoutes } from '@/hp/routes';
import '@/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { merge } from 'ts-deepmerge';
import { configAdapter } from './configAdapter';

type Props = {
  config: Config;
};

function HostedPortalApp({ config }: Props): React.ReactElement {
  const routes = createHostedPortalRoutes(config);
  const router = createBrowserRouter(routes);

  return (
    <Root config={config}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>
  );
}

export function render(
  rootElement: HTMLElement,
  config: Omit<Config, keyof Endpoints> & Partial<Endpoints>
) {
  const convertedConfig = configAdapter(config);
  const configWithDefaults = merge.withOptions(
    { allowUndefinedOverrides: false },
    convertedConfig,
    getDefaultEndpointsBasedOnGbifEnv(config.gbifEnv)
  ) as Config;

  createRoot(rootElement).render(<HostedPortalApp config={configWithDefaults} />);
}

export const languages = languagesOptions;
