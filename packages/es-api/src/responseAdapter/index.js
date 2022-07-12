const _ = require('lodash');

function queryReducer({body, size, from, metrics = {}}) {

  // process facets for "fake" pagination
  Object.keys(metrics).forEach(metricKey => {
    let metric = metrics[metricKey];
    if (metric.type !== 'facet') return;
    if (!metric.from || metric.from < 1) return;
    let buckets = body.aggregations[metricKey].buckets;
    if (Array.isArray(buckets)) {
      body.aggregations[metricKey].buckets = body.aggregations[metricKey].buckets.slice(metric.from);
    }
  });
  
  return {
    documents: {
      size,
      from,
      total: _.get(body, 'hits.total.value'),
      results: _.get(body, 'hits.hits', [])
    },
    aggregations: _.get(body, 'aggregations'),
  };
}

module.exports = {
  queryReducer
}