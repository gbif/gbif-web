const wkt = require('@terraformer/wkt');

function wktPolygonToCoordinates(wktString) {
  var geojson = wktToGeoJson(wktString);
  if (geojson.type !== 'Polygon') {
    throw new Error('Only WKT polygons are supported');
  }
  return geojson.coordinates;
}

function wktToGeoJson(wktString) {
  var geojson = wkt.wktToGeoJSON(wktString);
  return geojson;
}

module.exports = {
  wktToGeoJson,
  wktPolygonToCoordinates
}