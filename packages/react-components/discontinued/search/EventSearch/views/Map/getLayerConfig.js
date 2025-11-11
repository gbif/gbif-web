export function getLayerConfig({tileString, theme}) {
  const brightMapColors = [
    "#f4ae72",
    "#fe9176",
    "#F7642E",
    "#f03b20",
    "#bd0026"
  ];
  return {
    id: "events",
    type: "circle",
    source: {
      type: "vector",
      tiles: [tileString]
    },
    "source-layer": "aggs",
    paint: {
      // make circles larger as the user zooms from z12 to z22
      "circle-radius": {
        property: "_count",
        type: "interval",
        stops: [[0, 3.6], [5, 4.8], [10, 6], [100, 9.6], [1000, 14]]
      },
      // color circles by ethnicity, using data-driven styles
      "circle-color": {
        property: "_count",
        type: "interval",
        stops: [0, 10, 100, 1000, 10000].map((x, i) => [x, brightMapColors[i]])
      },
      "circle-opacity": {
        property: "_count",
        type: "interval",
        // stops: theme.darkTheme ? [[0, .6], [10, 0.7], [100, 0.8], [1000, 0.8], [10000, 0.9]] : [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
        stops: [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
      },
      "circle-stroke-color": theme.mapDensityColors[1],
      "circle-stroke-width": {
        property: "_count",
        type: "interval",
        stops: [[5, 1], [10, 0]]
      }
    }
  };
}