export function getLayerConfig(tileString) {
  return {
    id: "occurrences",
    type: "circle",
    source: {
      type: "vector",
      tiles: [tileString]
    },
    "source-layer": "occurrences",
    paint: {
      // make circles larger as the user zooms from z12 to z22
      "circle-radius": {
        property: "count",
        type: "interval",
        //stops: [[0, 2]]
        stops: [[0, 2], [10, 3], [100, 5], [1000, 8], [10000, 15]]
      },
      // color circles by ethnicity, using data-driven styles
      "circle-color": {
        property: "count",
        type: "interval",
        stops: [
          [0, "#fed976"], //#b99939
          [10, "#fd8d3c"],
          [100, "#fd8d3c"], //#b45100
          [1000, "#f03b20"], //#a40000
          [10000, "#bd0026"]
        ] //#750000
      },
      "circle-opacity": {
        property: "count",
        type: "interval",
        stops: [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
      },
      "circle-stroke-color": {
        property: "count",
        type: "interval",
        stops: [
          [0, "#fe9724"], //#b99939
          [10, "#fd5b24"],
          [100, "#fd471d"], //#b45100
          [1000, "#f01129"], //#a40000
          [10000, "#bd0047"]
        ] //#750000
      },
      "circle-stroke-width": {
        property: "count",
        type: "interval",
        stops: [[0, 1], [10, 0]]
      }
    }
  };
}