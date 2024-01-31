import { Outlet, RouteObject } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Config } from '@/contexts/config/config';
import { I18nProvider } from '@/contexts/i18n';
import { SourceRouteObject, RouteMetadata } from '@/types';
import { LoadingElementWrapper } from '@/components/LoadingElementWrapper';
import { v4 as uuid } from 'uuid';
import { StartLoadingEvent } from '@/contexts/loadingElement';
import { GraphQLService } from '@/services/GraphQLService';
import { createLocalizedRouteId } from './createLocalizedRouteId';

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
  const routes: RouteObject[] = config.languages.map((locale) => {
    return {
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
        const translations = await fetch(config.translationsEntryEndpoint).then((r) => r.json());
        // now get the actual messages for the locale
        const messages = await fetch(
          translations?.[locale.code]?.messages ?? translations?.en?.messages
        ).then((r) => r.json());
        return { messages };
      },
    };
  });

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
  locale: Config['languages'][number],
  nestingLevel = 0
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

      // Add the lang to the route id as it must be unique
      if (typeof clone.id === 'string') clone.id = createLocalizedRouteId(clone.id, locale.code);

      // Generate a unique id for the loading element
      const id = uuid();

      // Add loading element wrapper to the elements
      if (route.element) {
        clone.element = (
          <LoadingElementWrapper id={id} nestingLevel={nestingLevel} lang={locale.code}>
            {route.element}
          </LoadingElementWrapper>
        );
      }

      // Add loading element wrapper to the lazy loaded element if it exists
      const lazy = route.lazy;
      if (typeof lazy === 'function') {
        clone.lazy = () =>
          lazy().then((config) => {
            const element = config.element;

            if (element) {
              return {
                ...config,
                element: (
                  <LoadingElementWrapper id={id} nestingLevel={nestingLevel} lang={locale.code}>
                    {element}
                  </LoadingElementWrapper>
                ),
              };
            }
          }) as any;
      }

      // Inject the config and locale into the loader & add loading events
      const loader = route.loader;
      if (typeof loader === 'function') {
        clone.loader = (args: any) => {
          if (route.loadingElement && typeof window !== 'undefined') {
            window.dispatchEvent(
              new StartLoadingEvent({
                id,
                lang: locale.code,
                nestingLevel,
                loadingElement: route.loadingElement,
              })
            );
          }

          const graphql = new GraphQLService({
            endpoint: config.graphqlEndpoint,
            abortSignal: args.request.signal,
            locale: locale.cmsLocale || locale.code,
          });

          return loader({ ...args, config, locale, graphql });
        };
      }

      // Recurse into children
      if (Array.isArray(route.children)) {
        clone.children = createRoutesRecursively(route.children, config, locale, nestingLevel + 1);
      }

      return clone;
    });
}
