const _ = require('lodash');

function queryReducer({body, size, from}) {
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