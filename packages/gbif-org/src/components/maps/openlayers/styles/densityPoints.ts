import { type Theme } from '@/config/theme/theme';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { type StyleFunction } from 'ol/style/Style';

const thresholds = function (total: number) {
  if (total <= 10) return 0;
  if (total <= 100) return 1;
  if (total <= 1000) return 2;
  if (total <= 10000) return 3;
  return 4;
};

function getDensityPoint(theme?: Theme) {
  const densityColours = theme?.mapDensityColors ?? [
    '#fed976',
    '#fd8d3c',
    '#fd8d3c',
    '#f03b20',
    '#bd0026',
  ];
  const densityPoints = [
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[0] }),
        stroke: new Stroke({
          color: densityColours[2],
          width: 1,
        }),
        radius: 4,
      }),
      fill: new Fill({ color: densityColours[0] }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[1] + 'cc' }),
        stroke: new Stroke({
          color: densityColours[2],
          width: 1,
        }),
        radius: 4,
      }),
      fill: new Fill({ color: densityColours[1] + 'cc' }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[2] + 'bb' }),
        radius: 5,
      }),
      fill: new Fill({ color: densityColours[2] + 'bb' }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[3] + '88' }),
        radius: 8,
      }),
      fill: new Fill({ color: densityColours[3] + '88' }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[4] + '88' }),
        radius: 12,
      }),
      fill: new Fill({ color: densityColours[4] + '88' }),
    }),
  ];
  return densityPoints;
}

export default function (siteTheme?: Theme): StyleFunction {
  const densityPoints = getDensityPoint(siteTheme);
  return function (feature) {
    const total = thresholds(feature.get('total'));
    return densityPoints[total];
  };
}
