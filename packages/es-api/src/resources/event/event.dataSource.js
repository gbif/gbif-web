const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const env = require('../../config');
const { reduce } = require('./reduce');
const { queryReducer } = require('../../responseAdapter');

const searchIndex = env.event.index || 'event';

// this isn't an ideal solution, but we keep changing between using an http and https agent. vonfig should require code change as well
const isHttpsEndpoint = env.event.hosts[0].startsWith('https');
const AgentType = isHttpsEndpoint ? Agent.HttpsAgent : Agent;

const agent = () =>
  new AgentType({
    maxSockets: 1000, // Default = Infinity
    keepAlive: true,
  });

const client = new Client({
  nodes: env.event.hosts,
  maxRetries: env.event.maxRetries || 3,
  requestTimeout: env.event.requestTimeout || 60000,
  agent,
  auth: {
    username: env.event.username,
    password: env.event.password,
  },
});

async function query({ query, aggs, size = 20, from = 0, metrics, shuffle, req }) {
  if (parseInt(from) + parseInt(size) > env.event.maxResultWindow) {
    throw new ResponseError(
      400,
      'BAD_REQUEST',
      `'from' + 'size' must be ${env.event.maxResultWindow} or less`,
    );
  }
  let filter = [
    {
      term: {
        type: 'event',
      },
    },
  ];
  if (query) filter.push(query);
  const esQuery = {
    sort: [
      '_score', // if there is any score (but will this be slow even when there is no free text query?)
      '_doc', // I'm not sure, but i hope this will ensure sorting and be the fastest way to do so https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html
      // We probably need some sorting to ensure that pagination works predictably.
    ],
    track_total_hits: true,
    size,
    from,
    query: {
      bool: {
        filter,
      },
    },
    aggs,
  };

  if (shuffle) {
    delete esQuery.sort;
    esQuery.query.bool.must = [
      {
        function_score: {
          functions: [
            {
              random_score: {
                seed: shuffle,
              },
            },
          ],
          boost_mode: 'replace',
        },
      },
    ];
  }

  // console.log(JSON.stringify(esQuery, null, 2));
  let response = await search({ client, index: searchIndex, query: esQuery, req });
  let body = response.body;
  body.hits.hits = body.hits.hits.map((n) => reduce(n));
  return {
    esBody: esQuery,
    result: queryReducer({ body, size, from, metrics }),
  };
}

async function suggest({ field, text = '', size = 8, req }) {
  const esQuery = {
    suggest: {
      suggestions: {
        prefix: text,
        completion: {
          field: field,
          size: size,
          skip_duplicates: true,
        },
      },
    },
  };
  let response = await search({ client, index: searchIndex, query: esQuery, req });
  let body = response.body;
  const suggestions = body.suggest.suggestions[0].options.map((n) => n.text);
  return suggestions;
}

async function byKey({ qualifier: datasetKey, key, req }) {
  const query = {
    size: 1,
    query: {
      bool: {
        filter: [
          {
            term: {
              type: 'event',
            },
          },
          {
            bool: {
              filter: [
                {
                  term: {
                    'metadata.datasetKey': datasetKey,
                  },
                },
                {
                  term: {
                    'event.eventID.keyword': key,
                  },
                },
              ],
            },
          },
        ],
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

async function scientificNameSuggest({ q, req } = {}) {
  const query = {
    size: 0,
    from: 0,
    query: {
      nested: {
        path: 'occurrence.taxonomy',
        query: {
          bool: {
            filter: [
              {
                wildcard: {
                  'occurrence.taxonomy.name': {
                    value: `${q?.toLowerCase()}*`,
                  },
                },
              },
            ],
          },
        },
      },
    },
    aggs: {
      taxonomy: {
        nested: {
          path: 'occurrence.taxonomy',
        },
        aggs: {
          suggestions: {
            terms: {
              field: 'occurrence.taxonomy.name',
              include: `${q?.toLowerCase()}.*`,
            },
            aggs: {
              exampleDocument: {
                top_hits: {
                  size: 1,
                },
              },
            },
          },
        },
      },
    },
  };

  let response = await search({ client, index: searchIndex, query, req });
  let body = response.body;

  const buckets = body.aggregations.taxonomy.suggestions.buckets;
  const results = buckets.map((x) => {
    const example = x.exampleDocument.hits.hits[0]._source;
    return {
      scientificName: example.name,
      key: example.taxonKey,
    };
  });
  return results;
}

module.exports = {
  query,
  byKey,
  suggest,
  scientificNameSuggest,
};
