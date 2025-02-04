const _ = require('lodash');

function queryReducer({ body, size, from, metrics = {} }) {
  // process aggregations that is nested due to being child/join
  Object.keys(metrics).forEach((metricKey) => {
    let metricResult = body.aggregations[metricKey];
    if (!metricResult.buckets && metricResult[metricKey]) {
      body.aggregations[metricKey] = metricResult[metricKey];
    }
  });

  // process facets for "fake" pagination
  Object.keys(metrics).forEach((metricKey) => {
    let metric = metrics[metricKey];
    if (metric.type !== 'facet' && metric.type !== 'multifacet') return;
    if (!metric.from || metric.from < 1) return;
    let buckets = body.aggregations[metricKey].buckets;
    if (Array.isArray(buckets)) {
      body.aggregations[metricKey].buckets = body.aggregations[metricKey].buckets.slice(
        metric.from,
      );
    }
  });

  return {
    documents: {
      size,
      from,
      total: _.get(body, 'hits.total.value'),
      results: _.get(body, 'hits.hits', []),
    },
    aggregations: _.get(body, 'aggregations'),
  };
}

module.exports = {
  queryReducer,
};
