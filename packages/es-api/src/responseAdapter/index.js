const _ = require('lodash');
const { REVERSE_NESTED_AGG_KEY } = require('../requestAdapter/aggregations/metric2aggs');

function queryReducer({ body, size, from, metrics = {} }) {
  // process aggregations that is nested due to being child/join
  Object.keys(metrics).forEach((metricKey) => {
    let metricResult = body.aggregations[metricKey];
    if (!metricResult.buckets && metricResult[metricKey]) {
      body.aggregations[metricKey] = metricResult[metricKey];
    }
  });

  // For facets on nested objects (dot-notation keys, e.g. nucleotideSequence.targetGene)
  // the bucket doc_count counts nested documents. Replace it with the reverse_nested count
  // so the facet reports matching parent documents (occurrences), and drop the helper agg.
  Object.keys(metrics).forEach((metricKey) => {
    const metric = metrics[metricKey];
    if (metric.type !== 'facet') return;
    if (typeof metric.key !== 'string' || !metric.key.includes('.')) return;
    const agg = body.aggregations[metricKey];
    if (!agg || !Array.isArray(agg.buckets)) return;
    agg.buckets = agg.buckets.map((bucket) => {
      const reverse = bucket[REVERSE_NESTED_AGG_KEY];
      if (!reverse || typeof reverse.doc_count !== 'number') return bucket;
      const { [REVERSE_NESTED_AGG_KEY]: _ignored, ...rest } = bucket;
      return { ...rest, doc_count: reverse.doc_count };
    });
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
