import { Theme } from '@/config/theme/theme';
import { AddLayerObject } from 'maplibre-gl';

type Args = {
  tileString: string;
  theme: Partial<Theme>;
  layerName: string;
};

export function getLayerConfig({ tileString, theme, layerName }: Args) {
  const mapDensityColors = [
    ...(theme?.mapDensityColors ?? ['#fed976', '#fd8d3c', '#fd8d3c', '#f03b20', '#bd0026']),
  ];
  if (mapDensityColors.length < 5) {
    // Ensure there are at least 5 colors
    while (mapDensityColors.length < 5) {
      mapDensityColors.push(mapDensityColors[mapDensityColors.length - 1]);
    }
  }
  const config: AddLayerObject = {
    id: layerName,
    type: 'circle',
    source: {
      type: 'vector',
      tiles: [tileString],
    },
    'source-layer': 'occurrence',
    paint: {
      // make circles larger as the user zooms from z12 to z22
      'circle-radius': {
        property: 'total',
        type: 'interval',
        //stops: [[0, 2]]
        stops: [
          [0, 4],
          [10, 4],
          [100, 5],
          [1000, 7],
          [10000, 10],
        ],
      },
      // color circles by ethnicity, using data-driven styles
      'circle-color': {
        property: 'total',
        type: 'interval',
        stops: [0, 10, 100, 1000, 10000].map((x, i) => [x, mapDensityColors[i]]),
      },
      // 'circle-opacity': {
      //   property: 'total',
      //   type: 'interval',
      //   stops: [
      //     [0, 1],
      //     [10, 0.8],
      //     [100, 0.8],
      //     [1000, 0.7],
      //     [10000, 0.7],
      //   ],
      // },
      'circle-stroke-color': mapDensityColors[2],
      'circle-stroke-width': {
        property: 'total',
        type: 'interval',
        // stops: [[0, 1], [10, 0]]
        stops: [
          [0, 1],
          [10, 1.5],
          [100, 0],
        ],
      },
    },
  };
  return config;
}
