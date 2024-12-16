const env = require('../../config');
const { config } = require('./dataset.config');
const { predicate2esQuery, get2predicate, get2esQuery } = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');

function suggestConfig() {
  return suggestConfigFromAlias({
    endpoint: env.dataset.hosts[0],
    alias: 'dataset',
    type: 'dataset',
  });
}

module.exports = {
  dataSource: require('./dataset.dataSource'),
  get2predicate: (query) => get2predicate(query, config),
  get2query: (predicate) => get2esQuery(predicate, config),
  predicate2query: (predicate) => predicate2esQuery(predicate, config),
  get2metric: (query) => get2metric(query, config),
  metric2aggs: (metrics) => metric2aggs(metrics, config),
  suggestConfig,
};

// suggestConfig().catch(err => console.log(err));
