import { Root } from '@/components/root';
import { Config } from '@/config/config';
import { languagesOptions } from '@/config/languagesOptions';
import { createHostedPortalRoutes } from '@/hp/routes';
import '@/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { prepareConfig } from './prepareConfig';
export { renderDashboard } from './dashboard';

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

export function render(rootElement: HTMLElement, config: unknown) {
  const fullConfig = prepareConfig(config);

  createRoot(rootElement).render(<HostedPortalApp config={fullConfig} />);
}

export const languages = languagesOptions;
