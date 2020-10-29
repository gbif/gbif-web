// const elasticsearch = require('elasticsearch');
const { Client } = require('@elastic/elasticsearch')
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const config = require('../../config');
const { reduce } = require('./reduce');
const { queryReducer } = require('../../responseAdapter');

const hostPattern = config.OCCURRENCE_HOST_PATTERN;
const nodes = config.OCCURRENCE_NODES;
const searchIndex = 'occurrence';

const agent = () => new Agent({
  maxSockets: 1000, // Default = Infinity
  keepAlive: true
});

const hosts = new Array(nodes).fill().map((x, i) => hostPattern.replace('{n}', i + 1))
const client = new Client({
  nodes: hosts,
  maxRetries: 3,
  requestTimeout: 60000,
  agent
});

async function query({ query, aggs, size = 20, from = 0, req }) {
  if (parseInt(from) + parseInt(size) > 10000) {
    throw new ResponseError(400, 'BAD_REQUEST', '"from" + "size" must be 10,000 or less');
  }
  const esQuery = {
    sort: [
      { year: { "order": "desc" } },
      { month: { "order": "desc" } },
      { day: { "order": "desc" } },
      { "gbifId": "asc" }
    ],
    track_total_hits: true,
    size,
    from,
    query,
    aggs
  }

  let response = await search({ client, index: searchIndex, query: esQuery, req });
  let body = response.body;
  body.hits.hits = body.hits.hits.map(n => reduce(n));
  return {
    esBody: esQuery,
    result: queryReducer({ body, size, from })
  };
}

async function suggest({ field, text = '', size = 8 }) {
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
  let response = await search({ client, index: searchIndex, query: esQuery });
  let body = response.body;
  const suggestions = body.suggest.suggestions[0].options.map(n => n.text);
  return suggestions;
}

async function byKey({ key, req }) {
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
  let response = await search({ client, index: searchIndex, query, req });
  let body = response.body;
  const total = body.hits.total.value || body.hits.total;
  if (total === 1) {
    return reduce(body.hits.hits[0]);
  } else if (total > 1) {
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