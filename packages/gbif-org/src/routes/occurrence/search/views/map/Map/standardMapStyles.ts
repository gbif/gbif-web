import { pixelRatio } from '@/utils/pixelRatio';
import MapComponentML from './MapLibreMap';
import MapComponentOL from './OpenlayersMap';
import type { MapStyleConfig, MapApiKeys } from './types';

const MAP_STYLES = `${import.meta.env.PUBLIC_WEB_UTILS}/map-styles`;

// Type definitions
type StyleName = 'natural' | 'geyser' | 'tuatara';

type MapStyleKey =
  | 'NATURAL_ARCTIC'
  | 'BRIGHT_ARCTIC'
  | 'DARK_ARCTIC'
  | 'NATURAL_PLATE_CAREE'
  | 'BRIGHT_PLATE_CAREE'
  | 'DARK_PLATE_CAREE'
  | 'SATELLITE_MERCATOR'
  | 'NATURAL_MERCATOR'
  | 'NATURAL_HILLSHADE_MERCATOR'
  | 'BRIGHT_MERCATOR'
  | 'DARK_MERCATOR'
  | 'NATURAL_ANTARCTIC'
  | 'BRIGHT_ANTARCTIC'
  | 'DARK_ANTARCTIC';

type MapStyles = Record<MapStyleKey, MapStyleConfig>;

interface GetMapStylesArgs {
  apiKeys?: MapApiKeys;
  language?: string;
}

// Helper functions
function buildStyleQuery(styleName: StyleName, background: string, language: string): string {
  return `styleName=${styleName}&background=${encodeURIComponent(
    background
  )}&language=${language}&pixelRatio=${pixelRatio}`;
}

export function getMapStyles({ apiKeys = {}, language = 'en' }: GetMapStylesArgs = {}): MapStyles {
  const natural = buildStyleQuery('natural', '#e5e9cd', language);
  const light = buildStyleQuery('geyser', '#f3f3f1', language);
  const dark = buildStyleQuery('tuatara', '#363332', language);

  return {
    NATURAL_ARCTIC: {
      labelKey: 'map.styles.natural',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3575/gbif-raster?${natural}`,
        projection: 'EPSG_3575',
      },
    },
    BRIGHT_ARCTIC: {
      labelKey: 'map.styles.bright',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3575/gbif-raster?${light}`,
        projection: 'EPSG_3575',
      },
    },
    DARK_ARCTIC: {
      labelKey: 'map.styles.dark',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3575/gbif-raster?${dark}`,
        projection: 'EPSG_3575',
      },
    },
    NATURAL_PLATE_CAREE: {
      labelKey: 'map.styles.natural',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/4326/gbif-raster?${natural}`,
        projection: 'EPSG_4326',
      },
    },
    BRIGHT_PLATE_CAREE: {
      labelKey: 'map.styles.bright',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/4326/gbif-raster?${light}`,
        projection: 'EPSG_4326',
      },
    },
    DARK_PLATE_CAREE: {
      labelKey: 'map.styles.dark',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/4326/gbif-raster?${dark}`,
        projection: 'EPSG_4326',
      },
    },
    SATELLITE_MERCATOR: {
      labelKey: 'map.styles.satellite',
      component: MapComponentML,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3857/satellite_maptiler?maptilerApiKey=${apiKeys.maptiler}`,
        projection: 'EPSG_3857',
      },
    },
    NATURAL_MERCATOR: {
      labelKey: 'map.styles.natural',
      component: MapComponentML,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3857/gbif-raster?${natural}`,
        projection: 'EPSG_3857',
      },
    },
    NATURAL_HILLSHADE_MERCATOR: {
      labelKey: 'map.styles.natural',
      component: MapComponentML,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3857/gbif-raster-hillshade?${natural}&maptilerApiKey=${apiKeys.maptiler}`,
        projection: 'EPSG_3857',
      },
    },
    BRIGHT_MERCATOR: {
      labelKey: 'map.styles.bright',
      component: MapComponentML,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3857/gbif-raster?${light}`,
        projection: 'EPSG_3857',
      },
    },
    DARK_MERCATOR: {
      labelKey: 'map.styles.dark',
      component: MapComponentML,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3857/gbif-raster?${dark}`,
        projection: 'EPSG_3857',
      },
    },
    NATURAL_ANTARCTIC: {
      labelKey: 'map.styles.natural',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3031/gbif-raster?${natural}`,
        projection: 'EPSG_3031',
      },
    },
    BRIGHT_ANTARCTIC: {
      labelKey: 'map.styles.bright',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3031/gbif-raster?${light}`,
        projection: 'EPSG_3031',
      },
    },
    DARK_ANTARCTIC: {
      labelKey: 'map.styles.dark',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${MAP_STYLES}/3031/gbif-raster?${dark}`,
        projection: 'EPSG_3031',
      },
    },
  };
}

// Export types for use in other files
export type { MapStyles, MapStyleKey, GetMapStylesArgs };
export type { MapStyleConfig, MapConfig } from './mapTypes';
