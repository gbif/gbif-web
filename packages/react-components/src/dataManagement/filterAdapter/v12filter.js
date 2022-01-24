/**
 * Will return a filter with the form: {filterNameA: [1], filterNameB: ['a', 'b']}
 * @param {JSON} query as when parsed from url. Should be of the form: {fieldA: [values], fieldB: value}
 * @param {*} filterConfig 
 */
export default function v12filter(query, filterConfig) {
  query = query || {};
  let must = {};

  let reverseMap = Object.keys(filterConfig.fields).reduce((prev, fieldName) => {
    const from = filterConfig.fields[fieldName]?.defaultKey || fieldName;
    const to = fieldName;
    prev[from] = to;
    return prev;
  }, {});

  Object.keys(query).forEach(field => {
    const value = query[field];
    if (typeof value === 'undefined') return;
    
    const name = reverseMap[field] || field;
    let arrayValue = Array.isArray(value) ? value : [value];
    const config = filterConfig.fields[name];
    const v1Types = config?.v1?.supportedTypes || ['equals'];

    //if range type then transform values
    if (v1Types.includes('range')) {
      arrayValue = value.map(val => {
        const parts = val.split(',');
        if (parts.length === 1) {
          return {type: 'equals', value: parts[0]};
        } else {
          let range = {
            type: 'range',
            value: {}
          }
          const gte = parts[0];
          const lte = parts[1];
          if (gte !== '' && gte !== '*') {
            range.value.gte = gte;
          }
          if (lte !== '' && lte !== '*') {
            range.value.lte = lte;
          }
          return range;
        }
      });
    }
    must[name] = arrayValue;
  });
  return {must};
}