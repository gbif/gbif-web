let coordinateConverter = require('../util/coordinateConverter');

module.exports = agg2tile;

function agg2tile(results, x, y, z, extent) {
  let zoomSquared = 1 << z;

  var buckets = results.aggregations.geo.buckets;
  var features = [];
  buckets.forEach(function (e) {
    addFeature(e, x, y, zoomSquared, extent, features);
  });

  var tile = {
    layers: [
      {
        name: 'occurrences',
        version: 2,
        extent: 4096,
        features: features
      }
    ]
  };

  return tile;
}

function addFeature(e, x, y, zoomSquared, extent, features) {
  //transform to tile coordinate
  let tileCoordinates = coordinateConverter.getTileCoordinates(e.geo.location.lat, e.geo.location.lon, x, y, zoomSquared, extent);
  if (!tileCoordinates) {
    // console.log('lat lon outside tile - this shouldn\'t happen'); //TODO investigate why this is in fact happening
    return;
  }
  var prop = {
    geometry: [[{ x: tileCoordinates.x, y: tileCoordinates.y }]],
    properties: {
      count: getSimpleCount(e.geo.count),
      geohash: e.key,
      // precision: e.key.length
    },
    type: 1
  };
  if (e.density) {
    prop.properties.count = e.density.value;
  }

  features.push(prop);
}

function getSimpleCount(count) {
  let min = 1;
  while (min < count) {
    min *= 10;
  }
  return min;
}