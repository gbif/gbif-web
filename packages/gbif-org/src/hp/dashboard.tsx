import { createRoot } from 'react-dom/client';
import { prepareConfig } from './prepareConfig';
import { Config, LanguageOption } from '@/config/config';
import { Root } from '@/components/root';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { applyReactRouterPlugins } from '@/reactRouterPlugins';
import { HpRootLayout } from './hpRootLayout';
import { RootErrorPage } from '@/routes/rootErrorPage';
import StaticDashboard from '@/components/dashboard/StaticDashboard';
import { Predicate } from '@/gql/graphql';
import { getStandalonePageContext, PageContext } from '@/reactRouterPlugins/applyPagePaths/plugin';
import { hostedPortalRoutes } from './routes';
import { useMemo } from 'react';

type Props = {
  config: Config;
  predicate?: Predicate;
  charts: string[];
  locale: LanguageOption;
};

function DashboardApp({ config, predicate, charts, locale }: Props) {
  const pageContext = useMemo(() => getStandalonePageContext(config, hostedPortalRoutes), []);

  const routes = applyReactRouterPlugins(
    [
      {
        element: <HpRootLayout children={<Outlet />} />,
        children: [
          {
            index: true,
            errorElement: <RootErrorPage />,
            element: (
              <PageContext.Provider value={pageContext}>
                <StaticDashboard predicate={predicate} charts={charts} />
              </PageContext.Provider>
            ),
          },
        ],
      },
    ],
    config
  );

  const localizedInitialRoute = locale.default ? '/' : `/${locale.code}`;
  const router = createMemoryRouter(routes, {
    initialEntries: [localizedInitialRoute],
  });

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
  locale?: LanguageOption;
};

export function renderDashboard(options: Options) {
  if (options.rootElement == null)
    return console.error('rootElement is required for the dashboard');
  if (options.charts == null) return console.error('charts is required for the dashboard');
  if (options.config == null) return console.error('config is required for the dashboard');

  const fullConfig = prepareConfig(options.config);

  const locale = options.locale ?? fullConfig.languages.find((lang) => lang.default)!;
  if (!options.locale) {
    console.warn(`No locale provided in dashboard, using default locale: ${locale.code}`);
  }

  createRoot(options.rootElement).render(
    <DashboardApp
      locale={locale}
      config={fullConfig}
      predicate={options.predicate}
      charts={options.charts}
    />
  );
}
