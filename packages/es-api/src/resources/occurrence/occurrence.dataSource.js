const elasticsearch = require('elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const config = require('../../config');
const { reduce } = require('./reduce');
const { queryReducer } = require('../../responseAdapter');

const logLevel = config.OCCURRENCE_LOG_LEVEL;
const hostPattern = config.OCCURRENCE_HOST_PATTERN;
const nodes = config.OCCURRENCE_NODES;
const searchIndex = 'occurrence';

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

async function query({ query, aggs, size = 20, from = 0 }) {
  const esQuery = {
    size,
    from,
    query,
    aggs
  }
  console.log('=== query elastic search');
  let body = await search({ client, index: searchIndex, query: esQuery });
  body.hits.hits = body.hits.hits.map(n => reduce(n));
  return {
    esBody: esQuery,
    result: queryReducer({body, size, from})
  };
}

async function suggest({ field, text = '', size=8 }) {
  const esQuery = {
    'suggest': {
      'suggestions': {
        'prefix': text,
        'completion': {
          'field': field,
          'size': size,
          'skip_duplicates': true
        }
      }
    }
  }
  let body = await search({ client, index: searchIndex, query: esQuery });
  const suggestions = body.suggest.suggestions[0].options.map(n => n.text);
  return suggestions;
}

async function byKey({ key }) {
  const query = {
    'size': 1,
    'query': {
      'bool': {
        'filter': {
          'term': {
            'gbifId': key
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
  byKey,
  suggest
};