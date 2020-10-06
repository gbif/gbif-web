let tileGenerator = require('./esAgg2tile'),
    //coordinateConverter = require('../util/coordinateConverter'),
    composeTileQuery = require('../util/composeTileQuery'),
    tile2pbf = require('./tile2pbf'),
    defaultUrl = 'http://c6n1.gbif.org:9200/occurrence/_search',
    hash = require('object-hash'),
    _ = require('lodash'),
    LRU = require('lru-cache'),
    axios = require('axios');

const cache = new LRU({ max: 10000, maxAge: 1000*60*10 });

//9 ≈ 2.4 meters
let resolutions = {
    low:    [2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10],
    medium: [2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10],
    high:   [2, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10]
}

async function getTile(x, y, z, q, countBy, url, resolution, field) {
    let userQuery = q;
    url = url || defaultUrl;
    field = field || 'coordinates';
    resolution = typeof resolution !== 'undefined' ? resolution : 'medium';
    let precisionLookUp = resolutions[resolution] || resolutions.medium;

    let tileQuery = composeTileQuery(x, y, z, userQuery, field);// merge tile query and user query
    let esQuery = {
        size: 0,
        query: tileQuery,
        aggs: {
            geo: {
                geohash_grid: { 
                    field: field, 
                    precision: precisionLookUp[z] || 11, 
                    size: 40000 
                },
                aggs: {
                    geo: {
                        geo_centroid: { field: field }
                    }
                }
            }
        }
    };

    let queryKey = hash({esQuery, url, countBy});
    let data = cache.get(queryKey);
    if (!data) {
        data = await getFromES(esQuery, url);
        cache.set(queryKey, data);
    }
    
    let tile = tileGenerator(data, x, y, z, 4096);
    let buff = tile2pbf(tile);

    return buff;
}

async function getFromES(query, endpoint) {
    // console.log(JSON.stringify(query, null, 2));
    let response = await axios.post(endpoint, query);
    return response.data;
}

module.exports = {
    getTile: getTile
};