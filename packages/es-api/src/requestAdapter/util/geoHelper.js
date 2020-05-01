var wkt = require('terraformer-wkt-parser');

function wktPolygonToCoordinates(wktString) {
  var geojson = wktToGeoJson(wktString);
  if (geojson.type !== 'Polygon') {
    throw new Error('Only WKT polygons are supported');
  }
  return geojson.coordinates;
}

function wktToGeoJson(wktString) {
  var geojson = wkt.parse(wktString);
  return geojson;
}

module.exports = {
  wktToGeoJson,
  wktPolygonToCoordinates
}