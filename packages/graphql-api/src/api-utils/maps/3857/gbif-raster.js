import gbifTileAttribution from '../gbif-tile-attribution';

export default {
  version: 8,
  name: 'gbif-{{styleName}}-3857',
  metadata: {
    'gb:reproject': false,
  },
  sprite: 'https://openmaptiles.github.io/positron-gl-style/sprite',
  glyphs:
    'https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=wFxbBf3Tv2e75QQfYOOW',
  sources: {
    openmaptiles: {
      type: 'raster',
      tiles: [
        'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@{{pixelRatio}}x.png?style=gbif-{{styleName}}-{{language}}',
      ],
      projection: 'EPSG:3857',
      wrapX: true,
      maxZoom: 17,
      attribution: gbifTileAttribution,
      tileSize: 512,
    },
  },
  layers: [
    {
      id: 'background',
      paint: {
        'background-color': '{{background}}',
      },
      type: 'background',
    },
    {
      id: 'base-layer',
      type: 'raster',
      source: 'openmaptiles',
    },
  ],
  id: 'gbif-{{styleName}}-3857',
};
