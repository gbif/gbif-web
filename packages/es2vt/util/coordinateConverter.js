// based on https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

function lat2tilePos(lat, zoomSquared) {
  return (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * zoomSquared;
}

function long2tilePos(lon, zoomSquared) {
  return (lon + 180) / 360 * zoomSquared;
}

function getTileCoordinates(lat, lon, x, y, zoomSquared, extend) {
  let ty = lat2tilePos(lat, zoomSquared),
      tx = long2tilePos(lon, zoomSquared);
  if (Math.floor(tx) != x || Math.floor(ty) != y) return;
  return {
    x: extend * (tx % 1),
    y: extend * (ty % 1)
  };
}

// function long2tile(lon, zoom) {
//   return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
// }

// function lat2tile(lat, zoom) {
//   return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
// }

function tile2long(x, zoomSquared) {
  return (x / zoomSquared * 360 - 180);
}

function tile2lat(y, zoomSquared) {
  var n = Math.PI - 2 * Math.PI * y / zoomSquared;
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

function tile2boundingBox(x, y, zoom) {
  const zoomSquared = 1 << zoom;
  const bb = {};
  bb.north = tile2lat(y, zoomSquared);
  bb.south = tile2lat(y + 1, zoomSquared);
  bb.west = tile2long(x, zoomSquared);
  bb.east = tile2long(x + 1, zoomSquared);
  return bb;
}

module.exports = {
  getTileCoordinates: getTileCoordinates,
  tile2boundingBox: tile2boundingBox
};
