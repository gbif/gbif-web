function lat2tilePos(lat, zoom2) {
    return (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * zoom2;
}
function long2tilePos(lon, zoom2) {
    return (lon + 180) / 360 * zoom2;
}

function getTileCoordinates(lat, lon, x, y, zoom2, extend) {
    let ty = lat2tilePos(lat, zoom2),
        tx = long2tilePos(lon, zoom2);
    if (Math.floor(tx) != x || Math.floor(ty) != y) return;
    return {
        x: extend * (tx % 1),
        y: extend * (ty % 1)
    };
}
function long2tile(lon, zoom) {
    return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}
function lat2tile(lat, zoom) {
    return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}
function tile2long(x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
}
function tile2lat(y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}
function tile2boundingBox(x, y, zoom) {
    var bb = {};
    bb.north = tile2lat(y, zoom);
    bb.south = tile2lat(y + 1, zoom);
    bb.west = tile2long(x, zoom);
    bb.east = tile2long(x + 1, zoom);
    return bb;
}

module.exports = {
    getTileCoordinates: getTileCoordinates,
    tile2boundingBox: tile2boundingBox
};