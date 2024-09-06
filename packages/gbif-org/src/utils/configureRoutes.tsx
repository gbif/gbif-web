import { LoaderFunctionArgs, Outlet, RouteObject, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Config } from '@/contexts/config/config';
import { I18nProvider } from '@/contexts/i18n';
import { SourceRouteObject, RouteMetadata } from '@/types';
import { LoadingElementWrapper } from '@/components/loadingElementWrapper';
import { v4 as uuid } from 'uuid';
import { DoneNavigatingEvent, StartLoadingEvent } from '@/contexts/loadingElement';
import { GraphQLService } from '@/services/graphQLService';
import { createRouteId } from './createRouteId';
import { AlternativeLanguages } from '@/components/alternativeLanguages';
import { useEffect } from 'react';

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
          <AlternativeLanguages />
          <Outlet />
          <StopLoading />
        </I18nProvider>
      ),
      children: createRoutesRecursively(baseRoutes, config, locale),
      loader: async () => {
        // fetch the entry translation file
        const translations = await fetch(config.translationsEntryEndpoint)
          .then((r) => r.json())
          .catch((err) => {
            console.error('Failed to load translations entry file');
            throw err;
          });
        // now get the actual messages for the locale
        const messages = await fetch(
          translations?.[locale.code]?.messages ?? translations?.en?.messages
        )
          .then((r) => r.json())
          .catch((err) => {
            console.error('Failed to load translations for language');
            console.error('Failed language: ', locale.code);
            throw err;
          });
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
      id: route.id,
      isSlugified: route.isSlugified === true,
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
  return (
    routes
      .filter((route) => {
        // If the config has no pages array, we want to keep all routes
        if (!Array.isArray(config.pages)) return true;

        // If the page doesn't have a key, we want to keep it
        if (typeof route.key !== 'string') return true;

        // If the page is in the config's pages array, we want to keep it
        return config.pages.some((page) => page.key === route.key);
      })
      // All routes that have a slugifiedKeySelector should be duplicated to also handle the slugified key
      .flatMap((route) => {
        if (route.isSlugified) {
          const clone = { ...route } as SourceRouteObject;
          clone.path = `${route.path}/:slugifiedTitle`;
          return [route, clone];
        }
        return route;
      })
      .map((route) => {
        const clone = { ...route } as RouteObject;

        // Make sure the route id is unique
        transformId(clone, locale);

        // Generate a unique id for the loading element
        const id = uuid();

        // Add loading element wrapper to the elements
        transformElement(clone, id, nestingLevel);

        // Add loading element wrapper to the lazy loaded element if it exists
        transformLazy(route, clone, id, nestingLevel);

        // Inject the config and locale into the loader & add loading events
        transformLoader(route, clone, id, locale, nestingLevel, config);

        // Recurse into children
        transformChildren(route, clone, nestingLevel, config, locale);

        return clone;
      })
  );
}

function transformId(clone: RouteObject, locale: Config['languages'][number]) {
  // Add the lang to the route id as it must be unique
  if (typeof clone.id !== 'string') return;

  clone.id = createRouteId(clone.id, locale.code, clone.path?.includes(':slugifiedTitle'));
}

function transformElement(clone: RouteObject, id: string, nestingLevel: number) {
  if (clone.element) {
    clone.element = (
      <LoadingElementWrapper id={id} nestingLevel={nestingLevel}>
        {clone.element}
      </LoadingElementWrapper>
    );
  }
  return clone;
}

function transformLazy(
  route: SourceRouteObject,
  clone: RouteObject,
  id: string,
  nestingLevel: number
) {
  const lazy = route.lazy;
  if (typeof lazy === 'function') {
    clone.lazy = () =>
      lazy().then((config) => {
        const element = config.element;

        if (element) {
          return {
            ...config,
            element: (
              <LoadingElementWrapper id={id} nestingLevel={nestingLevel}>
                {element}
              </LoadingElementWrapper>
            ),
          };
        }
      }) as any;
  }
}

function transformLoader(
  route: SourceRouteObject,
  clone: RouteObject,
  id: string,
  locale: Config['languages'][number],
  nestingLevel: number,
  config: Config
) {
  const loader = route.loader;
  if (typeof loader === 'function') {
    clone.loader = async (args: LoaderFunctionArgs) => {
      if (route.loadingElement && typeof window !== 'undefined') {
        window.dispatchEvent(
          new StartLoadingEvent({
            id,
            nestingLevel,
            loadingElement: route.loadingElement,
          })
        );
      }

      const preview = args.request.url.includes('preview=true');

      const graphql = new GraphQLService({
        endpoint: config.graphqlEndpoint,
        abortSignal: args.request.signal,
        locale: locale.cmsLocale || locale.code,
        preview,
      });

      const result = await loader({ ...args, config, locale, graphql, id });

      return result;
    };
  }
}

function transformChildren(
  route: SourceRouteObject,
  clone: RouteObject,
  nestingLevel: number,
  config: Config,
  locale: Config['languages'][number]
) {
  if (Array.isArray(route.children)) {
    clone.children = createRoutesRecursively(route.children, config, locale, nestingLevel + 1);
  }
}

function StopLoading() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      window.dispatchEvent(new DoneNavigatingEvent());
    }, 0);
  }, [location.pathname]);

  return null;
}
