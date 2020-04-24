const _ = require('lodash');

function range_or_term(value, config) {
  let result = {};
  // if plain string and the config have defined a regex for when strings are valid
  if (typeof value === 'string') {
    // //split on comma
    // let values = value.split(',');
    // if (config.format === 'NUMBER') {
    //   values = values.map(Number);
    // } else {
    //   values = values.map(s => s === '*' ? '' : s);
    // }
    // if (values.length === 1) {
    //   return values[0];
    // } else {
    //   const upperBound = config.defaultUpperBound || 'gte';
    //   const lowerBound = config.defaultLowerBound || 'lt';
    //   result = {
    //     [upperBound]: values[0],
    //     [lowerBound]: values[1]
    //   }
    // }
    return value;
  } else if (_.isObjectLike(value)) {
    result = _.pick(value, ['gte', 'gt', 'lte', 'lt', 'relation']);
  } else {
    throw new Error(`Invalid range query format`);
  }

  // remove empty fields
  return _.omitBy(result, x => _.isNaN(x) || _.isUndefined(x) || x === '');
}

function asString(value) {
  return _.toString(value);
}

function asObject(allowedValues) {
  return (value) => {
    let o = value;
    if (typeof value === 'string') {
      try {
        o = JSON.parse(value);
      } catch(err) {
        throw new Error('Unable to parse author string as object');
      }
    }
    if (allowedValues) return _.pick(o, allowedValues);
    return o;
  }
}

module.exports = {
  range_or_term,
  asString,
  asObject
}