import { Config } from '@/config/config';
import { RootErrorPage } from '@/routes/rootErrorPage';
import { Outlet } from 'react-router-dom';
import { RouteObjectWithPlugins } from '..';
import { I18nContextProvider } from './i18nContextProvider';
import { localizeRouteId } from './useLocalizedRouteId';

export function applyI18nPlugin(
  routes: RouteObjectWithPlugins[],
  config: Config
): RouteObjectWithPlugins[] {
  if (routes.some((route) => route.path === '/')) {
    throw new Error(
      'The root route should not have route: "/" when using the i18n react-router-dom plugin'
    );
  }
  const { messages: customMessages = {} } = config;
  const defaultLanguage = config.languages.find((language) => language.default);
  if (!defaultLanguage) throw new Error('No default language found');

  const translationsPromise = fetch(config.translationsEntryEndpoint)
    .then((r) => r.json())
    .catch((err) => {
      console.error('Failed to load translations entry file');
      throw err;
    });

  return config.languages.map((localeOption) => {
    const localeLanguage = customMessages[localeOption.code] ?? {};
    return {
      description: `Root route for ${localeOption.label}`,
      path: defaultLanguage.code === localeOption.code ? '/' : localeOption.code,
      shouldRevalidate() {
        return false;
      },
      loader: async () => {
        // fetch the entry translation file
        const translations = await translationsPromise;
        // now get the actual messages for the locale
        const messages = await fetch(
          translations?.[localeOption.localeCode]?.messages ?? translations?.en?.messages
        )
          .then((r) => r.json())
          .catch((err) => {
            console.error('Failed to load translations for language');
            console.error('Failed language: ', localeOption.code, localeOption.localeCode);
            throw err;
          });
        return { messages: { ...messages, ...localeLanguage } };
      },
      errorElement: <RootErrorPage />,
      element: (
        <I18nContextProvider
          locale={localeOption}
          availableLocales={config.languages}
          defaultLocale={defaultLanguage}
        >
          <Outlet />
        </I18nContextProvider>
      ),
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
