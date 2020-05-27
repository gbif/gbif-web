import hash from 'object-hash';
/**
 * Generate a range or a terms predicate. This is useful for years, 
 * that can both be queried as a range or as a term. 
 * E.g. year=1950,2000
 * @param {string} value 
 * @param {string} upperBound 
 * @param {string} lowerBound 
 */
export function rangeOrTerm(value, lowerBound = 'gte', upperBound = 'lte') {
  const key = hash(value);
  if (typeof value !== 'string' || value.indexOf(',') === -1) {
    return {
      type: 'equals',
      value: value,
      key
    };
  } else {
    let values = value.split(',');
    const cleanedValues = values.map(s => s === '*' ? undefined : s.trim());
    return {
      type: 'range',
      value: {
        [upperBound]: cleanedValues[0],
        [lowerBound]: cleanedValues[1]
      },
      key
    }
  }
}