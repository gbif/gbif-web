export function getLayerConfig({tileString, theme}) {
  return {
    id: "occurrences",
    type: "circle",
    source: {
      type: "vector",
      tiles: [tileString]
    },
    "source-layer": "occurrence",
    paint: {
      // make circles larger as the user zooms from z12 to z22
      "circle-radius": {
        property: "total",
        type: "interval",
        //stops: [[0, 2]]
        stops: [[0, 2], [10, 3], [100, 5], [1000, 8], [10000, 12]]
      },
      // color circles by ethnicity, using data-driven styles
      "circle-color": {
        property: "total",
        type: "interval",
        stops: [0, 10, 100, 1000, 10000].map((x, i) => [x, theme.mapDensityColors[i]])
      },
      "circle-opacity": {
        property: "total",
        type: "interval",
        // stops: theme.darkTheme ? [[0, .6], [10, 0.7], [100, 0.8], [1000, 0.8], [10000, 0.9]] : [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
        stops: [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
      },
      "circle-stroke-color": theme.mapDensityColors[1],
      "circle-stroke-width": {
        property: "total",
        type: "interval",
        stops: [[0, 1], [10, 0]]
      }
    }
  };
}