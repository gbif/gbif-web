import { createRoot } from 'react-dom/client';
import { prepareConfig } from './prepareConfig';
import { Config } from '@/config/config';
import { Root } from '@/components/root';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { HpRootLayout } from './hpRootLayout';
import { RootErrorPage } from '@/routes/rootErrorPage';
import StaticDashboard from '@/components/dashboard/StaticDashboard';
import { Predicate } from '@/gql/graphql';

type Props = {
  config: Config;
  predicate: Predicate;
  charts: string[];
};

function DashboardApp({ config, predicate, charts }: Props) {
  const routes = applyReactRouterPlugins(
    [
      {
        element: <HpRootLayout children={<Outlet />} />,
        children: [
          {
            index: true,
            errorElement: <RootErrorPage />,
            element: <StaticDashboard predicate={predicate} charts={charts} />,
          },
        ],
      },
    ],
    config
  );

  const router = createMemoryRouter(routes);

  return (
    <Root config={config}>
      <RouterProvider router={router} fallbackElement={null} />
    </Root>
  );
}

type Options = {
  predicate?: Predicate;
  config?: Config;
  charts?: string[];
  rootElement?: HTMLElement;
};

export function renderDashboard(options: Options) {
  if (options.rootElement == null)
    return console.error('rootElement is required for the dashboard');
  if (options.predicate == null) return console.error('predicate is required for the dashboard');
  if (options.charts == null) return console.error('charts is required for the dashboard');
  if (options.config == null) return console.error('config is required for the dashboard');

  const fullConfig = prepareConfig(options.config);

  console.log('ready to render dashboard');

  createRoot(options.rootElement).render(
    <DashboardApp config={fullConfig} predicate={options.predicate} charts={options.charts} />
  );
}
