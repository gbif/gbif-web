/**
 * Shared map-related types used across map components
 */

import { Projection } from '@/components/maps/openlayers/projections';
import { AdHocMapProps } from './OpenlayersMap';

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
  component: React.ComponentType<AdHocMapProps>;
  mapConfig: MapConfig;
}

/**
 * Custom styling options for overlay layers
 */
export interface OverlayStyle {
  /** Custom color palette for density visualization */
  colors?: string[];
  /** Opacity for the layer (0-1) */
  opacity?: number;
  /** Circle radius stops for different density levels */
  radiusStops?: [number, number][];
}

/**
 * API keys for external map services
 */
export interface MapApiKeys {
  maptiler?: string;
}
