const _ = require('lodash');
const allowedTypes = ['facet', 'stats', 'cardinality', 'multifacet', 'histogram'];

function get2metric(query, config) {
  const { facetLimit = 10, facetOffset = 0, histogramInterval = 10 } = query;
  // query example: {facet: [year, datasetKey], stats: year, facet.size.year:3}
  const parsedQuery = Object.keys(query).reduce((acc, cur) => {
    // only consider keys starting with the allowed types (facet, stats, etc.)
    const firstPart = cur.split('.')[0];
    if (!allowedTypes.includes(firstPart)) return acc;

    if (cur.includes('.')) return _.set(acc, cur, query[cur]);

    // else assign value to a 'value' field
    return _.set(acc, `${cur}.value`, query[cur]);
  }, {});

  const metrics = {};
  for (const [type, conf] of Object.entries(parsedQuery)) {
    const keys = Array.isArray(conf.value) ? conf.value : conf.value.split(',');
    const size = parseInt(_.get(conf, `size.${keys[0]}`, facetLimit), 10);
    const from = parseInt(_.get(conf, `from.${keys[0]}`, facetOffset), 10);
    const interval = parseInt(_.get(conf, `interval.${keys[0]}`, histogramInterval), 10);
    const include = _.get(conf, `include.${keys[0]}`);
    keys
      .filter((key) => config.options[key])
      .forEach((key) => {
        metrics[`${key}_${type}`] = {
          type,
          key,
          keys,
          ...(size && { size }),
          ...(from && { from }),
          ...(interval && { interval }),
          ...(include && { include }),
        };
      });
  }
  return metrics;
}

module.exports = {
  get2metric,
};
