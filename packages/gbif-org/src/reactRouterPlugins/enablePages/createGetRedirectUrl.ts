import { matchPath } from 'react-router-dom';
import { DisabledRoutes } from './plugin';

export type GetRedirectUrl = (path: string) => string | null;

export function createGetRedirectUrl(disabledRoutes: DisabledRoutes): GetRedirectUrl {
  return (path: string) => {
    for (const [pattern, route] of Object.entries(disabledRoutes)) {
      const matchResult = matchPath({ path: pattern, end: true }, path);
      if (matchResult && route.gbifRedirect) {
        const redirectPath = route.gbifRedirect?.(matchResult.params);
        if (redirectPath) return 'https://www.gbif.org' + redirectPath;
      }
    }

    return null;
  };
}