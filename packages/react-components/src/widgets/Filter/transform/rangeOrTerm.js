/**
 * Generate a range or a terms predicate. This is useful for years, 
 * that can both be queried as a range or as a term. 
 * E.g. year=1950,2000
 * @param {string} value 
 * @param {string} upperBound 
 * @param {string} lowerBound 
 */
export function rangeOrTerm(value, lowerBound = 'gte', upperBound = 'lte') {
  // has a comma in the string
  let delimter = value.indexOf(',') > -1 ? ',' : null;
  if (!delimter) {
    // no comma, but a dash, and since it isn't the first character then it isn't a negation
    delimter = value.indexOf('-') > 0 ? '-' : null;
  }
  
  if (typeof value !== 'string' || !delimter) {
    return {
      type: 'equals',
      value: value
    };
  } else {
    let values = value.split(delimter);
    const cleanedValues = values
      .map(s => s.trim())
      .map(s => (s === '*' || s === '') ? undefined : s);
    return {
      type: 'range',
      value: {
        [upperBound]: cleanedValues[0],
        [lowerBound]: cleanedValues[1]
      }
    }
  }
}
