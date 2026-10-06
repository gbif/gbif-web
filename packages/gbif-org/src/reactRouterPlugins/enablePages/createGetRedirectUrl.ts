import { LanguageOption } from '@/config/config';
import { matchPath } from 'react-router-dom';
import { DisabledRoutes } from './plugin';

export type GetRedirectUrl = (path: string, locale: LanguageOption) => string | null;

export function createGetRedirectUrl(disabledRoutes: DisabledRoutes): GetRedirectUrl {
  return (path, locale) => {
    for (const [pattern, route] of Object.entries(disabledRoutes)) {
      const matchResult = matchPath({ path: pattern, end: true }, path);
      if (matchResult && route.gbifRedirect && !route.isCustom) {
        const redirectPath = route.gbifRedirect?.(matchResult.params, locale);
        if (redirectPath) return redirectPath;
      }
    }

    return null;
  };
}
