import { Outlet, RouteObject } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Config } from '@/contexts/config';
import { I18nProvider } from '@/contexts/i18n';
import { SourceRouteObject, RouteMetadata } from '@/types';
const PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT = import.meta.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT;

type ConfigureRoutesResult = {
  routes: RouteObject[];
  metadataRoutes: RouteMetadata[];
};

// This function will change the base routes based on the provided config
// It will do the following:
// - Duplicate the routes for each language with a specific path prefix.
// - Wrap root routes with the I18nProvider making the locale available to the route and its children.
// - Inject the config and selected locale into the loaders
export function configureRoutes(
  baseRoutes: SourceRouteObject[],
  config: Config
): ConfigureRoutesResult {
  // Create the routes used by react-router-dom
  const routes: RouteObject[] = config.languages.map((locale) => ({
    path: locale.default ? '/' : locale.code,
    element: (
      <I18nProvider locale={locale}>
          <Helmet>
            <html lang={locale.code} dir={locale.textDirection} />
          </Helmet>
          <Outlet />
      </I18nProvider>
    ),
    children: createRoutesRecursively(baseRoutes, config, locale),
    loader: async () => {
      // fetch the entry translation file
      const translations = await fetch(PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT).then((r) => r.json());
      // now get the actual messages for the locale
      const messages = await fetch(
        translations?.[locale.code]?.messages ?? translations?.en?.messages
      ).then((r) => r.json());
      return { messages };
    },
  }));

  // Create the routes metadata injected into a context to help with navigation
  const nestedTargetRoutesMetadata = createRouteMetadataRecursively(baseRoutes, config);
  const metadataRoutes: RouteMetadata[] = config.languages.map((locale) => ({
    path: locale.default ? '/' : locale.code,
    children: nestedTargetRoutesMetadata,
  }));

  return { routes, metadataRoutes };
}

function createRouteMetadataRecursively(
  routes: SourceRouteObject[],
  config: Config
): RouteMetadata[] {
  return routes.map((route) => {
    const targetRouteMetadata: RouteMetadata = {
      path: route.path,
      key: route.key,
      gbifRedirect: route.gbifRedirect,
      children: Array.isArray(route.children)
        ? createRouteMetadataRecursively(route.children, config)
        : undefined,
    };

    return targetRouteMetadata;
  });
}

function createRoutesRecursively(
  routes: SourceRouteObject[],
  config: Config,
  locale: Config['languages'][number]
): RouteObject[] {
  return routes
    .filter((route) => {
      // If the config has no pages array, we want to keep all routes
      if (!Array.isArray(config.pages)) return true;

      // If the page doesn't have a key, we want to keep it
      if (typeof route.key !== 'string') return true;

      // If the page is in the config's pages array, we want to keep it
      return config.pages.some((page) => page.key === route.key);
    })
    .map((route) => {
      const clone = { ...route } as RouteObject;

      // Inject the config and locale into the loader
      const loader = route.loader;
      if (typeof loader === 'function') {
        clone.loader = (args: any) => loader({ ...args, config, locale });
      }

      // Recurse into children
      if (Array.isArray(route.children)) {
        clone.children = createRoutesRecursively(route.children, config, locale);
      }

      return clone;
    });
}
