import env from '../../../../../.env.json';
import MapComponentMB from './MapboxMap';
import MapComponentOL from './OpenlayersMap';
const pixelRatio = parseInt(window.devicePixelRatio) || 1;

export function getMapStyles({ apiKeys = {}, language = 'en' }) {
  const natural = `styleName=natural&background=${encodeURIComponent('#e5e9cd')}&language=${language}&pixelRatio=${pixelRatio}`;
  const light = `styleName=geyser&background=${encodeURIComponent('#f3f3f1')}&language=${language}&pixelRatio=${pixelRatio}`;
  const dark = `styleName=tuatara&background=${encodeURIComponent('#363332')}&language=${language}&pixelRatio=${pixelRatio}`;
  return {
    NATURAL_ARCTIC: {
      labelKey: 'map.styles.natural',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3575/gbif-raster?${natural}`,
        projection: 'EPSG_3575'
      }
    },
    BRIGHT_ARCTIC: {
      labelKey: 'map.styles.bright',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3575/gbif-raster?${light}`,
        projection: 'EPSG_3575'
      }
    },
    DARK_ARCTIC: {
      labelKey: 'map.styles.dark',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3575/gbif-raster?${dark}`,
        projection: 'EPSG_3575'
      }
    },
    NATURAL_PLATE_CAREE: {
      labelKey: 'map.styles.natural',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/4326/gbif-raster?${natural}`,
        projection: 'EPSG_4326'
      }
    },
    BRIGHT_PLATE_CAREE: {
      labelKey: 'map.styles.bright',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/4326/gbif-raster?${light}`,
        projection: 'EPSG_4326'
      }
    },
    DARK_PLATE_CAREE: {
      labelKey: 'map.styles.dark',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/4326/gbif-raster?${dark}`,
        projection: 'EPSG_4326'
      }
    },
    SATELLITE_MERCATOR: {
      labelKey: 'map.styles.satellite',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3857/satellite_maptiler?maptilerApiKey=${apiKeys.maptiler}`,
        projection: 'EPSG_3857'
      }
    },
    NATURAL_MERCATOR: {
      labelKey: 'map.styles.natural',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster?${natural}`,
        projection: 'EPSG_3857'
      }
    },
    NATURAL_HILLSHADE_MERCATOR: {
      labelKey: 'map.styles.natural',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster-hillshade?${natural}&maptilerApiKey=${apiKeys.maptiler}`,
        projection: 'EPSG_3857'
      }
    },
    BRIGHT_MERCATOR: {
      labelKey: 'map.styles.bright',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster?${light}`,
        projection: 'EPSG_3857'
      }
    },
    DARK_MERCATOR: {
      labelKey: 'map.styles.dark',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3857/gbif-raster?${dark}`,
        projection: 'EPSG_3857'
      }
    },
    BRIGHT_MAPBOX_MERCATOR: {
      labelKey: 'map.styles.bright',
      component: MapComponentMB,
      mapConfig: {
        basemapStyle: `https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=${apiKeys.mapbox}`,
        projection: 'EPSG_3857'
      }
    },
    NATURAL_ANTARCTIC: {
      labelKey: 'map.styles.natural',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3031/gbif-raster?${natural}`,
        projection: 'EPSG_3031'
      }
    },
    BRIGHT_ANTARCTIC: {
      labelKey: 'map.styles.bright',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3031/gbif-raster?${light}`,
        projection: 'EPSG_3031'
      }
    },
    DARK_ANTARCTIC: {
      labelKey: 'map.styles.dark',
      component: MapComponentOL,
      mapConfig: {
        basemapStyle: `${env.MAP_STYLES}/3031/gbif-raster?${dark}`,
        projection: 'EPSG_3031'
      }
    }
  }
}