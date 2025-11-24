import { type Theme } from '@/config/theme/theme';
import { getMapThemeValues } from '@/routes/occurrence/search/views/map/Map/getLayerConfig';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { type StyleFunction } from 'ol/style/Style';

const thresholds = function (thresholds: number[], total: number) {
  // get index based in which threshold the total falls into
  for (let i = 0; i < thresholds.length; i++) {
    const nextThreshold = thresholds[i + 1] || Number.MAX_VALUE;
    if (total <= nextThreshold) {
      return i;
    }
  }
  return thresholds.length - 1;
};

/**
 * Converts a hex color and opacity fraction to hex with alpha channel
 * @param {string} hex - Hex color (e.g., '#ff0000' or 'ff0000')
 * @param {number} opacity - Opacity from 0 to 1
 * @returns {string} Hex color with alpha channel (e.g., '#ff0000cc')
 */
function addOpacityToHex(hex: string, opacity: number): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert opacity (0-1) to hex (00-ff)
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${cleanHex}${alpha}`;
}

function getDensityPoint(mapPointThresholds: number[], theme: Partial<Theme>): Style[] {
  const { mapDensityColors, mapPointOpacities, mapPointSizes } = getMapThemeValues({ theme });

  const pointStyle = mapPointThresholds.map((_threshold, index) => {
    return new Style({
      image: new Circle({
        fill: new Fill({
          color: addOpacityToHex(mapDensityColors[index], mapPointOpacities[index]),
        }),
        // only add a stroke for the lower density points
        stroke:
          index < mapDensityColors.length - 1
            ? new Stroke({
                color: mapDensityColors[index + 1] ?? mapDensityColors[index - 1],
                width: 1,
              })
            : undefined,
        radius: mapPointSizes[index],
      }),
      fill: new Fill({ color: addOpacityToHex(mapDensityColors[index], mapPointOpacities[index]) }),
    });
  });

  return pointStyle;
}

export default function (siteTheme: Partial<Theme>): StyleFunction {
  const mapPointThresholds = [0, 10, 100, 1000, 10000];

  const densityPoints = getDensityPoint(mapPointThresholds, siteTheme);
  return function (feature) {
    const total = thresholds(mapPointThresholds, feature.get('total'));
    return densityPoints[total];
  };
}
