const _ = require('lodash');

module.exports = function (predicate) {
  try {
    const copy = JSON.parse(JSON.stringify(predicate));
    const withRange = convertRangeType(copy);
    const withLike = convertLikePredicates(withRange);
    const notIssues = convertNotIssues(withLike);
    const withCase = uppercaseKeys(notIssues);
    return {
      err: null,
      predicate: withCase
    }
  } catch (err) {
    return { err }
  }
}

function toEnumCase(str) {
  return _.snakeCase(str).toUpperCase();
}
function uppercaseKeys(predicate) {
  if (typeof predicate.key === 'string') {
    predicate.key = toEnumCase(predicate.key);
  }
  if (predicate.predicates) {
    predicate.predicates = predicate.predicates.map(uppercaseKeys);
  }
  if (predicate.predicate) {
    predicate.predicate = uppercaseKeys(predicate.predicate);
  }
  return predicate;
}

const types = [
  { short: 'gte', long: 'greaterThanOrEquals' },
  { short: 'gt', long: 'greaterThan' },
  { short: 'lte', long: 'lessThanOrEquals' },
  { short: 'lt', long: 'lessThan' }
];

function convertRangeType(obj) {
  if (obj.predicate) {
    convertRangeType(obj.predicate);
  } else if (obj.predicates && Array.isArray(obj.predicates)) {
    obj.predicates = obj.predicates.map(convertRangeType);
  } else if (obj.type === 'range') {
    let ps = [];

    types.forEach(function (type) {
      const value = obj.value[type.short];
      if (typeof value !== 'undefined') {
        ps.push({
          type: type.long,
          key: obj.key,
          value: value
        });
      }
    });

    return {
      type: 'and', predicates: ps
    };
  }
  return obj;
}

function convertLikePredicates(obj) {
  if (obj.predicate) {
    convertLikePredicates(obj.predicate);
  } else if (obj.predicates && Array.isArray(obj.predicates)) {
    obj.predicates = obj.predicates.map(convertLikePredicates);
  } else if (obj.type === 'like') {
    obj.value = obj.value.replace(/[*?]/g, '%');
  }
  return obj;
}

function convertNotIssues(obj) {
  if (obj.predicate) {
    convertNotIssues(obj.predicate);
  } else if (obj.predicates && Array.isArray(obj.predicates)) {
    obj.predicates = obj.predicates.map(convertNotIssues);
  } else if (obj.key === 'notIssues') {
    if (obj.type === 'in') {
      return {
        type: 'not',
        predicate: {
          type: 'and',
          predicates: obj.values.map(x => ({
            type: 'equals',
            key: 'issue',
            value: x
          }))
        }
      }
    } else if (obj.type === 'equals') {
      return {
        type: 'not',
        predicate: {
          type: 'equals',
          key: 'issue',
          value: obj.value
        }
      }
    }
  }
  return obj;
}