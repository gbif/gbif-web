'use strict';
const _ = require('lodash');
const { ResponseError } = require('../../resources/errorHandler');

function metric2aggs(metrics = {}, config) {
  let aggs = {};
  for (let [name, metric] of Object.entries(metrics)) {
    const conf = _.get(config, `options[${metric.key}]`);
    if (!conf) continue;
    else {
      switch (metric.type) {
        case 'facet': {
          if (!['keyword', 'numeric', 'boolean'].includes(conf.type)) throw new ResponseError(400, 'badRequest', 'Facets are only supported on keywords, boolean and numeric fields');
          aggs[name] = {
            terms: {
              field: conf.field,
              size: metric.size
            }
          };
          break;
        }
        case 'stats': {
          if (conf.type !== 'numeric') throw new ResponseError(400, 'badRequest', 'Only numeric fields support this aggregation');
          aggs[name] = {
            stats: {
              field: conf.field
            }
          };
          break;
        }
        default: {
          // ignore unknown types
          break;
        }
      }
    }
  }
  return aggs;
}

module.exports = {
  metric2aggs
}
