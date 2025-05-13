const env = require('../../config');
const { config } = require('./occurrence.config');
const { get2predicate } = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { suggestGqlTypeFromAlias } = require('../../requestAdapter/util/suggestGraphqlType');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');
const { getSuggestQuery } = require('../../requestAdapter/suggest');
const normalizePredicate = require('../../requestAdapter/util/normalizePredicate');

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
  dataSource: require('./occurrence.dataSource'),
  get2predicate: (query) => get2predicate(query, config),
  get2query: (predicate) => get2esQuery(predicate, config),
  predicate2query: (predicate, q) => predicate2esQuery(predicate, q),
  get2metric: (query) => get2metric(query, config),
  metric2aggs: (metrics) => metric2aggs(metrics, config),
  getSuggestQuery: ({ key, text }) => getSuggestQuery(key, text, config),
  suggestConfig,
};

function get2esQuery(getQuery, config) {
  const predicate = get2predicate(getQuery, config);
  const esQuery = predicate2esQuery(predicate, config);
  return esQuery;
}

function predicate2esQuery(predicate, q) {
  // first we normalize the predicate
  console.log(predicate);
  const { predicate: normalizedPredicate, err } = normalizePredicate(predicate);
  if (err) {
    console.error('Error normalizing predicate:', err);
    return;
  }
  if (!normalizedPredicate && !q) {
    return;
  }

  console.log(
    JSON.stringify({
      q,
      predicate: normalizedPredicate,
    }),
  );

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
        console.log(response);
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

// suggestConfig().catch(err => console.log(err));

/*
Example for how to convert a predicate to an es query
curl -X POST --header "Content-Type:application/json" -i http://api.gbif-uat.org/v1/occurrence/search/predicate/toesquery -d '
{
 "q":"my free text query here",
 "predicate": {
    "type":"isNotNull",
    "key":"IUCN_RED_LIST_CATEGORY",
  }
}'
*/
