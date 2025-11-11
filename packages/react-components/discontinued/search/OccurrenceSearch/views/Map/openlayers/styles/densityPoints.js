import { Style, Fill, Stroke, Circle } from 'ol/style';

const thresholds = function (total) {
  if (total <= 10) return 0;
  if (total <= 100) return 1;
  if (total <= 1000) return 2;
  if (total <= 10000) return 3;
  return 4;
};

const densityColours = [
  '#fed976',
  '#fd8d3ccc',
  '#fd8d3cbb',
  '#f03b2088',
  '#bd002688',
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
      fill: new Fill({ color: densityColours[1] }),
      stroke: new Stroke({
        color: densityColours[2],
        width: 1,
      }),
      radius: 4,
    }),
    fill: new Fill({ color: densityColours[1] }),
  }),
  new Style({
    image: new Circle({
      fill: new Fill({ color: densityColours[2] }),
      radius: 5,
    }),
    fill: new Fill({ color: densityColours[2] }),
  }),
  new Style({
    image: new Circle({
      fill: new Fill({ color: densityColours[3] }),
      radius: 8,
    }),
    fill: new Fill({ color: densityColours[3] }),
  }),
  new Style({
    image: new Circle({
      fill: new Fill({ color: densityColours[4] }),
      radius: 12,
    }),
    fill: new Fill({ color: densityColours[4] }),
  }),
];

export default function (feature, resolution) {
  var total = thresholds(feature.get('total'));
  return densityPoints[total];
};