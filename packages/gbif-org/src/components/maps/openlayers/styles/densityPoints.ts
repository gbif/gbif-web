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

function getDensityPoint(theme?: Partial<Theme>): Style[] {
  const densityColours = [
    ...(theme?.mapDensityColors ?? ['#fed976', '#fd8d3c', '#fd8d3c', '#f03b20', '#bd0026']),
  ];
  const densityOpacity = ['', '', '', '', ''];
  // const densityOpacity = ['', 'cc', 'bb', '88', '88'];
  if (densityColours.length < 5) {
    // Ensure there are at least 5 colors
    while (densityColours.length < 5) {
      densityColours.push(densityColours[densityColours.length - 1]);
    }
  }
  const densityPoints = [
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[0] + densityOpacity[0] }),
        stroke: new Stroke({
          color: densityColours[2],
          width: 1,
        }),
        radius: 4,
      }),
      fill: new Fill({ color: densityColours[0] + densityOpacity[0] }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[1] + densityOpacity[1] }),
        stroke: new Stroke({
          color: densityColours[2],
          width: 1,
        }),
        radius: 4,
      }),
      fill: new Fill({ color: densityColours[1] + densityOpacity[1] }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[2] + densityOpacity[2] }),
        radius: 5,
      }),
      fill: new Fill({ color: densityColours[2] + densityOpacity[2] }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[3] + densityOpacity[3] }),
        radius: 8,
      }),
      fill: new Fill({ color: densityColours[3] + densityOpacity[3] }),
    }),
    new Style({
      image: new Circle({
        fill: new Fill({ color: densityColours[4] + densityOpacity[4] }),
        radius: 12,
      }),
      fill: new Fill({ color: densityColours[4] + densityOpacity[4] }),
    }),
  ];
  return densityPoints;
}

export default function (siteTheme?: Partial<Theme>): StyleFunction {
  const densityPoints = getDensityPoint(siteTheme);
  return function (feature) {
    const total = thresholds(feature.get('total'));
    return densityPoints[total];
  };
}
