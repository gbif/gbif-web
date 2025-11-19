import { Theme } from '@/config/theme/theme';
import { BoundingBox } from '@/types';
import { MapConfig, OverlayStyle } from './mapTypes';
import { Projection } from '@/components/maps/openlayers/projections';

/**
 * Map events that can be triggered by user interactions or programmatic actions
 */
export type MapEvent =
  | { type: 'ZOOM_TO'; lat: number; lng: number; zoom: number }
  | { type: 'EXPLORE_AREA'; bbox?: BoundingBox }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' };

/**
 * Data structure for occurrence point clicks on the map
 */
export type PointData = {
  geohash: string;
  count: number;
};

/**
 * Configuration for a single occurrence overlay layer
 */
export type OccurrenceOverlay = {
  /** Unique identifier for the overlay */
  id: string;
  /** The predicate hash for the occurrence query */
  predicateHash: string;
  /** Optional query string parameter */
  q?: string;
  /** Custom styling for this overlay */
  style?: OverlayStyle;
  /** Z-index for layer ordering (higher = on top) */
  zIndex?: number;
};

/**
 * Basic occurrence record structure
 */
export type OccurrenceRecord = {
  key: string;
  classification?: {
    taxonMatch?: {
      usage?: {
        canonicalName?: string;
      };
    };
    usage?: {
      name?: string;
    };
  };
  eventDate?: string;
  basisOfRecord?: string;
  primaryImage?: {
    identifier?: string;
  };
};

/**
 * Occurrence search response structure
 */
export type OccurrenceSearchData = {
  occurrenceSearch?: {
    documents?: {
      results?: OccurrenceRecord[];
      total?: number;
    };
  };
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
 * Props for overlay management in map components
 */
export interface OverlayProps {
  /** Array of overlay configurations to render */
  overlays: OccurrenceOverlay[];
  /** Theme for default styling */
  theme?: Partial<Theme>;
  /** Callback when a predicate needs to be registered */
  registerPredicate?: (predicateHash: string) => void;
  /** Callback when a tile fails to load */
  onTileError?: () => void;
}

/**
 * Props for map event handling
 */
export interface MapEventProps {
  /** Latest event to process */
  latestEvent?: MapEvent;
  /** Event listener callback */
  listener?: (event: MapEvent) => void;
}

/**
 * Props for map interactions
 */
export interface MapInteractionProps {
  /** Callback when map is clicked (outside of features) */
  onMapClick?: () => void;
  /** Callback when an occurrence point is clicked */
  onPointClick?: (point: PointData) => void;
  /** Callback for loading state changes */
  onLoading?: (loading: boolean) => void;
}

/**
 * Props for drawing/filter functionality
 */
export interface DrawingProps {
  /** Current drawing tool mode */
  drawingTool?: string | null;
  /** Callback when drawing tool changes */
  onDrawingToolChange?: (tool: string | null) => void;
  /** Current filter geometries as WKT strings */
  features?: string[];
  /** Callback when filter geometries change */
  onFeaturesChange?: (params: { features: string[] }) => void;
}

/**
 * Map settings that can be persisted
 */
export interface MapSettings {
  lat?: number;
  lng?: number;
  zoom?: number;
  projection?: Projection;
}

/**
 * Combined props for the map component
 */
export interface MapProps
  extends MapEventProps,
    MapInteractionProps,
    DrawingProps,
    Pick<OverlayProps, 'overlays' | 'theme' | 'registerPredicate' | 'onTileError'> {
  mapConfig?: MapConfig;
  containerHeight?: number;
  containerWidth?: number;
  defaultMapSettings?: MapSettings;
  className?: string;
  mapPosition: MapPosition;
}

// Re-export shared types for convenience
export type { OverlayStyle, MapConfig } from './mapTypes';
