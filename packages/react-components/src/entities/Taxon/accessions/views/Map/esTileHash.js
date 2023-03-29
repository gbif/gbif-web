function tile2long(x,z) {
    return (x/Math.pow(2,z)*360-180);
}
function tile2lat(y,z) {
    var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}
export function getBboxFromFeature(str) {
    const [zStr, xStr, yStr] = str.split('/');
    const x = parseInt(xStr);
    const y = parseInt(yStr);
    const z = parseInt(zStr);
    const west  = tile2long(x, z);
    const east  = tile2long(x + 1, z);
    const north  = tile2lat(y, z);
    const south = tile2lat(y + 1, z);
    return {north, south, east, west};
}