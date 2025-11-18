/**
 * Shared constants for map components
 */

/** Map interaction timeouts (in milliseconds) */
export const TIMEOUTS = {
  /** Debounce for map resize operations */
  RESIZE_DEBOUNCE: 1000,
  /** Cooldown period between predicate registrations */
  REGISTRATION_EMBARGO: 10000,
  /** Delay before updating layer after style change */
  LAYER_UPDATE_DELAY: 500,
  /** Duration to show error messages */
  ERROR_MESSAGE_DURATION: 3000,
} as const;

/** Map bounds constraints */
export const MAP_BOUNDS = {
  MIN_ZOOM: 0,
  MAX_ZOOM: 20,
  MIN_LAT: -85,
  MAX_LAT: 85,
  MIN_LNG: -180,
  MAX_LNG: 180,
} as const;

/** Image dimensions */
export const IMAGE_SIZES = {
  /** Thumbnail size for occurrence preview images */
  THUMBNAIL: 60,
} as const;

/** Session storage keys */
export const STORAGE_KEYS = {
  MAP_ZOOM: 'mapZoom',
  MAP_LNG: 'mapLng',
  MAP_LAT: 'mapLat',
  DEFAULT_PROJECTION: 'defaultOccurrenceProjection',
  DEFAULT_LAYER: 'defaultOccurrenceLayer',
} as const;
