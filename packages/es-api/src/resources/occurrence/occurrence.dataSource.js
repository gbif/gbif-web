const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const env = require('../../config');
const { getRecords } = require('./recordLookup');
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
  organismQuantity: 'organismQuantity',
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

  // The index only holds the IDs; the records are looked up in the v1 API below.
  esQuery._source = ['gbifId'];

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
  body.hits.hits = await getRecords(
    body.hits.hits.map((n) => n._source.gbifId),
    req,
  );

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

module.exports = {
  query,
  suggest,
};
