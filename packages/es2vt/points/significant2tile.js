let coordinateConverter = require('../util/coordinateConverter');

module.exports = agg2tile;

function agg2tile(results, x, y, z, extent) {
    let z2 = 1 << z;

    var buckets = results.aggregations.geo.buckets;
    var features = [];
    buckets.forEach(function (e) {
        addFeature(e, x, y, z2, extent, features);
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

function addFeature(e, x, y, z, extent, features) {
    //transform to tile coordinate
    let tileCoordinates = coordinateConverter.getTileCoordinates(e.geo.location.lat, e.geo.location.lon, x, y, z, extent);
    if (!tileCoordinates) {
        // console.log('lat lon outside tile - this shouldn\'t happen'); //TODO investigate why this is in fact happening
        return;
    }
    if (e.significant.buckets.length === 0) return;
    var prop = {
        geometry: [ [ { x: tileCoordinates.x, y: tileCoordinates.y} ] ],
        properties: {
            //count: e.geo.count,
            count: e.significant.buckets.length,
            geohash: e.key,
            species: e.significant.buckets.map(x => x.key)
        },
        type: 1
    };

    features.push(prop);
}