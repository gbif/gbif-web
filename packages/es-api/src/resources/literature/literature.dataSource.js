const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const env = require('../../config');
const { reduce } = require('./reduce');
const { queryReducer } = require('../../responseAdapter');

const searchIndex = 'literature';

const agent = () =>
  new Agent({
    maxSockets: 1000, // Default = Infinity
    keepAlive: true,
  });

var client = new Client({
  nodes: env.content.hosts,
  maxRetries: env.content.maxRetries || 3,
  requestTimeout: env.content.requestTimeout || 60000,
  agent,
});

const allowedSortBy = {
  literatureType: 'literatureType',
  year: 'year',
  relevance: 'relevance',
  created: 'created',
  gbifRegion: 'gbifRegion',
  peerReview: 'peerReview',
};

async function query({ query, aggs, size = 20, from = 0, metrics, sortBy, sortOrder, req }) {
  if (parseInt(from) + parseInt(size) > env.content.maxResultWindow) {
    throw new ResponseError(
      400,
      'BAD_REQUEST',
      `'from' + 'size' must be ${env.content.maxResultWindow} or less`,
    );
  }
  // if sortOrder is a string, then lowercase it
  if (typeof sortOrder === 'string') {
    sortOrder = sortOrder.toLowerCase();
  }
  // make sure sortOrder is either 'asc' or 'desc'. do not throw, just force it to 'desc' if unknown
  if (sortOrder && sortOrder !== 'asc' && sortOrder !== 'desc') {
    sortOrder = 'desc';
  }
  // we only accept sorting by DATE and a select list of other fields. Discard anything else
  if (sortBy && !allowedSortBy[sortBy]) {
    sortBy = null;
  }

  let sort = [
    '_score', // if there is any score (but will this be slow even when there is no free text query?)
    '_doc', // I'm not sure, but i hope this will ensure sorting and be the fastest way to do so https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html
  ];

  if (sortBy) {
    sort = [{ [allowedSortBy[sortBy]]: { order: sortOrder } }, { created: 'desc' }];
  } else {
    sort = ['_score', { created: { order: 'desc' } }];
  }

  const esQuery = {
    sort,
    track_total_hits: true,
    size,
    from,
    query,
    aggs,
  };
  let response = await search({ client, index: searchIndex, query: esQuery, req });
  let body = response.body;
  body.hits.hits = body.hits.hits.map((n) => reduce(n));
  return {
    esBody: esQuery,
    result: queryReducer({ body, size, from, metrics }),
  };
}

async function byKey({ key, req }) {
  const query = {
    size: 1,
    query: {
      bool: {
        filter: {
          term: {
            id: key,
          },
        },
      },
    },
  };
  let response = await search({ client, index: searchIndex, query, req });
  let body = response.body;
  const total = body.hits.total.value || body.hits.total; // really just while es versions change between 5 > 7
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
};
