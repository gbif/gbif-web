import { Theme } from '@/config/theme/theme';
import { AddLayerObject } from 'maplibre-gl';

type Args = {
  tileString: string;
  theme: Partial<Theme>;
  layerName: string;
};

function mapThemeEnsureFiveValues<T extends string | number>(values: T[], defaultValues: T[]): T[] {
  const result = [...(values && values.length > 0 ? values : defaultValues)];
  if (result.length < 5) {
    while (result.length < 5) {
      result.push(result[result.length - 1]);
    }
  }
  return result;
}

export function getMapThemeValues({ theme }: { theme: Partial<Theme> }) {
  const mapDensityColors = mapThemeEnsureFiveValues(theme?.mapDensityColors || [], [
    '#fed976',
    '#fd8d3c',
    '#fd8d3c',
    '#f03b20',
    '#bd0026',
  ]);

  const mapPointOpacities = mapThemeEnsureFiveValues(
    theme?.mapPointOpacities || [],
    [1, 0.8, 0.8, 0.7, 0.7]
  );

  const mapPointSizes = mapThemeEnsureFiveValues(theme?.mapPointSizes || [], [4, 4, 5, 7, 10]);
  return { mapDensityColors, mapPointOpacities, mapPointSizes };
}

export function getLayerConfig({ tileString, theme, layerName }: Args) {
  const mapPointThresholds = [0, 10, 100, 1000, 10000];
  const { mapDensityColors, mapPointOpacities, mapPointSizes } = getMapThemeValues({ theme });

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
        stops: mapPointThresholds.map((x, i) => [x, mapPointSizes[i]]),
      },
      // color circles by ethnicity, using data-driven styles
      'circle-color': {
        property: 'total',
        type: 'interval',
        stops: mapPointThresholds.map((x, i) => [x, mapDensityColors[i]]),
      },
      'circle-opacity': {
        property: 'total',
        type: 'interval',
        stops: mapPointThresholds.map((x, i) => [x, mapPointOpacities[i]]),
      },
      'circle-stroke-color': mapDensityColors[2],
      'circle-stroke-width': {
        property: 'total',
        type: 'interval',
        stops: mapPointThresholds.map((x, i) => [x, i === 0 ? 1 : 0]),
      },
    },
  };
  return config;
}
