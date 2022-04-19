const _ = require('lodash');
const allowedTypes = ['facet', 'stats', 'cardinality'];

function get2metric(query, config) {
  // query example: {facet: [year, datasetKey], stats: year, facet.size.year:3}
  const parsedQuery = Object.keys(query).reduce((acc, cur) => {
    // only conider keys starting with the allowed types (facet, stats, etc.)
    const firstPart = cur.split('.')[0];
    if (!allowedTypes.includes(firstPart)) return acc;

    if (cur.includes('.')) {
      return _.set(acc, cur, query[cur]);
    } else {
      // else assign value to a 'value' field
      return _.set(acc, `${cur}.value`, query[cur]);
    }
  }, {});

  let metrics = {};
  for (let [type, conf] of Object.entries(parsedQuery)) {
    const keys = Array.isArray(conf.value) ? conf.value : [conf.value];
    keys.filter(key => config.options[key]).forEach(key => {
      const size = _.get(conf, `size.${key}`)
      const include = _.get(conf, `include.${key}`)
      metrics[`${key}_${type}`] = {
        type,
        key,
        ...(size && { size }),
        ...(include && { include }),
      }
    });
  }
  return metrics;
}

module.exports = {
  get2metric
}