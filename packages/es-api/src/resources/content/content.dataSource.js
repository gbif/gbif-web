const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const env = require('../../config');
const { reduce } = require('./reduce');
const { queryReducer } = require('../../responseAdapter');

const searchIndex = 'content';

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

async function query({
  query,
  aggs,
  size = 20,
  from = 0,
  sortBy,
  sortOrder = 'desc',
  metrics,
  eventFiltering,
  req,
}) {
  if (parseInt(from) + parseInt(size) > env.content.maxResultWindow) {
    throw new ResponseError(
      400,
      'BAD_REQUEST',
      `'from' + 'size' must be ${env.content.maxResultWindow} or less`,
    );
  }

  const sortableFields = {
    createdAt: 'date',
    start: 'date',
    end: 'date',
  };

  const sort = [];

  if (sortBy && sortableFields[sortBy]) {
    // Sort by the specified field
    sort.push({
      [sortBy]: {
        order: sortOrder,
        missing: '_last',
        unmapped_type: sortableFields[sortBy],
      },
    });
    // Add secondary sort by created for consistency
    sort.push({
      createdAt: {
        order: 'desc',
        missing: '_last',
        unmapped_type: 'date',
      },
    });
  } else {
    // Default sorting when no sortBy or invalid sortBy
    sort.push('_score', {
      createdAt: {
        order: sortOrder,
        missing: '_last',
        unmapped_type: 'date',
      },
    });
  }

  // Apply event filtering if specified
  let finalQuery = query;
  if (eventFiltering === 'upcoming') {
    finalQuery = applyEventDateFilter(query);
  } else if (eventFiltering === 'past') {
    finalQuery = applyPastEventDateFilter(query);
  }

  const esQuery = {
    sort,
    track_total_hits: true,
    size,
    from,
    aggs,
    query: finalQuery,
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

function applyEventDateFilter(query) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const nowISO = now.toISOString();

  // Create a filter that shows events that are not past
  // For all-day events: show if date >= start of today
  // For timed events: show if end/start >= now
  const eventDateFilter = {
    bool: {
      should: [
        // All-day events: show if date >= start of today
        {
          bool: {
            must: [
              { term: { allDayEvent: true } },
              {
                bool: {
                  should: [
                    { range: { end: { gte: startOfToday } } },
                    {
                      bool: {
                        must: [
                          { bool: { must_not: { exists: { field: 'end' } } } },
                          { range: { start: { gte: startOfToday } } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Timed events: show if end/start >= now
        {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    { term: { allDayEvent: false } },
                    { bool: { must_not: { exists: { field: 'allDayEvent' } } } },
                  ],
                },
              },
              {
                bool: {
                  should: [
                    { range: { end: { gte: nowISO } } },
                    {
                      bool: {
                        must: [
                          { bool: { must_not: { exists: { field: 'end' } } } },
                          { range: { start: { gte: nowISO } } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  // If the original query is a bool query, add our filter to it
  if (query.bool) {
    return {
      bool: {
        ...query.bool,
        must: [
          ...(query.bool.must || []),
          {
            bool: {
              should: [
                // Non-event content types (no filtering)
                { bool: { must_not: { term: { contentType: 'event' } } } },
                // Event content types (with date filtering)
                {
                  bool: {
                    must: [{ term: { contentType: 'event' } }, eventDateFilter],
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }

  // If the original query is not a bool query, wrap it
  return {
    bool: {
      must: [
        query,
        {
          bool: {
            should: [
              // Non-event content types (no filtering)
              { bool: { must_not: { term: { contentType: 'event' } } } },
              // Event content types (with date filtering)
              {
                bool: {
                  must: [{ term: { contentType: 'event' } }, eventDateFilter],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function applyPastEventDateFilter(query) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const nowISO = now.toISOString();

  // Create a filter that shows events that are past
  // For all-day events: show if date < start of today
  // For timed events: show if end/start < now
  const eventDateFilter = {
    bool: {
      should: [
        // All-day events: show if date < start of today
        {
          bool: {
            must: [
              { term: { allDayEvent: true } },
              {
                bool: {
                  should: [
                    { range: { end: { lt: startOfToday } } },
                    {
                      bool: {
                        must: [
                          { bool: { must_not: { exists: { field: 'end' } } } },
                          { range: { start: { lt: startOfToday } } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Timed events: show if end/start < now
        {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    { term: { allDayEvent: false } },
                    { bool: { must_not: { exists: { field: 'allDayEvent' } } } },
                  ],
                },
              },
              {
                bool: {
                  should: [
                    { range: { end: { lt: nowISO } } },
                    {
                      bool: {
                        must: [
                          { bool: { must_not: { exists: { field: 'end' } } } },
                          { range: { start: { lt: nowISO } } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  // If the original query is a bool query, add our filter to it
  if (query.bool) {
    return {
      bool: {
        ...query.bool,
        must: [
          ...(query.bool.must || []),
          {
            bool: {
              should: [
                // Non-event content types (no filtering)
                { bool: { must_not: { term: { contentType: 'event' } } } },
                // Event content types (with date filtering)
                {
                  bool: {
                    must: [{ term: { contentType: 'event' } }, eventDateFilter],
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }

  // If the original query is not a bool query, wrap it
  return {
    bool: {
      must: [
        query,
        {
          bool: {
            should: [
              // Non-event content types (no filtering)
              { bool: { must_not: { term: { contentType: 'event' } } } },
              // Event content types (with date filtering)
              {
                bool: {
                  must: [{ term: { contentType: 'event' } }, eventDateFilter],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
