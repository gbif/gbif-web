import get from 'lodash/get';

/**
 * A query is expected to have format: {filterNameA: [1], filterNameB: ['a', 'b']}
 * A query can composed by adding one filter ad a time. the order of filters should not matter.
 * @param {*} filter 
 */
function filter2predicate(filter, filterConfig) {
  filter = filter || {};
  if (filterConfig.preFilterTransform) {
    filter = filterConfig.preFilterTransform(filter);
  }
  const { must, must_not } = filter;

  const positive = getPredicates({ filters: must, filterConfig });
  const negated = getPredicates({ filters: must_not, filterConfig }).map(p => ({ type: 'not', predicate: p }));
  
  // sort predicates to optimize cache hits. EDIT: this feels like halfhearted premature optimization
  // const predicates = sortBy(positive.concat(negated), ['type', 'key']);
  const predicates = positive.concat(negated);

  if (predicates.length === 1) {
    return predicates[0];
  } else {
    return {
      type: 'and',
      predicates
    }
  }
}

function getPredicates({ filters, filterConfig }) {
  if (!filters) return [];
  return Object.entries(filters)
    .map(([filterName, values]) => getPredicate({ filterName, values, filterConfig }))
    .filter(p => p);// remove filters that couldn't be transformed to a predicate
}

function getPredicate({ filterName, values = [], filterConfig }) {
  // get the configuration for this filter if any is provided
  const config = filterConfig.fields[filterName] || {};

  // if a custom serializer is specified then use that
  if (config.serializer) {
    return config.serializer({filterName, values, config});
  }

  // if no values or an empty array is provided, then there it no predicates to create
  if (Array.isArray(values) && values?.length === 0) return;

  // if a mapping function for the values is provided, then apply it
  let mappedValues = typeof config?.transformValue === 'function' ? values.map(config.transformValue) : values;

  // if the default type is equals or undefined then we might be able to create an 'in' predicate
  if (get(config, 'defaultType', 'equals') === 'equals') {
    // if all the provided values are string or numbers, then we can create an 'in' predicate
    if (mappedValues.every(x => typeof x === 'string' || typeof x === 'number')) {
      return {
        type: 'in',
        //if no default key is provided, then fall back to the filterName as a key
        key: config.defaultKey || filterName,
        values: mappedValues
      }
    }
  }

  // the values are mixed or complex. Create an or if length > 1
  let predicates = mappedValues
    .map(value => getPredicateFromSingleValue({ filterName, value, config }))
    .filter(p => p);// remove filters that couldn't be transformed to a predicate
  if (predicates.length === 1) {
    return predicates[0];
  } else {
    return {
      type: 'or',
      predicates
    }
  }
}

function getPredicateFromSingleValue({ filterName, value, config }) {
  // the values are expected to be either a predicate object (optionally missing key and type)
  // or a string/number

  if (typeof value === 'string' || typeof value === 'number') {
    return {
      type: config?.defaultType || 'equals',
      //if no default key is provided, then fall back to the filterName as a key
      key: config?.defaultKey || filterName,
      value: value
    }
  } else if (typeof value === 'object' && value !== null) {
    return {
      type: config?.defaultType || 'equals',
      key: config?.defaultKey || filterName,
      ...value, // overwrite type and key if it is defined in the value object
    }
  } else {
    console.warn('Invalid filter provided. It will be ignored. Provided: ', value);
  }
}

export default filter2predicate;