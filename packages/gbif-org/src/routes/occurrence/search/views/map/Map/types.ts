/**
 * Shared map-related types used across map components
 */
import { AdHocMapCoreProps } from './OpenlayersMap';
import { Theme } from '@/config/theme/theme';
import { Projection } from '@/components/maps/openlayers/projections';
import { BoundingBox } from '@/types';
import { MapPosition } from './useMapPosition';

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
export type PointClickData = {
  geohash: string;
  count: number;
  layerId: string;
  predicate?: object;
};

/**
 * Configuration for a single occurrence overlay layer
 */
export type OccurrenceOverlay = {
  /** Unique identifier for the overlay */
  id: string;
  /** The predicate hash for the occurrence query */
  predicateHash: string;
  /** The actual predicate object (used by the UI and for graphql) for filtering occurrences */
  predicate: object;
  /** Optional query string parameter */
  q?: string;
  /** Custom styling for this overlay */
  style?: OverlayStyle;
  hidden: boolean;
};

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
  onPointClick?: (point: PointClickData) => void;
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
export interface AdHocMapInternalProps
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

/**
 * Human-readable projection names
 */
export type ProjectionName = 'PLATE_CAREE' | 'MERCATOR' | 'ARCTIC' | 'ANTARCTIC';

/**
 * Map between projection names and EPSG codes
 */
export const PROJECTION_MAP: Record<ProjectionName, Projection> = {
  PLATE_CAREE: 'EPSG_4326',
  MERCATOR: 'EPSG_3857',
  ARCTIC: 'EPSG_3575',
  ANTARCTIC: 'EPSG_3031',
};

/**
 * Available map style types
 */
export type MapStyleType = 'NATURAL' | 'BRIGHT' | 'DARK' | 'SATELLITE' | string;

/**
 * Map configuration object
 */
export interface MapConfig {
  basemapStyle: string;
  projection: Projection;
}

/**
 * Map style configuration with component and localization
 */
export interface MapStyleConfig {
  labelKey: string;
  component: React.ComponentType<AdHocMapCoreProps>;
  mapConfig: MapConfig;
}

/**
 * Custom styling options for overlay layers
 */
export interface OverlayStyle {
  /** Custom color palette for density visualization */
  mapDensityColors: string[];
  /** Opacity for the layer (0-1) */
  mapPointOpacities: number[];
  /** Circle radius thresholds for different density levels */
  mapPointSizes: number[];
}

/**
 * API keys for external map services
 */
export interface MapApiKeys {
  maptiler?: string;
}
