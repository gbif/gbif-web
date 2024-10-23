import { useRouteLoaderData } from 'react-router-dom';
import { useLocalizedRouteId } from './i18n';
import { slugifyId } from './slugified';

// This will not work for slugified routes nested in slugified routes, but i can't see a use case for that
export function useRenderedRouteLoaderData(routeId: string) {
  const localizedRouteId = useLocalizedRouteId(routeId);
  const localizedRouteData = useRouteLoaderData(localizedRouteId);
  const slugifiedAndLocalizedRouteId = useLocalizedRouteId(slugifyId(routeId));
  const slugifiedAndLocalizedRouteData = useRouteLoaderData(slugifiedAndLocalizedRouteId);

  return localizedRouteData || slugifiedAndLocalizedRouteData;
}
