import { Config } from '@/config/config';
import { occurrenceSearchRouteId } from '@/routes/occurrence/search';
import { RouteObjectWithPlugins } from '..';

export function applyExtraOccurrenceSearchPages(
  routes: RouteObjectWithPlugins[],
  config: Config
): RouteObjectWithPlugins[] {
  if (!config.extraOccurrenceSearchPages) return routes;

  return routes.flatMap((route) => {
    if (route.children) {
      route.children = applyExtraOccurrenceSearchPages(route.children, config);
    }

    if (route.id !== occurrenceSearchRouteId) {
      return [route];
    }

    return [
      route,
      ...config.extraOccurrenceSearchPages!.map((extraPage, idx) => {
        return {
          ...route,
          id: `${route.id}-${idx}`,
          path: extraPage.path,
          overrideConfig: extraPage.overwriteConfig,
        };
      }),
    ];
  });
}
