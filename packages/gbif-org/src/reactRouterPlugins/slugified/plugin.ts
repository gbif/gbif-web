import { Config } from '@/config/config';
import { RouteObjectWithPlugins } from '..';
import { slugifyId } from './utils';

export function applySlugifiedPlugin(
  routes: RouteObjectWithPlugins[],
  config: Config
): RouteObjectWithPlugins[] {
  return routes.flatMap((route) => {
    if (route.children) {
      route.children = applySlugifiedPlugin(route.children, config);
    }

    if (route.isSlugified === true) {
      const copy = { ...route };
      copy.path = `${route.path}/:slug`;
      if (copy.id) copy.id = slugifyId(copy.id);

      return [route, copy];
    }

    return route;
  });
}
