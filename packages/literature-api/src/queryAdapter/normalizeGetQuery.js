/**
 * Transform GET style parameter query to POST style objects
 * E.g. `year=1900,2000` to `year: {gte: 1900, lte: 2000, relation: INTERSECTION}`
 */

function rangeOrTerm(field, value, config) {
  if (value.indexOf(',') === -1) {
    return value;
  } else {
    let values = value.split(',');
    const upperBound = config.defaultUpperBound || 'gte';
    const lowerBound = config.defaultLowerBound || 'lt';
    return {
      [upperBound]: values[0],
      [lowerBound]: values[1]
    }
  }
}

function delimted(field, value, config) {
  let values = value.split('__');
  return config.nestedFields.reduce((prev, current, index) => {
    return {
      ...prev,
      [current]: values[index]
    }
  }, {});
}

function parseSingleValue(field, value, config) {
  if (!config) {
    // if no explicit mapping defined, then use a default
    return value;
  }
  switch(config.type) {
    case 'range_or_term': 
      return rangeOrTerm(field, value, config);
    case 'delimted': 
      return delimted(field, value, config);
    default: 
      return value;
  }
}

function parseValue(field, value, config) {
  if (Array.isArray(value)) {
    // interpret as array of ORs
    return value.map(val => parseSingleValue(field, val, config));
  } else {
    // single statement
    return parseSingleValue(field, value, config);
  }
}

function normalizeGetQuery(query, config) {
  let body = Object.keys(query).map(field => {
    const fieldConfig = config[field];
    const value = query[field];
    return {
      field,
      value: parseValue(field, value, fieldConfig)
    }
  });
  return body;
}

module.exports = {
  normalizeGetQuery
};


// const params = {
//   year: ['1900,2000', '2010', '2012,*'],
//   datasetKey: '1234-5678',
//   publisher: ['pub1', 'pub2'],
//   author: 'ann__anderson'
// }
// const config = {
//   year: {
//     type: 'optional_range',
//     defaultUpperBound: 'gte',
//     defaultLowerBound: 'lte'
//   },
//   author: {
//     type: 'delimted',
//     delimter: '__',
//     nestedFields: ['firstName', 'lastName']
//   }
// };

// const result = parseStringGetQuery(params, config);
// console.log(JSON.stringify(result, null, 2));