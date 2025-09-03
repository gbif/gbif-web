const env = require('../../config');
const { config } = require('./literature.config');
const { predicate2esQuery, get2predicate, get2esQuery } = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');

function suggestConfig() {
  return suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'literature',
    type: 'literature',
  });
}

module.exports = {
  dataSource: require('./literature.dataSource'),
  get2predicate: (query) => get2predicate(query, config),
  get2query: (predicate) => get2esQuery(predicate, config),
  predicate2query: (predicate, q) => predicate2esQuery(predicate, config, q),
  get2metric: (query) => get2metric(query, config),
  metric2aggs: (metrics) => metric2aggs(metrics, config),
  suggestConfig,
};

// suggestConfig().catch(err => console.log(err));
