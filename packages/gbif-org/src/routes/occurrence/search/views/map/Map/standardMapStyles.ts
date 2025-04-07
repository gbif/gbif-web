import MapComponentML from './MapLibreMap';
import MapComponentOL from './OpenlayersMap';
const pixelRatio = window.devicePixelRatio || 1;

const MAP_STYLES = `${import.meta.env.PUBLIC_WEB_UTILS}/map-styles`;

type Args = {
  apiKeys?: { maptiler?: string };
  language: string;
};

export function getMapStyles({ apiKeys = {}, language = 'en' }: Args) {
  const natural = `styleName=natural&background=${encodeURIComponent(
    '#e5e9cd'
  )}&language=${language}&pixelRatio=${pixelRatio}`;
  const light = `styleName=geyser&background=${encodeURIComponent(
    '#f3f3f1'
  )}&language=${language}&pixelRatio=${pixelRatio}`;
  const dark = `styleName=tuatara&background=${encodeURIComponent(
    '#363332'
  )}&language=${language}&pixelRatio=${pixelRatio}`;
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
