import proj4 from 'proj4';

// Shared proj4 registrations. Imported by both the OpenLayers projection
// registry and small utilities (e.g. setStoredMapPosition) that need to
// reproject coordinates without dragging OpenLayers into their chunk.
proj4.defs(
  'EPSG:4326',
  '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
);
proj4.defs(
  'EPSG:3575',
  '+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
);
proj4.defs(
  'EPSG:3031',
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);

export const srsByEpsgName = {
  EPSG_4326: 'EPSG:4326',
  EPSG_3857: 'EPSG:3857',
  EPSG_3575: 'EPSG:3575',
  EPSG_3031: 'EPSG:3031',
} as const;

export type EpsgName = keyof typeof srsByEpsgName;
