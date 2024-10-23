import { RouteObjectWithPlugins } from '..';
import { extractLocaleFromPathname } from '../i18n';
import { GraphQLService } from '@/services/graphQLService';
import { Config, LanguageOption, OverwriteConfigProvider } from '@/config/config';

export function applyExtendedLoaderPlugin(
  routes: RouteObjectWithPlugins[],
  config: Config
): RouteObjectWithPlugins[] {
  const defaultLanguage = config.languages.find((language) => language.default);
  if (!defaultLanguage) throw new Error('No default language found');

  return routes.map((route) => {
    const routeCopy = { ...route };

    if (Array.isArray(routeCopy.children)) {
      routeCopy.children = applyExtendedLoaderPlugin(routeCopy.children, config);
    }

    modifyLoader(routeCopy, config, defaultLanguage);

    return routeCopy;
  });
}

function modifyLoader(
  route: RouteObjectWithPlugins,
  config: Config,
  defaultLanguage: LanguageOption
) {
  if (typeof route.loader !== 'function') return;

  const routeConfig = (
    route.overrideConfig ? { ...config, ...route.overrideConfig } : config
  ) as Config;

  const originalLoader = route.loader;

  route.loader = (...args) => {
    const preview = args[0].request.url.includes('preview=true');

    const locale = extractLocaleFromPathname(
      new URL(args[0].request.url).pathname,
      config.languages.map((localeOption) => localeOption.code),
      defaultLanguage.code
    );

    const currentLocaleOption = config.languages.find(
      (localeOption) => localeOption.code === locale
    );
    if (!currentLocaleOption) throw new Error(`Locale ${locale} not found in available locales`);
    args[0].locale = currentLocaleOption;

    const graphql = new GraphQLService({
      endpoint: config.graphqlEndpoint,
      abortSignal: args[0].request.signal,
      locale: currentLocaleOption.cmsLocale ?? currentLocaleOption.code,
      preview,
    });
    args[0].graphql = graphql;

    args[0].config = routeConfig;

    return originalLoader(...args);
  };

  // Add the modified config to the route
  if (route.overrideConfig && route.element) {
    const originalElement = route.element;

    const Element = () => {
      return (
        <OverwriteConfigProvider config={routeConfig}>{originalElement}</OverwriteConfigProvider>
      );
    };

    route.element = <Element />;
  }
}
