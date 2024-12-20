import { Config, LanguageOption } from '@/config/config';
import { GraphQLService } from '@/services/graphQLService';
import {
  IndexRouteObject,
  LoaderFunctionArgs,
  NonIndexRouteObject,
  RouteObject,
} from 'react-router-dom';
import { applyPagePathsPlugin } from './applyPagePaths';
import { applyEnablePagesPlugin } from './enablePages';
import { applyExtendedLoaderPlugin } from './extendedLoader';
import { applyExtraOccurrenceSearchPages } from './extraOccurrenceSearchPages';
import { applyI18nPlugin } from './i18n';
import { applySlugifiedPlugin } from './slugified';
export { DynamicLink } from './dynamicLink';
export { useI18n } from './i18n';
export { useRenderedRouteLoaderData } from './useRenderedRouteLoaderData';

export type Context = {
  standalone: boolean;
};

export type LoaderArgs = LoaderFunctionArgs & {
  locale: LanguageOption;
  config: Config;
  graphql: GraphQLService;
};

export type RouteObjectWithPlugins = {
  description?: string;
  loadingElement?: JSX.Element;
  internalPluginId?: string;
  loader?: (args: LoaderArgs) => unknown;
  overrideConfig?: Partial<Config>;
  gbifRedirect?: (params: Record<string, string | undefined>) => string | null;
  isCustom?: boolean;
  isSlugified?: boolean;
} & (
  | Omit<IndexRouteObject, 'loader'>
  | (Omit<NonIndexRouteObject, 'children' | 'loader'> & {
      children?: RouteObjectWithPlugins[];
    })
);

export function applyReactRouterPlugins(
  routes: RouteObjectWithPlugins[],
  config: Config,
  context: Context = { standalone: false }
): RouteObject[] {
  const withCorrectedPaths = applyPagePathsPlugin(routes, config, context);
  const withFilteredRoutes = applyEnablePagesPlugin(withCorrectedPaths, config, context);
  const withExtraOccurrenceSearchPages = applyExtraOccurrenceSearchPages(
    withFilteredRoutes,
    config
  );
  const withI18n = applyI18nPlugin(withExtraOccurrenceSearchPages, config);
  const withSlugified = applySlugifiedPlugin(withI18n, config);
  const withExtendedLoader = applyExtendedLoaderPlugin(withSlugified, config);

  return withExtendedLoader as RouteObject[];
}
