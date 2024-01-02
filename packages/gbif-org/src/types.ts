import { RouteObject } from 'react-router-dom';
import { Config } from '@/contexts/config/config';

export type LoaderArgs = {
  request: Request;
  config: Config;
  locale: Config['languages'][number];
  params: Record<string, string | undefined>;
};

export type SourceRouteObject = Omit<RouteObject, 'loader' | 'children' | 'lazy'> & {
  // 'key' is optionally used to activate or deactivate the route in the global configuration.
  key?: string;

  // 'loader' is an optional function that supersedes the default loader, adding unique functionality and parameters.
  loader?: (args: LoaderArgs) => Promise<any>;

  // 'loadingElement' is an optional React node rendered during the navigation process to this route.
  loadingElement?: React.ReactNode;

  // 'children' are SourceRouteObjects, allowing nested route definitions within this route object.
  children?: SourceRouteObject[];

  // 'gbifRedirect' is an optional function enabling redirection to gbif.org for routes not active on hosted portals.
  gbifRedirect?: (params: Record<string, string | undefined>) => string;

  // 'lazy' is a function for lazy loading the route's component, improving performance by loading the component only when required.
  lazy?: () => Promise<Pick<RouteObject, 'element'>>;
};

export type RouteMetadata = {
  path?: string;
  key?: string;
  loadingElement?: React.ReactNode;
  gbifRedirect?: (params: Record<string, string | undefined>) => string;
  children?: RouteMetadata[];
};

export type ExtractPaginatedResult<T extends { documents: { results: any[] } } | null | undefined> =
  NonNullable<NonNullable<T>['documents']['results'][number]>;
