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
        stops: [[0, 4], [10, 4], [100,5], [1000, 7], [10000, 10]]
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
        stops: [[0, 1], [10, 0.8], [100, 0.8], [1000, 0.7], [10000, 0.7]]
      },
      "circle-stroke-color": theme.mapDensityColors[2],
      "circle-stroke-width": {
        property: "total",
        type: "interval",
        // stops: [[0, 1], [10, 0]]
        stops: [[0, 1], [10, 1.5], [100, 0]]
      }
    }
  };
}