const env = require('../../config');
const { config } = require('./occurrence.config');
const { get2predicate } = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { suggestGqlTypeFromAlias } = require('../../requestAdapter/util/suggestGraphqlType');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');
const { getSuggestQuery } = require('../../requestAdapter/suggest');
const normalizePredicate = require('../../requestAdapter/util/normalizePredicate');
const dataSource = require('./occurrence.dataSource');
const logger = require('../../logger');

function suggestConfig() {
  return suggestConfigFromAlias({
    endpoint: env.occurrence.hosts[0],
    alias: 'occurrence',
    type: 'properties',
  });

  // return suggestGqlTypeFromAlias({
  //   endpoint: env.occurrence.hosts[0],
  //   alias: 'occurrence',
  //   type: 'record'
  // });
}

module.exports = {
  dataSource: dataSource,
  get2predicate: (query) => get2predicate(query, config),
  get2query: (predicate) => get2esQuery(predicate, config),
  predicate2query: (predicate, q) => predicate2esQuery(predicate, q),
  get2metric: (query) => get2metric(query, config),
  metric2aggs: (metrics) => metric2aggs(metrics, config),
  getSuggestQuery: ({ key, text }) => getSuggestQuery(key, text, config),
  suggestConfig,
  suggestDatasetKey: async (req, res) => {
    const result = await occurrenceSuggest({
      q: req.body.q,
      limit: req.body.limit,
      predicate: req.body.predicate,
      field: 'datasetKey',
      regexField: 'datasetTitle',
      req,
    });
    return res.json(result);
  },
  suggestPublisherKey: async (req, res) => {
    const result = await occurrenceSuggest({
      q: req.body.q,
      limit: req.body.limit,
      predicate: req.body.predicate,
      field: 'publishingOrganizationKey',
      regexField: 'publisherTitle',
      req,
    });
    return res.json(result);
  },
};

async function occurrenceSuggest({ q, limit, predicate, field, regexField, req }) {
  const esQuery = await extendPredicate(predicate, {
    wildcard: {
      [regexField]: `*${(q ?? '').replace(/\s/, '*')}*`,
    },
  });
  const esBody = getSuggestionsQuery({
    query: esQuery,
    field: field,
    limit: limit || 10,
  });
  const result = await dataSource.query({ query: esBody.query, aggs: esBody.aggs, size: 0, req });
  return (
    result?.result?.aggregations?.suggestions?.buckets.map((bucket) => ({
      key: bucket.key,
      count: bucket.doc_count,
    })) || []
  );
}

function get2esQuery(getQuery, config) {
  const predicate = get2predicate(getQuery, config);
  const esQuery = predicate2esQuery(predicate, config);
  return esQuery;
}

function predicate2esQuery(predicate, q) {
  // first we normalize the predicate
  const { predicate: normalizedPredicate, err } = normalizePredicate(predicate);
  if (err) {
    console.error('Error normalizing predicate:', err);
    return;
  }
  if (!normalizedPredicate && !q) {
    return;
  }

  // then we convert it to an es query using the API
  return fetch(`${env.apiv1}/occurrence/search/predicate/toesquery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q,
      predicate: normalizedPredicate,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

async function extendPredicate(predicate, customEsFilter) {
  const esQuery = await predicate2esQuery(predicate);
  const extendedQuery = {
    bool: {
      filter: [customEsFilter],
    },
  };
  if (esQuery) {
    extendedQuery.bool.filter.push(esQuery);
  }
  return extendedQuery;
}

function getSuggestionsQuery({ query, field, limit = 10 }) {
  const aggs = {
    suggestions: {
      terms: {
        field,
        size: limit,
        shard_size: 50020,
      },
    },
  };
  return {
    size: 0,
    query,
    aggs,
  };
}
