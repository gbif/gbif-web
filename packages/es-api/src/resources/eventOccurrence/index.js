const env = require('../../config');
const { config } = require('./eventOccurrence.config');
const { predicate2esQuery, get2predicate, get2esQuery } = require('../../requestAdapter/query');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');
const { getSuggestQuery } = require('../../requestAdapter/suggest');
const dataSource = require('./eventOccurrence.dataSource');

module.exports = {
  dataSource: dataSource,
  get2predicate: (query) => get2predicate(query, config),
  get2query: (predicate) => get2esQuery(predicate, config),
  predicate2query: (predicate) => predicate2esQuery(predicate, config),
  get2metric: (query) => get2metric(query, config),
  metric2aggs: (metrics) => metric2aggs(metrics, config),
  getSuggestQuery: ({ key, text, next }) => getSuggestQuery(key, text, config, { next }),
};
