import { Config } from '@/config/config';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { Outlet } from 'react-router-dom';
import { RouteObjectWithPlugins } from '..';
import { ErrorMessages } from './errorMessages';
import { I18nContextProvider } from './i18nContextProvider';
import { getMessagesForLocale } from './loadMessages';
import { localizeRouteId } from './useLocalizedRouteId';

// Messages are NOT returned from this loader on the SERVER: that would serialize the full ~438 KB
// dictionary into every SSR response. On the server the
// entry loads messages out-of-band for the render and inlines only the tiny versioned URL, and the
// client fetches that file before hydration (provided via MessagesProvider).
//
// On the CLIENT the loader still runs so a language-switch navigation loads the target locale's
// messages (blocking, like before, so there is no flash of the wrong language). This loaderData is
// never serialized - it only ever exists in the browser during client-side navigation.

export function applyI18nPlugin(
  routes: RouteObjectWithPlugins[],
  config: Config
): RouteObjectWithPlugins[] {
  if (routes.some((route) => route.path === '/')) {
    throw new Error(
      'The root route should not have route: "/" when using the i18n react-router-dom plugin'
    );
  }
  const defaultLanguage = config.languages.find((language) => language.default);
  if (!defaultLanguage) throw new Error('No default language found');

  return config.languages.map((localeOption) => {
    const withI18n = (children: React.ReactNode) => (
      <I18nContextProvider
        locale={localeOption}
        availableLocales={config.languages}
        defaultLocale={defaultLanguage}
      >
        {children}
      </I18nContextProvider>
    );
    return {
      description: `Root route for ${localeOption.label}`,
      path: defaultLanguage.code === localeOption.code ? '/' : localeOption.code,
      shouldRevalidate() {
        return false;
      },
      loader: async () => {
        // Server: return nothing (messages come via MessagesProvider for the SSR render, and we must
        // keep them out of the serialized hydration data). Client: load this locale's messages so
        // switching language picks up the right dictionary.
        if (import.meta.env.SSR) return null;
        return { messages: await getMessagesForLocale(config, localeOption) };
      },
      // The error element replaces the element, provider included. A portal that has not enabled
      // the catch-all alias route hits this on any unknown path, e.g. a disabled page's URL.
      errorElement: (
        <ErrorMessages config={config} locale={localeOption}>
          {withI18n(<RootErrorPage />)}
        </ErrorMessages>
      ),
      element: withI18n(<Outlet />),
      children: localizeRouteIds(routes, localeOption.code),
    };
  });
}

function localizeRouteIds(
  routes: RouteObjectWithPlugins[],
  localeCode: string
): RouteObjectWithPlugins[] {
  return routes.map((route) => {
    const routeCopy = { ...route };

    if (Array.isArray(routeCopy.children)) {
      routeCopy.children = localizeRouteIds(routeCopy.children, localeCode);
    }

    if (routeCopy.id) {
      routeCopy.id = localizeRouteId(routeCopy.id, localeCode);
    }

    return routeCopy;
  });
}
