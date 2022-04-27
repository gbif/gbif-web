const env = require('../../config');
const { config } = require('./event.config');
const { predicate2esQuery, get2predicate, get2esQuery } = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { suggestGqlTypeFromAlias } = require('../../requestAdapter/util/suggestGraphqlType');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');
const { getSuggestQuery } = require('../../requestAdapter/suggest');

function suggestConfig() {
  return suggestConfigFromAlias({ 
    endpoint: env.event.hosts[0], 
    alias: 'parent', 
    type: 'properties'
  });

  // return suggestGqlTypeFromAlias({ 
  //   endpoint: env.event.hosts[0], 
  //   alias: 'event', 
  //   type: 'record'
  // });
}

module.exports = {
  dataSource: require('./event.dataSource'),
  get2predicate: query => get2predicate(query, config),
  get2query: predicate => get2esQuery(predicate, config),
  predicate2query: predicate => predicate2esQuery(predicate, config),
  get2metric: query => get2metric(query, config),
  metric2aggs: metrics => metric2aggs(metrics, config),
  getSuggestQuery: ({key, text}) => getSuggestQuery(key, text, config),
  suggestConfig
}

// suggestConfig().catch(err => console.log(err));