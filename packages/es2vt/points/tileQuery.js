const tileGenerator = require('./esAgg2tile');
const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const composeTileQuery = require('../util/composeTileQuery');
const tile2pbf = require('./tile2pbf');
const hash = require('object-hash');
const { search } = require('../util/esRequest');
const env = require('../config');
const LRU = require('lru-cache');

const searchIndex = env.occurrence.index;
const field = env.occurrence.coordinateField;

const agent = () => new Agent({
  maxSockets: 1000, // Default = Infinity
  keepAlive: true
});

const client = new Client({
  nodes: env.occurrence.hosts,
  maxRetries: env.occurrence.maxRetries || 3,
  requestTimeout: env.occurrence.requestTimeout || 60000,
  agent
});

const cache = new LRU({ max: 10000, maxAge: 1000 * 60 * 10 });

//9 ≈ 2.4 meters
let resolutions = {
  low: [2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10],
  medium: [2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10],
  high: [2, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10]
}

async function getTile(x, y, z, q, resolution, req) {
  let userQuery = q;
  resolution = typeof resolution !== 'undefined' ? resolution : 'medium';
  let precisionLookUp = resolutions[resolution] || resolutions.medium;
  let precision = precisionLookUp[z] || 11;
  // merge tile query and user query
  // regarding precision in it can be 1 cm off in what it includes in the bounding box. ES https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html#_notes_on_precision
  let tileQuery = composeTileQuery(x, y, z, precision, userQuery, field);
  let esQuery = {
    size: 0,
    query: tileQuery,
    aggs: {
      geo: {
        geohash_grid: {
          field: field,
          precision: precision,
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

  let queryKey = hash({ esQuery });
  let data = cache.get(queryKey);
  
  if (!data) {
    data = await getFromES({ esQuery, req });
    cache.set(queryKey, data);
  }

  let tile = tileGenerator(data, x, y, z, 4096);
  let buff = tile2pbf(tile);

  return buff;
}

async function getFromES({ esQuery, req }) {
  let response = await search({ client, index: searchIndex, query: esQuery, req });
  let body = response.body;
  return body;
}

module.exports = {
  getTile: getTile
};