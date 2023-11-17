import { useMetadataRoutes } from '@/contexts/metadataRoutes';
import { findRouteMetadataMatch } from '@/utils/findRouteMetadataMatch';
import { useNavigation } from 'react-router-dom';

export function useNextLoadingElement(): React.ReactNode | undefined {
  const metadataRoutes = useMetadataRoutes();
  const { location: nextLocation } = useNavigation();

  // If nextLocation is undefined we are not navigating, so exit early
  if (!nextLocation) return;

  // Find the route metadata for the to next
  const match = findRouteMetadataMatch(nextLocation.pathname, metadataRoutes);

  // If no match, exit early
  if (!match) return;

  // Update the url
  document.location = nextLocation.pathname;

  return match.route.loadingElement;
}
