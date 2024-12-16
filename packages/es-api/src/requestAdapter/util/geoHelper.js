const wkt = require('@terraformer/wkt');

function wktPolygonToCoordinates(wktString) {
  var geojson = wktToGeoJson(wktString);
  if (!['MultiPolygon', 'Polygon'].includes(geojson.type)) {
    throw new Error('Only WKT polygons, and multipolygons are supported');
  }
  return geojson.coordinates;
}

function wktToGeoJson(wktString) {
  try {
    var geojson = wkt.wktToGeoJSON(wktString);
    return geojson;
  } catch (err) {
    throw new Error('Invalid WKT');
  }
}

module.exports = {
  wktToGeoJson,
  wktPolygonToCoordinates,
};
