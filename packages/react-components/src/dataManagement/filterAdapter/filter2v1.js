/**
 * A query is expected to have format: {filterNameA: [1], filterNameB: ['a', 'b']}
 * A query can composed by adding one filter ad a time. the order of filters should not matter.
 * @param {*} filter 
 */
function filter2v1(filter, filterConfig) {
  filter = filter || {};
  // if (filterConfig.preFilterTransform) {
  //   filter = filterConfig.preFilterTransform(filter);
  // }
  const { must, must_not } = filter;

  let composedFilter = {};
  let errors = [];

  if (must) Object.entries(must)
    .filter(([filterName, values]) => values)
    .forEach(([filterName, values]) => {
      const fieldFilter = getField({ filterName, values, filterConfig, errors });
      if (fieldFilter) composedFilter[fieldFilter.name] = fieldFilter.values;
    });
  
  // Negation support removed as discussed in https://github.com/gbif/hosted-portals/issues/209
  // See commit history for version that supported negations
  if (must_not) {
    const negatedFields = Object.entries(must_not).filter(([filterName, values]) => values);
    if (negatedFields.length > 0) {
      errors.push({
        errorType: 'UNSUPPORTED_NEGATED_PREDICATE'
      });
    }
  }

  return {
    v1Filter: composedFilter,
    errors: errors.length > 0 ? errors : undefined
  };
}

function getField({ filterName, values, filterConfig, errors }) {
  // if no values or an empty array is provided, then there it no predicates to create
  if (values?.length === 0) return;

  // get the configuration for this filter if any is provided
  const config = filterConfig.fields[filterName] || {};

  // if a mapping function for the values is provided, then apply it
  let mappedValues = typeof config?.transformValue === 'function' ? values.map(config.transformValue) : values;

  let serializedValues = mappedValues
    .map(value => serializeValue({value, config, filterName, errors}))
    .filter(v => typeof v !== 'undefined');// remove filters that couldn't be parsed
  
  if (config.singleValue) {
    serializedValues = serializedValues[0];
  }

  return {
    name: config?.defaultKey || filterName,
    values: serializedValues
  }
}

function serializeValue({value, config, filterName, errors}) {
  // if already string or value, then simply return as is
  const type = value?.type || config?.defaultType || 'equals';
  const v1Types = config?.v1?.supportedTypes || ['equals'];

  // test that the type is compatible with API v1
  if (!v1Types.includes(type)) {
    errors.push({
      errorType: 'INVALID_PREDICATE_TYPE',
      filterName,
      type
    });
    return;
  }


  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  } else if (typeof value === 'object' && value !== null) {
    //serlialize object if known type
    if (['equals', 'fuzzy', 'like', 'within'].includes(type)) {
      return value.value;
    } else if(type === 'range' ) {
      // if a range query, then transform to string format
      return `${value.value.gte || value.value.gt || '*'},${value.value.lte || value.value.lgt || '*'}`;
    } else {
      errors.push({
        errorType: 'UNKNOWN_PREDICATE_TYPE',
        filterName,
        type
      });
      return;
    }
  } else {
    errors.push({
      errorType: 'UNKNOWN_PREDICATE_VALUE_FORMAT',
      filterName,
      type
    });
    return;
  }
}

export default filter2v1;