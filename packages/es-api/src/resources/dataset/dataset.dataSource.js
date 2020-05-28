const elasticsearch = require('elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const config = require('../../config');
const { queryReducer } = require('../../responseAdapter');

const logLevel = config.DATASET_LOG_LEVEL;
const hostPattern = config.DATASET_HOST_PATTERN;
const nodes = config.DATASET_NODES;
const searchIndex = 'dataset';

const agent = () => new Agent({
  maxSockets: 1000, // Default = Infinity
  keepAlive: true
});

const hosts = new Array(nodes).fill().map((x, i) => hostPattern.replace('{n}', i + 1))
const client = new elasticsearch.Client({
  hosts: hosts,
  requestTimeout: 1200000,
  log: logLevel,
  apiVersion: '5.6',
  agent
});

function reduce(item) {
  return item._source;
}

async function query({ query, aggs, size=20, from=0 }) {
  const esQuery = {
    size,
    from,
    query,
    aggs
  }
  let body = await search({ client, index: searchIndex, query: esQuery });
  body.hits.hits = body.hits.hits.map(n => reduce(n));
  return {
    esBody: esQuery,
    result: queryReducer({body, size, from})
  };
}

async function byKey({ key }) {
  const query = {
    "size": 1,
    "query": {
      "bool": {
        "filter": {
          "term": {
            "gbifId": key
          }
        }
      }
    }
  };
  let body = await search({ client, index: searchIndex, query });
  if (body.hits.total === 1) {
    return reduce(body.hits.hits[0]);
  } else if (body.hits.total > 1) {
    // TODO log that an error has happened. there should not be 2 entries for ID
    throw new ResponseError(503, 'serverError', 'The ID is not unique, more than one entry found.');
  } else {
    throw new ResponseError(404, 'notFound', 'Not found');
  }
}

module.exports = {
  query,
  byKey
};