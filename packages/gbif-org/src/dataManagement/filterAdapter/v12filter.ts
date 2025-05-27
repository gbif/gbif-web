import { FilterType } from '@/contexts/filter';
import { ParamQuery } from '@/utils/querystring';
import { FilterConfigType } from './filter2predicate';
/**
 * Will return a filter with the form: {filterNameA: [1], filterNameB: ['a', 'b']}
 * @param {JSON} query as when parsed from url. Should be of the form: {fieldA: [values], fieldB: value}
 * @param {*} filterConfig
 */
export default function v12filter(
  query: ParamQuery,
  filterConfig: FilterConfigType,
  defaultChecklistKey?: string
): FilterType {
  query = query || {};
  const filter: FilterType = { must: {} };

  const fields = filterConfig?.fields;
  if (!fields) return {};

  const reverseMap: { [key: string]: string } = Object.keys(fields).reduce(
    (prev: { [key: string]: string }, fieldName) => {
      const from = fields[fieldName]?.defaultKey || fieldName;
      const to = fieldName;
      prev[from] = to;
      return prev;
    },
    {}
  );

  Object.keys(query).forEach((field) => {
    // checklistKey params are handled in a unique way for all filters. See further down.
    if (field === 'checklistKey') return;
    const value = query[field];
    if (typeof value === 'undefined') return;

    const name = reverseMap[field] || field;
    let arrayValue = Array.isArray(value) ? value : [value];
    const config = fields[name];
    const v1Types = config?.v1?.supportedTypes || ['equals'];

    //if range type then transform values
    if (v1Types.includes('range')) {
      arrayValue = arrayValue.map((val: string): object => {
        const parts = (val + '').split(',');
        if (parts.length === 1) {
          return { type: 'equals', value: parts[0] };
        } else {
          const range: { type: string; value: { gte?: number | string; lte?: number | string } } = {
            type: 'range',
            value: {},
          };
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

    //if range type then transform values
    if (v1Types.includes('geoDistance')) {
      arrayValue = arrayValue.map((val) => {
        const parts = val.split(',');
        return {
          type: 'geoDistance',
          latitude: parts[0],
          longitude: parts[1],
          distance: parts[2],
        };
      });
    }

    if (filter.must) {
      filter.must[name] = arrayValue;
    }
  });
  const checklistKey = query?.checklistKey?.[0] ?? query?.checklistKey ?? defaultChecklistKey;
  if (typeof checklistKey === 'string') {
    filter.checklistKey = checklistKey;
  }
  return filter;
}
