const { get2predicate } = require('./get2predicate');
const { predicate2esQuery } = require('./predicate2esQuery');
const { validatePredicate } = require('./validatePredicate');
const { suggestConfig } = require('../../requestAdapter/util/suggestConfig');

function get2esQuery(getQuery, config) {
  const predicate = get2predicate(getQuery, config);
  const esQuery = predicate2esQuery(predicate, config);
  return esQuery;
}

module.exports = {
  get2predicate,
  predicate2esQuery,
  validatePredicate,
  get2esQuery,
  suggestConfig,
};
