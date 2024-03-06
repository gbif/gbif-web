import { useConfig } from '@/contexts/config/config';
import { useMetadataRoutes } from '@/contexts/metadataRoutes';
import { findRouteMetadataMatchByPathname } from '@/utils/findRouteMetadataMatchByPathname';

export function useExternalGbifLink(to: string): null | string {
  const { pages } = useConfig();
  const metadataRoutes = useMetadataRoutes();

  // There should never be redirected if the config has no pages array
  if (!Array.isArray(pages)) return null;

  // Find the route metadata for the to url
  const match = findRouteMetadataMatchByPathname(to, metadataRoutes);

  // If no match, return null
  if (!match) return null;

  // Only matches with a key can be excluded from the routes
  if (!match.route.key) return null;

  // The route is activated if it is in the pages array, so return null if it is
  if (pages.some((page) => page.key === match.route.key)) return null;

  // If no external link is defined, throw an error
  if (!match.route.gbifRedirect) {
    throw new Error(`No gbifRedirect link defined for route ${match.route.key}`);
  }

  // Return the external link
  return match.route.gbifRedirect(match.params);
}
