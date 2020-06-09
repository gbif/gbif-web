/**
 * A query is expected to have format: {filterNameA: [1], filterNameB: ['a', 'b']}
 * A query can composed by adding one filter ad a time. the order of filters should not matter.
 * @param {*} filter 
 */
function filter2v1(filter, filterConfig) {
  filter = filter || {};
  const { must, must_not } = filter;

  let composedFilter = {};

  Object.entries(must)
    .forEach(([filterName, values]) => {
      const fieldFilter = getField({ filterName, values, filterConfig });
      if (fieldFilter) composedFilter[fieldFilter.name] = fieldFilter.values;
    });
  
  Object.entries(must_not)
    .forEach(([filterName, values]) => {
      const fieldFilter = getField({ filterName, values, filterConfig });
      if (fieldFilter) composedFilter[`!${fieldFilter.name}`] = fieldFilter.values;
    });

  return composedFilter;
}

function getField({ filterName, values, filterConfig }) {
  // if no values or an empty array is provided, then there it no predicates to create
  if (values?.length === 0) return;

  // get the configuration for this filter if any is provided
  const config = filterConfig[filterName] || {};

  // if a mapping function for the values is provided, then apply it
  let mappedValues = typeof config?.transformValue === 'function' ? values.map(config.transformValue) : values;

  let serializedValues = mappedValues
    .map(value => serializeValue({value, config, filterName}))
    .filter(v => typeof v !== 'undefined');// remove filters that couldn't be transformed to a predicate

  return {
    name: config?.defaultKey || filterName,
    values: serializedValues
  }
}

function serializeValue({value, config, filterName}) {
  // if already string or value, then simply return as is
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  } else if (typeof value === 'object' && value !== null) {
    //serlialize object if known type
    if (['equals', 'fuzzy', 'like', 'within'].includes(value?.type || config?.defaultType || 'equals')) {
      return value.value;
    } else if((value?.type || config?.defaultType) === 'range' ) {
      // if a range query, then transform to string format
      return `${value.gte || value.gt || ''},${value.lte || value.lgt || ''}`;
    } else if((value?.type || config?.defaultType) === 'isNotNull' ) {
      // if a range query, then transform to string format
      return `*`;
    } else {
      console.warn('Invalid filter provided. It will be ignored. Provided: ', value);  
    }
  } else {
    console.warn('Invalid filter provided. It will be ignored. Provided: ', value);
  }
}

export default filter2v1;
