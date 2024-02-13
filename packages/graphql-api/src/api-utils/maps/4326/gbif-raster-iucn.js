import gbifTileAttribution from '../gbif-tile-attribution';
import config from '../../../config';

export default function ({ iucnTaxonID, styleName, language, pixelRatio }) {
  let template = {
    version: 8,
    name: `gbif-${styleName}-4326`,
    metadata: {
      'gb:reproject': true,
    },
    sprite: `${config.origin}/map/iucn/sprite`,
    sources: {
      iucn: {
        type: 'vector',
        tiles: [
          `https://api.gbif-dev.org/v1/geocode/tile/iucn/{z}/{x}/{y}.mvt`,
        ],
        attribution: gbifTileAttribution,
        tileSize: 512,
        projection: 'EPSG:4326',
        wrapX: true,
        maxZoom: 18,
        tilegridOptions: {
          extent: [-180, -90, 180, 90],
          minZoom: 0,
          maxZoom: 13,
          resolutions: [
            0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
            0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625,
            0.0006866455078125, 0.00034332275390625, 0.000171661376953125,
            0.0000858306884765625, 0.00004291534423828125,
          ],
          tileSize: 512,
        },
      },
      openmaptiles: {
        type: 'raster',
        tiles: [
          `https://tile.gbif.org/4326/omt/{z}/{x}/{y}@${pixelRatio}x.png?style=gbif-${styleName}-${language}`,
        ],
        attribution: gbifTileAttribution,
        tileSize: 512,
        projection: 'EPSG:4326',
        wrapX: true,
        maxZoom: 18,
        tilegridOptions: {
          extent: [-180, -90, 180, 90],
          minZoom: 0,
          maxZoom: 13,
          resolutions: [
            0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625,
            0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625,
            0.0006866455078125, 0.00034332275390625, 0.000171661376953125,
            0.0000858306884765625, 0.00004291534423828125,
          ],
          tileSize: 512,
        },
      },
    },
    layers: [
      {
        id: 'background',
        paint: {
          'background-color': 'hsl(47, 26%, 88%)',
        },
        type: 'background',
      },
      {
        id: 'base-layer',
        type: 'raster',
        source: 'openmaptiles',
      },
    ],
    id: `gbif-${styleName}-4326`,
  };

  if (iucnTaxonID) {
    template.sources.iucn.tiles[0] += `?id=${iucnTaxonID}`;
    template.layers = template.layers.concat([
      {
        "id": "iucn_border",
        "type": "line",
        "source": "iucn",
        "source-layer": "iucn",
        "paint": {
          "line-color": "#cb5656",
          "line-width": 3
        }
      },
      {
        "id": "iucn_area",
        "type": "fill",
        "source": "iucn",
        "source-layer": "iucn",
        "paint": {
          "fill-antialias": false,
          "fill-color": "rgba(276, 0, 0, 1)",
          "fill-opacity": 0.3,
          "fill-pattern": "iucn_pattern"
        }
      },
    ])
  }

  return template;
}