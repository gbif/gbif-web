/**
 * Transform GET style parameter query to predicate style
 * E.g. `datasetKey=123&year=1900` to
 * ```
 * {
 *  type:and, predicates:[
 *    {type:equals, key:year, value:1900}
 *    {type:equals, key:datasetKey, value:123}
 *  ]
 * }
 * ```
 *
 * The function does not care that your values illegal
 * and your configuration invalid. It does a best attempt to map it.
 * You do need to have an explicit configuration for all keys. Everything else will be discarded.
 */

const get = require('lodash/get');

function get2predicate(query, config) {
  const key2config = config.options;
  // mapp all parameters to a predicate and join them in an AND
  let andPredicates = Object.keys(query).map((field) => {
    const fieldConfig = field.startsWith('!') ? key2config[field.substr(1)] : key2config[field];
    // if there are no configuration or the get config states that it is disabled, then discard this parameter
    if (!fieldConfig || get(fieldConfig, 'get.disabled')) {
      return;
    }
    const value = query[field];
    if (!value || value === '') {
      return;
    }
    // if the value is an array of 1, then unwrap it
    const unwrappedValue = Array.isArray(value) && value.length === 1 ? value[0] : value;
    return transform2predicate(field, unwrappedValue, fieldConfig.get);
  });

  //remove parameters for which we have no explicit config
  const predicates = andPredicates.filter((x) => typeof x !== 'undefined');
  if (predicates.length === 0) {
    return; // TODO what to return when there isn't any query? empty?
  } else if (predicates.length === 1) {
    return predicates[0];
  } else {
    return {
      type: 'and',
      predicates,
    };
  }
}

function transform2predicate(field, value, config) {
  //if the query parameter starts with ! then it is mapped to a NOT predicate.
  if (field.startsWith('!')) {
    return {
      type: 'not',
      predicate: transform2predicate(field.substr(1), value, config),
    };
    // the field need to explicitly be configured to support negations.
    // TODO: consider removing this requirement since, the predicates allow it either way.
    // if (config && config.supportsNegation) {
    //   return {
    //     type: 'not',
    //     predicate: transform2predicate(field.substr(1), value, config)
    //   }
    // } else {
    //   throw new Error(`Negation not supported for ${field.substr(1)}`);
    // }
  }
  // if the value is an array, then try to flatten it to an IN
  if (Array.isArray(value)) {
    // an array of values recieved, but instead of wrapping them in an OR,
    // they can perhaps be flattened to an IN

    // parse each value individually
    const predicates = value.map((val) => getPredicateFromSingleValue(field, val, config));
    //if they are all of type EQUALS
    const equalPredicates = predicates.filter((x) => x.type === 'equals');
    const equalPredicatesOnly = equalPredicates.length === predicates.length;
    //then we can transform them to an IN instead
    if (equalPredicatesOnly) {
      return {
        type: 'in',
        key: field,
        values: equalPredicates.map((x) => x.value),
      };
    } else {
      // they cannot be flattened, wrap them in an OR predicate.
      return {
        type: 'or',
        predicates,
      };
    }
  } else {
    // single value, just return the
    return getPredicateFromSingleValue(field, value, config);
  }
}

/**
 * return a leaf predicate. E.g. {type:equal, key:year, value:2010}
 * @param {string} field
 * @param {*} value
 * @param {object} config
 */
function getPredicateFromSingleValue(field, value, config) {
  if (value === '*') {
    //assume that it is a exists query
    return {
      type: 'isNotNull',
      key: field,
    };
  }
  const type = config && config.type;
  switch (type) {
    case 'range_or_term': {
      return rangeOrTerm(field, value, config);
    }
    case 'geo_distance': {
      return geoDistance(field, value, config);
    }
    case 'delimted': {
      return delimted(field, value, config);
    }
    case 'within': {
      return within(field, value, config);
    }
    case 'fuzzy': {
      return {
        type: 'fuzzy',
        key: field,
        value: value,
      };
    }
    // if no explicit configuration, then assume equals
    default:
      return {
        type: 'equals',
        key: field,
        value: value,
      };
  }
}

/**
 * Generate a range or a terms predicate. This is useful for years,
 * that can both be queried as a range or as a term.
 * E.g. year=1950,2000
 * @param {string} field
 * @param {*} value
 * @param {object} config
 */
function rangeOrTerm(field, value, config) {
  if (typeof value !== 'string' || value.indexOf(',') === -1) {
    return {
      type: 'equals',
      key: field,
      value: value,
    };
  } else {
    let values = value.split(',');
    const cleanedValues = values.map((s) => (s === '*' ? undefined : s));
    const upperBound = config.defaultUpperBound || 'gte';
    const lowerBound = config.defaultLowerBound || 'lt';
    return {
      type: 'range',
      key: field,
      value: {
        [upperBound]: cleanedValues[0],
        [lowerBound]: cleanedValues[1],
      },
    };
  }
}

/**
 * An attempt to allow GET queries on nested fields.
 * E.g. first and last name in a list of authors.
 * By accepting a seperator/delimter and a fixed order list, we can allow term filters on nested/grouped items
 * @param {string} field
 * @param {*} value
 * @param {*} config
 */
function delimted(field, value, config) {
  // split by delimter to get the value for allowed term
  let values = value.split(config.delimter || '__');
  // iterate over the required fields names, creating a equal predicate for each.
  // and remove predicates without any value
  const predicates = config.termOrder
    .map((x, i) => ({
      type: 'equals',
      key: x,
      value: values[i],
    }))
    .filter((x) => x.value && x.value !== '');
  return {
    type: 'nested',
    key: field,
    predicate: {
      type: 'and',
      predicates,
    },
  };
}

function within(field, value) {
  return {
    type: 'within',
    key: field,
    value: value,
  };
}

function geoDistance(field, value) {
  const [lat = 0, lon = 0, distance = '0m'] = value.split(',');
  return {
    type: 'geoDistance',
    distance: distance,
    latitude: lat,
    longitude: lon,
  };
}

module.exports = {
  get2predicate,
};
