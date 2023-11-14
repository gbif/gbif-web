import { RouteObject } from 'react-router-dom';
import { Config } from '@/contexts/config';

export type LoaderArgs = {
  request: Request;
  config: Config;
  locale: Config['languages'][number];
  params: Record<string, string | undefined>;
};

export type SourceRouteObject = Omit<RouteObject, 'loader' | 'children'> & {
  key?: string;
  loader?: (args: LoaderArgs) => Promise<any>;
  children?: SourceRouteObject[];
  gbifRedirect?: (params: Record<string, string | undefined>) => string;
};

export type RouteMetadata = {
  path?: string;
  key?: string;
  gbifRedirect?: (params: Record<string, string | undefined>) => string;
  children?: RouteMetadata[];
};

export type ExtractPaginatedResult<T extends { documents: { results: any[] } } | null | undefined> =
  NonNullable<NonNullable<T>['documents']['results'][number]>;
