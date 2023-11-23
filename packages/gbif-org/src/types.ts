import { RouteObject } from 'react-router-dom';
import { Config } from '@/contexts/config';

export type LoaderArgs = {
  request: Request;
  config: Config;
  locale: Config['languages'][number];
  params: Record<string, string | undefined>;
};

export type SourceRouteObject = Omit<RouteObject, 'loader' | 'children'> & {
  // This key is used to to enable the route in the global config
  key?: string;
  // This loader function will override the default loader function with additional functionality and arguments
  loader?: (args: LoaderArgs) => Promise<any>;
  // This element with be rendered while navigating to the route
  loadingElement?: React.ReactNode;
  children?: SourceRouteObject[];
  // This function will allow us to redirect to gbif.org on routes that is not enabled on hosted portals
  gbifRedirect?: (params: Record<string, string | undefined>) => string;
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
