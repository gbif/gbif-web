const Geohash = require('latlon-geohash');

function addPadding({ bb, precision }) {
  //get geohash of upper left corner
  const nwGeoHash = Geohash.encode(bb.north, bb.west, precision);
  const seGeoHash = Geohash.encode(bb.south, bb.east, precision);

  const { nw } = Geohash.neighbours(nwGeoHash);
  const { se } = Geohash.neighbours(seGeoHash);

  const topLeftBb = Geohash.bounds(nw);
  const bottomRightBb = Geohash.bounds(se);
  
  const paddedBoundingBox = {
    north: Math.max(bb.north, topLeftBb.ne.lat),
    south: Math.min(bb.south, bottomRightBb.sw.lat),
    west: Math.min(bb.west, topLeftBb.sw.lon),
    east: Math.max(bb.east, bottomRightBb.ne.lon)
  }

  return paddedBoundingBox;
}

module.exports = addPadding;