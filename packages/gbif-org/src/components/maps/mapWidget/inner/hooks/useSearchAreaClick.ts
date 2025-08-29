import { boundingBoxToWKT } from '@/utils/boundingBoxToWKT';
import type { Coordinate } from 'ol/coordinate';
import type Map from 'ol/Map';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import { useEffect } from 'react';
import { setStoredMapPosition } from '../../outer/setStoredMapPosition';

type Args = {
  map?: Map | null;
  onSearchAreaClick?: (geometryFilter: string) => void;
  enabledSearchAreaClick?: boolean;
  getProjectedCoordinate?: (coordinate: Coordinate) => Coordinate;
  projectionCommonName: string;
};

export function useSearchAreaClick({
  map,
  onSearchAreaClick,
  enabledSearchAreaClick,
  getProjectedCoordinate = (coordinate: Coordinate) => coordinate,
  projectionCommonName,
}: Args) {
  useEffect(() => {
    if (!map) return;
    if (!enabledSearchAreaClick) return;

    // Get a little area around the click and use that as a geometry filter passed to a handler
    function handleSearchAreaOnClick(event: MapBrowserEvent<any>) {
      if (!onSearchAreaClick) return;

      let [lng, lat] = getProjectedCoordinate(event.coordinate);
      setStoredMapPosition({
        center: [lng, lat],
        zoom: map!.getView().getZoom(),
      });
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('defaultOccurrenceProjection', projectionCommonName);
      }

      const size = 30;
      const [offsetLng, offsetLat] = getProjectedCoordinate(
        map!.getCoordinateFromPixel([event.pixel[0] + size, event.pixel[1] + size])
      );

      // Calculate the offset to ensure the bounding box is valid.
      // This is a failsafe for polar projections where the coordinates can wrap around,
      // causing the bounding box to be invalid. The offset ensures that the bounding box
      // has a minimum size and is correctly calculated even in these edge cases.
      const offset = Math.min(2, Math.max(Math.abs(offsetLng - lng), Math.abs(offsetLat - lat)));

      // Ensure the longitude is within the valid range [-180, 180]
      if (typeof lng === 'number' && isFinite(lng)) {
        lng = ((((lng + 180) % 360) + 360) % 360) - 180;
      }

      const areaGeometryFilter = boundingBoxToWKT({
        top: lat + offset,
        left: lng - offset,
        bottom: lat - offset,
        right: lng + offset,
      });

      onSearchAreaClick(areaGeometryFilter);
    }

    function handleMouseEnter() {
      mapElement.style.cursor = 'pointer';
    }

    function handleMouseLeave() {
      mapElement.style.cursor = 'default';
    }

    const mapElement = map.getTargetElement();

    map.on('singleclick', handleSearchAreaOnClick);
    mapElement.addEventListener('mouseenter', handleMouseEnter);
    mapElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      map.un('singleclick', handleSearchAreaOnClick);
      mapElement.removeEventListener('mouseenter', handleMouseEnter);
      mapElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    onSearchAreaClick,
    enabledSearchAreaClick,
    map,
    getProjectedCoordinate,
    projectionCommonName,
  ]);
}
