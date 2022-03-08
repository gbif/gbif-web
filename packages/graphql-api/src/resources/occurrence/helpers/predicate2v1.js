const _ = require('lodash');
const hash = require('object-hash');

const emptyAndHash = hash({ "type": "and", "predicates": [] });
module.exports = function (predicate) {
  if (!predicate) {
    return {}
  }
  try {
    const strCopy = JSON.stringify(predicate);
    if (hash(predicate) === emptyAndHash) {
      return {
        err: null,
        predicate: null
      }
    }
    const copy = JSON.parse(strCopy);
    const withRange = convertRangeType(copy);
    // const withLike = convertLikePredicates(withRange);
    const notIssues = convertNotIssues(withRange);
    const withNotNull = convertIsNotNull(notIssues);
    const removedEmpty = removeEmpty(withNotNull);
    const nestingSimplified = removeExcessiveNesting(removedEmpty);
    const withCase = uppercaseKeys(nestingSimplified);

    //check for simple known errors
    if (hasFuzzyTypes(withCase)) return {
      err: {
        type: 'FUZZY_NOT_ALLOWED',
        message: 'Free text filters are not allowed in downloads'
      }
    }

    return {
      err: null,
      predicate: withCase
    }
  } catch (err) {
    console.log(err);
    return { err: 'UNABLE_TO_PARSE_PREDICATE_TO_V1' }
  }
}

function toEnumCase(str) {
  return _.snakeCase(str).toUpperCase();
}

function uppercaseKeys(predicate) {
  if (typeof predicate.key === 'string') {
    predicate.key = toEnumCase(predicate.key);
  }
  if (typeof predicate.parameter === 'string') {
    predicate.parameter = toEnumCase(predicate.parameter);
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

// after the download API changed this is no lnger required
// function convertLikePredicates(obj) {
//   if (obj.predicate) {
//     convertLikePredicates(obj.predicate);
//   } else if (obj.predicates && Array.isArray(obj.predicates)) {
//     obj.predicates = obj.predicates.map(convertLikePredicates);
//   } else if (obj.type === 'like') {
//     obj.value = obj.value.replace(/[*?]/g, '%');
//   }
//   return obj;
// }

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

function convertIsNotNull(obj) {
  if (obj.predicate) {
    obj.predicate = convertIsNotNull(obj.predicate);
  } else if (obj.predicates && Array.isArray(obj.predicates)) {
    obj.predicates = obj.predicates.map(convertIsNotNull);
  } else if (obj.type === 'isNotNull') {
    return {
      type: 'isNotNull',
      parameter: obj.key
    }
  }
  return obj;
}

function removeExcessiveNesting(obj) {
  if (obj.predicate) {
    removeExcessiveNesting(obj.predicate);
  } else if (obj.predicates && Array.isArray(obj.predicates) && obj.predicates.length === 1) {
    return removeExcessiveNesting(obj.predicates[0]);
  }
  return obj;
}

function removeEmpty(obj) {
  if (obj.predicate) {
    removeEmpty(obj.predicate);
  } else if (obj.predicates && Array.isArray(obj.predicates)) {
    obj.predicates = obj.predicates.filter(x => {
      return !isEmpty(x);
    }).map(removeEmpty);
  }
  return obj;
}

function isEmpty(predicate = {}) {
  return Array.isArray(predicate.predicates) && predicate.predicates.length === 0;
}

function hasFuzzyTypes(obj) {
  if (obj.predicate) {
    return hasFuzzyTypes(obj.predicate);
  } else if (obj.predicates && Array.isArray(obj.predicates)) {
    return obj.predicates.find(hasFuzzyTypes);
  } else if (obj.type === 'fuzzy') {
    return true;
  }
  return false;
}