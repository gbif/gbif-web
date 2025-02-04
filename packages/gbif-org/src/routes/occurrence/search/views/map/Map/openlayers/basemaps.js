export const basemaps = {
  EPSG_4326: {
    name: 'PLATE_CAREE',
    url: import.meta.env.PUBLIC_TILE_API + '/4326/omt/{z}/{x}/{y}.pbf?',
    srs: 'EPSG:4326',
  },
  EPSG_3857: {
    name: 'MERCATOR',
    url: import.meta.env.PUBLIC_TILE_API + '/3857/omt/{z}/{x}/{y}.pbf?',
    srs: 'EPSG:3857',
  },
  EPSG_3575: {
    name: 'ARCTIC',
    url: import.meta.env.PUBLIC_TILE_API + '/3575/omt/{z}/{x}/{y}.pbf?',
    srs: 'EPSG:3575',
  },
  EPSG_3031: {
    name: 'ANTARCTIC',
    url: import.meta.env.PUBLIC_TILE_API + '/3031/omt/{z}/{x}/{y}.pbf?',
    srs: 'EPSG:3031',
  },
};
