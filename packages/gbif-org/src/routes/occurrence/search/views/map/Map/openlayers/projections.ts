import { stringify } from '@/utils/querystring';
import { MVT as MVTFormat } from 'ol/format';
import { VectorTile as VectorTileLayer } from 'ol/layer';
import * as olProj from 'ol/proj';
import { transform } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import { VectorTile as VectorTileSource } from 'ol/source';
import { createXYZ } from 'ol/tilegrid';
import TileGrid from 'ol/tilegrid/TileGrid';
import View from 'ol/View';
import proj4 from 'proj4';
import { basemaps } from './basemaps';
import createBasicBaseMapStyle from './styles/basicBaseMap';
import densityPoints from './styles/densityPoints';

proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
proj4.defs(
  'EPSG:3575',
  '+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
);
proj4.defs(
  'EPSG:3031',
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
register(proj4);

// set up projections and shared variables
const tileSize = 512;
const maxZoom = 13;
const maxZoomView = 18;
const pixelRatio = window?.devicePixelRatio || 1;

function get4326() {
  const extent = 180.0;
  const resolutions = Array.from(
    new Array(maxZoom + 1),
    (_, i) => extent / tileSize / Math.pow(2, i)
  );

  const tileGridOptions = {
    extent: olProj.get('EPSG:4326')?.getExtent(),
    minZoom: 0,
    maxZoom: maxZoom,
    resolutions: resolutions,
    tileSize: tileSize,
  };
  const tileGrid = new TileGrid(tileGridOptions);

  return {
    name: 'EPSG_4326',
    wrapX: true,
    srs: 'EPSG:4326',
    projection: 'EPSG:4326',
    epsg: 4326,
    tilePixelRatio: 1,
    tileGrid: tileGrid,
    resolutions: resolutions,
    // extent: olProj.get('EPSG:4326').getExtent(),
    fitExtent: [-179, -1, 179, 1],
    getView: function (lat: number, lon: number, zoom: number) {
      lat = lat || 0;
      lon = lon || 0;
      zoom = zoom || 0;
      return new View({
        maxZoom: maxZoomView,
        minZoom: 0,
        center: [lon, lat],
        zoom: zoom,
        projection: 'EPSG:4326',
      });
    },
    getBaseLayer: function (params = {}) {
      return getLayer(basemaps.EPSG_4326.url, this, params, 'baseLayer');
    },
    getOccurrenceLayer: function (params = {}) {
      return getLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/density/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
    getAdhocLayer: function (params = {}) {
      return getAdhocLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/adhoc/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
  };
}

function get3857() {
  const tileGrid16 = createXYZ({
    minZoom: 0,
    maxZoom: maxZoom,
    tileSize: tileSize,
  });
  return {
    name: 'EPSG_3857',
    wrapX: true,
    srs: 'EPSG:3857',
    // projection: 'EPSG:3857',
    epsg: 3857,
    tileGrid: tileGrid16,
    // resolutions: resolutions,
    fitExtent: olProj.transformExtent([-90, -75, 90, 75], 'EPSG:4326', 'EPSG:3857'),
    getView: function (lat: number, lon: number, zoom: number) {
      if (Math.abs(lat) > 85) {
        lat = 0;
        lon = 0;
        zoom = 1;
      }
      [lon, lat] = transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
      lat = lat || 0;
      lon = lon || 0;
      zoom = zoom || 0;
      return new View({
        maxZoom: maxZoomView,
        minZoom: 0,
        center: [lon, lat],
        zoom: zoom,
        projection: 'EPSG:3857',
      });
    },
    getBaseLayer: function (params = {}) {
      return getLayer(basemaps.EPSG_3857.url, this, params, 'baseLayer');
    },
    getOccurrenceLayer: function (params = {}) {
      return getLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/density/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
    getAdhocLayer: function (params = {}) {
      return getAdhocLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/adhoc/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
  };
}

function get3575() {
  const halfWidth = Math.sqrt(2) * 6371007.2;
  const extent = [-halfWidth, -halfWidth, halfWidth, halfWidth];
  olProj.get('EPSG:3575')?.setExtent(extent);
  const resolutions = Array.from(
    new Array(maxZoom + 1),
    (_, i) => halfWidth / (tileSize * Math.pow(2, i - 1))
  );

  const tileGridOptions = {
    extent: olProj.get('EPSG:3575')?.getExtent(),
    origin: [-halfWidth, halfWidth],
    minZoom: 0,
    maxZoom: maxZoom,
    resolutions: resolutions,
    tileSize: tileSize,
  };

  const tileGrid16 = new TileGrid(tileGridOptions);

  return {
    name: 'EPSG_3575',
    wrapX: false,
    srs: 'EPSG:3575',
    projection: 'EPSG:3575',
    epsg: 3575,
    // tile_grid_14: tile_grid_14,
    tileGrid: tileGrid16,
    resolutions: resolutions,
    fitExtent: extent,
    getView: function (lat: number, lon: number, zoom: number) {
      if (lat < 45) {
        lat = 90;
        lon = 0;
        zoom = 1;
      }
      [lon, lat] = transform([lon, lat], 'EPSG:4326', 'EPSG:3575');
      lat = lat || 0;
      lon = lon || 0;
      zoom = zoom || 0;
      return new View({
        maxZoom: maxZoomView,
        minZoom: 0,
        center: [lon, lat],
        zoom: zoom,
        projection: olProj.get('EPSG:3575')!,
      });
    },
    getBaseLayer: function (params = {}) {
      return getLayer(basemaps.EPSG_3575.url, this, params, 'baseLayer');
    },
    getOccurrenceLayer: function (params = {}) {
      return getLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/density/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
    getAdhocLayer: function (params = {}) {
      return getAdhocLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/adhoc/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
  };
}

function get3031() {
  const halfWidth = 12367396.2185; // To the Equator
  const extent = [-halfWidth, -halfWidth, halfWidth, halfWidth];
  olProj.get('EPSG:3031')?.setExtent(extent);
  const resolutions = Array.from(
    new Array(maxZoom + 1),
    (_, i) => halfWidth / (tileSize * Math.pow(2, i - 1))
  );

  const tileGridOptions = {
    extent: extent,
    origin: [-halfWidth, halfWidth],
    minZoom: 0,
    maxZoom: maxZoom,
    resolutions: resolutions,
    tileSize: tileSize,
  };

  const tileGrid16 = new TileGrid(tileGridOptions);

  return {
    name: 'EPSG_3031',
    wrapX: false,
    srs: 'EPSG:3031',
    projection: 'EPSG:3031',
    epsg: 3031,
    tileGrid: tileGrid16,
    resolutions: resolutions,
    fitExtent: extent,
    getView: function (lat: number, lon: number, zoom: number) {
      if (lat > -20) {
        lat = -90;
        lon = 0;
        zoom = 1;
      }
      [lon, lat] = transform([lon, lat], 'EPSG:4326', 'EPSG:3031');
      lat = lat || 0;
      lon = lon || 0;
      zoom = zoom || 0;
      return new View({
        maxZoom: maxZoomView,
        minZoom: 0,
        center: [lon, lat],
        zoom: zoom,
        projection: olProj.get('EPSG:3031')!,
      });
    },
    getBaseLayer: function (params = {}) {
      return getLayer(basemaps.EPSG_3031.url, this, params, 'baseLayer');
    },
    getOccurrenceLayer: function (params = {}) {
      return getLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/density/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
    getAdhocLayer: function (params = {}) {
      return getAdhocLayer(
        import.meta.env.PUBLIC_API_V2 + '/map/occurrence/adhoc/{z}/{x}/{y}.mvt?',
        this,
        params
      );
    },
  };
}

function getLayer(baseUrl: string, proj: any, params: Record<string, any>, name?: string) {
  params = params || {};
  params.srs = proj.srs;
  const progress = params.progress;
  delete params.progress;

  const source = new VectorTileSource({
    format: new MVTFormat(),
    projection: proj.projection,
    tileGrid: proj.tileGrid,
    // @ts-ignore Typescript doesn't like this property after the ol upgrade
    tilePixelRatio: pixelRatio,
    url: baseUrl + stringify(params),
    wrapX: proj.wrapX,
    attributions: [
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      '© <a href="https://openmaptiles.org/" class="inherit">OpenMapTiles</a>',
      '<a href="https://www.gbif.org/citation-guidelines">GBIF</a>',
    ],
  });

  if (progress) {
    source.on('tileloadstart', function () {
      progress.addLoading();
    });

    source.on('tileloadend', function () {
      progress.addLoaded();
    });
    source.on('tileloaderror', function () {
      progress.addLoaded();
    });
  }

  const layer = new VectorTileLayer({
    extent: proj.extent,
    source: source,
    useInterimTilesOnError: false,
    visible: true,
    // @ts-ignore Typescript doesn't like this property after the ol upgrade
    name: name,
    declutter: true,
    style: createBasicBaseMapStyle(),
  });
  return layer;
}

// currently map resolution isn't too good.
// it is neccessary to hardcode resolution to zoom levels
/*
0: 32
1: 64
2: 128
3: 256
4: 128
5: 256
6: 512
7: 1024
8: 256
9: 512
10: 1042
11: 2048
12: 1024
13: 2048
14: 4096
*/
function getAdhocLayer(baseUrl: string, proj: any, params: any, name = 'occurrences') {
  params = params || {};
  params.srs = proj.srs;
  const progress = params.progress;
  delete params.progress;
  const onError = params.onError;
  delete params.onError;
  const siteTheme = params.siteTheme;
  delete params.siteTheme;
  const source = new VectorTileSource({
    format: new MVTFormat(),
    projection: proj.projection,
    tileGrid: proj.tileGrid,
    // @ts-ignore Typescript doesn't like this property after the ol upgrade
    tilePixelRatio: pixelRatio,
    url: baseUrl + stringify(params),
    wrapX: proj.wrapX,
    maxZoom: 18,
  });

  if (progress) {
    source.on('tileloadstart', function () {
      progress.addLoading();
    });

    source.on('tileloadend', function () {
      progress.addLoaded();
    });
    source.on('tileloaderror', function () {
      progress.addLoaded();
    });
  }
  if (onError) {
    source.on('tileloaderror', function (err) {
      onError();
    });
  }

  return new VectorTileLayer({
    extent: proj.extent,
    source: source,
    useInterimTilesOnError: false,
    visible: true,
    // @ts-ignore Typescript doesn't like this property after the ol upgrade
    name: name,
    style: densityPoints(siteTheme),
    // className: 'occurrenceLayer'
    zIndex: 1000,
  });
}

export const projections = {
  EPSG_4326: get4326(),
  EPSG_3575: get3575(),
  EPSG_3031: get3031(),
  EPSG_3857: get3857(),
};
