const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const env = require('../../config');
const { reduce } = require('./reduce');
const { queryReducer } = require('../../responseAdapter');

const searchIndex = env.occurrence.index || 'occurrence';

const agent = () =>
  new Agent({
    maxSockets: 1000, // Default = Infinity
    keepAlive: true,
  });

const client = new Client({
  nodes: env.occurrence.hosts,
  maxRetries: env.occurrence.maxRetries || 3,
  requestTimeout: env.occurrence.requestTimeout || 60000,
  agent,
});

const allowedSortBy = {
  basisOfRecord: 'basisOfRecord',
  catalogNumber: 'catalogNumber',
  collectionCode: 'collectionCode',
  collectionKey: 'collectionKey',
  continent: 'continent',
  coordinatePrecision: 'coordinatePrecision',
  coordinateUncertaintyInMeters: 'coordinateUncertaintyInMeters',
  countryCode: 'countryCode',
  datasetID: 'datasetID',
  publishingCountry: 'publishingCountry',
  datasetKey: 'datasetTitle',
  degreeOfEstablishment: 'degreeOfEstablishment.concept',
  depth: 'depth',
  distanceFromCentroidInMeters: 'distanceFromCentroidInMeters',
  elevation: 'elevation',
  establishmentMeans: 'establishmentMeans.concept',
  eventDate: 'eventDateSingle',
  eventId: 'eventId',
  fieldNumber: 'fieldNumber',
  taxonKey: 'classifications.{CHECKLIST_KEY}.usage.name',
  gbifId: 'gbifId',
  gbifRegion: 'gbifRegion',
  bed: 'geologicalContext.bed',
  biostratigraphy: 'geologicalContext.biostratigraphy.keyword',
  identifiedBy: 'identifiedByJoined',
  individualCount: 'individualCount',
  institutionCode: 'institutionCode',
  institutionKey: 'institutionKey',
  isClustered: 'isClustered',
  isSequenced: 'isSequenced',
  island: 'island',
  license: 'license',
  lifeStage: 'lifeStage.concept',
  locality: 'locality',
  month: 'month',
  occurrenceId: 'occurrenceId',
  occurrenceStatus: 'occurrenceStatus',
  organismId: 'organismId',
  preparations: 'preparationsJoined',
  recordNumber: 'recordNumber',
  recordedBy: 'recordedByJoined',
  sex: 'sex.concept',
  waterBody: 'waterBody',
  stateProvince: 'stateProvince',
  year: 'year',
  iucnRedListCategoryCode: 'classifications.{CHECKLIST_KEY}.iucnRedListCategoryCode',
};

async function query({
  query,
  aggs,
  size = 20,
  from = 0,
  metrics,
  sortBy,
  sortOrder,
  checklistKey = env.defaultChecklist,
  shuffle,
  fields,
  req,
}) {
  if (parseInt(from) + parseInt(size) > env.occurrence.maxResultWindow) {
    throw new ResponseError(
      400,
      'BAD_REQUEST',
      `'from' + 'size' must be ${env.occurrence.maxResultWindow} or less`,
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
    const sortByField = allowedSortBy[sortBy].replace('{CHECKLIST_KEY}', checklistKey);
    sort = [{ [sortByField]: { order: sortOrder } }, { gbifId: 'asc' }];
  } else {
    sort = [
      '_score', // if there is any score (but will this be slow even when there is no free text query?)
      { yearMonthGbifIdSort: { order: 'asc' } },
    ];
  }

  // metrics only included to allow "fake" pagination on facets
  const esQuery = {
    sort: sort,
    track_total_hits: true,
    size,
    from,
    query,
    aggs,
  };

  if (shuffle) {
    delete esQuery.sort;
    if (!esQuery?.query?.bool?.must) {
      esQuery.query = {
        bool: {
          must: [],
        },
      };
    }
    esQuery.query.bool.must.push({
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
    });
  }

  let response = await search({ client, index: searchIndex, query: esQuery, req });
  let body = response.body;
  body.hits.hits = body.hits.hits.map((n) => reduce(n, fields));

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

async function byKey({ key, req }) {
  const query = {
    size: 1,
    query: {
      bool: {
        filter: {
          term: {
            gbifId: key,
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
  suggest,
};
