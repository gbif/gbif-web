// import { asArray } from '../../util/helpers';
/**
 * For filters that are simple terms (one or many) mapping a filterName to an ES field name, then this will simply return such a builder.
 * This will be the case for most filters and the default. All filters are expected to strings or numbers.
 * @param {*} esField 
 */
export const termFilter = esField => (values, builder) => {
  // const values = asArray(filter);
  if (values.length === 0) {
    return
  } else if (values.length === 1) {
    builder.filter('term', esField, values[0]);
  } else {
    builder.filter('terms', esField, values);
  }
}

export const rangeFilter = esField => (values, builder) => {
  // const values = asArray(filter);
  if (values.length === 0) {
    return
  } else if (values.length === 1) {
    builder.filter('range', esField, values[0]);
  } else {
    builder.filter('bool', b => {
      let a = b;
      values.forEach(v => {
        a = a.orFilter('range', esField, v);
      });
      return a;
    });
  }
}

export const termOrRangeFilter = esField => (values, builder) => {
  // const values = asArray(filter);
  if (values.length === 0) {
    return
  }

  if (values.length === 1) {
    addTerm(builder, esField, values[0]);
  } else {
    const includesRanges = hasRanges(values);
    if (!includesRanges) {
      builder.filter('terms', esField, values);
    } else {
      // it is an array and it includes at least on range
      builder.filter('bool', b => {
        let a = b;
        values.forEach(v => {
          a = isRange(v) ? a.orFilter('range', esField, v) : a.orFilter('term', esField, v);
        });
        return a;
      });
    }
  }
}

const addTerm = (builder, esField, val) => {
  if (isTerm(val)) {
    builder.filter('term', esField, val);
  }
  if (isRange(val)) {
    builder.filter('range', esField, val);
  }
}

export const isTerm = val => {
  return typeof val === 'string' || typeof val === 'number';
}

export const isRange = val => {
  return typeof val === 'object' && (
    typeof val.gte !== 'undefined' || typeof val.gt !== 'undefined' || typeof val.lte !== 'undefined' || typeof val.lt !== 'undefined'
  );
}

export const hasTerms = values => {
  return values.some(isTerm);
}

export const hasRanges = values => {
  return values.some(isRange);
}

// let builder = bodybuilder();
// termFilter('height')([2, 3], builder);
// // rangeFilter('year')([{ gte: 1980, lt: 1990 }, { gte: 1930, lt: 1940 }], builder);
// termOrRangeFilter('year2')([1932, { gte: 1980, lt: 1990 }, { gte: 1930, lt: 1940 }], builder);
// console.log(JSON.stringify(builder.build(), null, 2));
