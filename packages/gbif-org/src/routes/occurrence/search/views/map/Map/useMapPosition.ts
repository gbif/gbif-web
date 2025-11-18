import { useCallback } from 'react';
import { MAP_BOUNDS, STORAGE_KEYS } from './mapConstants';
import { OccurrenceSearchMetadata } from '@/contexts/search';

type MapPosition = {
  lat: number;
  lng: number;
  zoom: number;
};

/**
 * Custom hook for managing map position in session storage
 * Provides methods to get and set map position with proper bounds checking
 */
export function useMapPosition(defaultMapSettings?: OccurrenceSearchMetadata['mapSettings']) {
  /**
   * Retrieves the stored map position from session storage
   * Falls back to default settings if no stored position exists
   * Enforces bounds to ensure valid coordinates
   */
  const getStoredPosition = useCallback(
    ({ maxLat = 90, minLat = -90 }: { maxLat?: number; minLat?: number } = {}): MapPosition => {
      let zoom = Number(
        sessionStorage.getItem(STORAGE_KEYS.MAP_ZOOM) || defaultMapSettings?.zoom || 0
      );
      zoom = Math.min(Math.max(MAP_BOUNDS.MIN_ZOOM, zoom), MAP_BOUNDS.MAX_ZOOM);

      let lng = Number(
        sessionStorage.getItem(STORAGE_KEYS.MAP_LNG) || defaultMapSettings?.lng || 0
      );
      // Handle longitude wrapping for OpenLayers compatibility
      while (lng < -180) lng += 360;
      while (lng > 180) lng -= 360;
      lng = Math.min(Math.max(MAP_BOUNDS.MIN_LNG, lng), MAP_BOUNDS.MAX_LNG);

      let lat = Number(
        sessionStorage.getItem(STORAGE_KEYS.MAP_LAT) || defaultMapSettings?.lat || 0
      );
      lat = Math.min(Math.max(minLat, lat), maxLat);

      return { lat, lng, zoom };
    },
    [defaultMapSettings]
  );

  /**
   * Saves the current map position to session storage
   */
  const savePosition = useCallback((position: MapPosition) => {
    sessionStorage.setItem(STORAGE_KEYS.MAP_ZOOM, position.zoom.toString());
    sessionStorage.setItem(STORAGE_KEYS.MAP_LNG, position.lng.toString());
    sessionStorage.setItem(STORAGE_KEYS.MAP_LAT, position.lat.toString());
  }, []);

  return {
    getStoredPosition,
    savePosition,
  };
}
