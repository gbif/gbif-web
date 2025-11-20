import { useCallback } from 'react';
import { OccurrenceSearchMetadata } from '@/contexts/search';

/** Map bounds constraints */
const MAP_BOUNDS = {
  MIN_ZOOM: 0,
  MAX_ZOOM: 20,
  MIN_LNG: -180,
  MAX_LNG: 180,
} as const;

/** Session storage keys */
export const STORAGE_KEYS = {
  MAP_ZOOM: 'mapZoom',
  MAP_LNG: 'mapLng',
  MAP_LAT: 'mapLat',
  DEFAULT_PROJECTION: 'defaultOccurrenceProjection',
  DEFAULT_LAYER: 'defaultOccurrenceLayer',
} as const;

type MapState = {
  lat: number;
  lng: number;
  zoom: number;
};

/**
 * Map position storage interface
 */
export interface MapPosition {
  getStoredPosition: (constraints?: { maxLat?: number; minLat?: number }) => {
    lat: number;
    lng: number;
    zoom: number;
  };
  savePosition: (position: { lat: number; lng: number; zoom: number }) => void;
}

/**
 * Custom hook for managing map position in session storage
 * Provides methods to get and set map position with proper bounds checking
 */
export function useMapPosition(
  defaultMapSettings?: OccurrenceSearchMetadata['mapSettings']
): MapPosition {
  /**
   * Retrieves the stored map position from session storage
   * Falls back to default settings if no stored position exists
   * Enforces bounds to ensure valid coordinates
   */
  const getStoredPosition = useCallback(
    ({ maxLat = 90, minLat = -90 }: { maxLat?: number; minLat?: number } = {}): MapState => {
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
  const savePosition = useCallback((position: MapState) => {
    sessionStorage.setItem(STORAGE_KEYS.MAP_ZOOM, position.zoom.toString());
    sessionStorage.setItem(STORAGE_KEYS.MAP_LNG, position.lng.toString());
    sessionStorage.setItem(STORAGE_KEYS.MAP_LAT, position.lat.toString());
  }, []);

  return {
    getStoredPosition,
    savePosition,
  };
}
