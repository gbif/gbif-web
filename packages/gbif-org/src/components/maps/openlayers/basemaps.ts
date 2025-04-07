import { pixelRatio } from '@/utils/pixelRatio';

export const basemaps = {
  EPSG_4326: {
    name: 'PLATE_CAREE',
    url: {
      vector: import.meta.env.PUBLIC_TILE_API + '/4326/omt/{z}/{x}/{y}.pbf?',
      raster: import.meta.env.PUBLIC_TILE_API + '/4326/omt/{z}/{x}/{y}@' + pixelRatio + 'x.png?',
    },
    srs: 'EPSG:4326',
  },
  EPSG_3857: {
    name: 'MERCATOR',
    url: {
      vector: import.meta.env.PUBLIC_TILE_API + '/3857/omt/{z}/{x}/{y}.pbf?',
      raster: import.meta.env.PUBLIC_TILE_API + '/3857/omt/{z}/{x}/{y}@' + pixelRatio + 'x.png?',
    },
    srs: 'EPSG:3857',
  },
  EPSG_3575: {
    name: 'ARCTIC',
    url: {
      vector: import.meta.env.PUBLIC_TILE_API + '/3575/omt/{z}/{x}/{y}.pbf?',
      raster: import.meta.env.PUBLIC_TILE_API + '/3575/omt/{z}/{x}/{y}@' + pixelRatio + 'x.png?',
    },
    srs: 'EPSG:3575',
  },
  EPSG_3031: {
    name: 'ANTARCTIC',
    url: {
      vector: import.meta.env.PUBLIC_TILE_API + '/3031/omt/{z}/{x}/{y}.pbf?',
      raster: import.meta.env.PUBLIC_TILE_API + '/3031/omt/{z}/{x}/{y}@' + pixelRatio + 'x.png?',
    },
    srs: 'EPSG:3031',
  },
};
