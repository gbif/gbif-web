const env = require('../../config');
const { config } = require('./event.config');
const {
  get2predicate,
  get2esQuery: get2esQueryStd,
  predicate2esQuery: predicate2esQueryStd,
} = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { suggestGqlTypeFromAlias } = require('../../requestAdapter/util/suggestGraphqlType');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');
const { getSuggestQuery } = require('../../requestAdapter/suggest');
const dataSource = require('./event.dataSource');
const normalizePredicate = require('../../requestAdapter/util/normalizePredicate');

function suggestConfig() {
  return suggestConfigFromAlias({
    endpoint: env.event.hosts[0],
    alias: 'event',
    type: 'properties',
  });

  // return suggestGqlTypeFromAlias({
  //   endpoint: env.event.hosts[0],
  //   alias: 'event',
  //   type: 'record'
  // });
}

module.exports = {
  dataSource: dataSource,
  get2predicate: (query) => get2predicate(query, config),

  get2query: (predicate) => get2esQuery(predicate, config),
  predicate2query: (predicate, q) => predicate2esQuery(predicate, q),
  // get2query: (predicate) => get2esQueryStd(predicate, config),
  // predicate2query: (predicate) => predicate2esQueryStd(predicate, config),

  get2metric: (query) => get2metric(query, config),
  metric2aggs: (metrics) => metric2aggs(metrics, config),
  getSuggestQuery: ({ key, text }) => getSuggestQuery(key, text, config),
  // suggestConfig,
  scientificNameSuggest: dataSource.scientificNameSuggest,
};

// suggestConfig().catch(err => console.log(err));

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
  return fetch(`${env.apiv1}/event/search/predicate/toesquery`, {
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
