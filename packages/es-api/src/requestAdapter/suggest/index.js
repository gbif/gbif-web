const _ = require('lodash');
const { ResponseError } = require('../../resources/errorHandler');

function getSuggestQuery(key, text, config) {
  const field = _.get(config, `options.${key}.suggestField`);
  if (field) {
    return { field, text };
  } else {
    throw new ResponseError(404, 'notFound', 'No suggest configuration found for this field');
  }
}

module.exports = {
  getSuggestQuery,
};
