import { filterConfigTypes } from '@/components/filters/filterTools';
import { rangeOrTerm } from '@/components/filters/rangeFilter';
import { FilterType } from '@/contexts/filter';
import { Filters } from '@/routes/occurrence/search/filters';
import { searchConfig } from '@/routes/occurrence/search/searchConfig';
import { constantCase } from 'change-case';

/* 
attempt to get a predicate as an occurrence filter. This isn't a perfect implementation, it just aims to catch the most frequent cases. 
Aside from that we could choose to add a predicate filter on occurrence search and link to that
*/
export function getPredicateAsFilter({
  predicate,
  filters,
}: {
  predicate: any;
  filters: Filters;
}): {
  error?: string;
  filter?: FilterType;
} {
  if (!predicate) {
    return { error: 'NO_PREDICATE' };
  }
  if (predicate.type === 'or') {
    return { error: 'UNABLE_TO_CONVERT' };
  }
  if (predicate.type === 'not') {
    return { error: 'UNABLE_TO_CONVERT' };
  }
  if (predicate.type !== 'and') {
    predicate = { type: 'and', predicates: [predicate] };
  }
  if (!searchConfig.fields) {
    return { error: 'NO_SEARCH_CONFIG' };
  }
  const supportConstantCaseFields = Object.keys(searchConfig.fields).map((x) => constantCase(x));

  // make mapping of key values from constant to those existing in searchConfig.fields
  const fieldMap = Object.keys(searchConfig.fields).reduce((acc, key) => {
    acc[constantCase(key)] = key;
    return acc;
  }, {} as { [key: string]: string });

  // check that all predicates. With a different test per type
  // for example if 'AND', then only acceptable if exactly 2 children and it is a range greatherThanOrEquals and lessThanOrEquals of the same key and a known range type
  // if 'EQUALS' then it is a simple key value pair and always okay if we support the filter

  const filter: FilterType = {
    must: {},
    mustNot: {},
  };

  /*
  check if there are not predicates among the children. If so, they must be of different keys. And they must be either 'in' or 'equals' or 'like'
  this isn't a catch all solution since type:or predicates with children of type:and could be used to create a not predicate. And it would in some cases be accepted by the UI. 
  For those edge cases I tend to say we should create a predicate filter and link to that instead
   */
  const notPredicates = predicate.predicates.filter((p) => p.type === 'not');
  // split predicates into type:not and others
  const regularPredicates = predicate.predicates.filter((p) => p.type !== 'not');
  const flattenedNotPredicates = notPredicates.flatMap((p) => p.predicate);

  // check that they are all different keys
  const notKeys = flattenedNotPredicates.map((p) => p.key);
  if (notKeys.length !== new Set(notKeys).size) {
    return { error: 'UNABLE_TO_CONVERT' };
  }
  // now check that they all use supported types
  for (const p of flattenedNotPredicates) {
    if (!supportConstantCaseFields.includes(p.key)) {
      return { error: 'UNABLE_TO_CONVERT' };
    }
    if (p.type !== 'equals' && p.type !== 'in' && p.type !== 'like') {
      return { error: 'UNABLE_TO_CONVERT' };
    }
  }

  // process not predicates
  for (const p of flattenedNotPredicates) {
    const camelKey = fieldMap[p.key];
    if (p.key && !supportConstantCaseFields.includes(p.key)) {
      return { error: 'UNABLE_TO_CONVERT' };
    }
    if (p.type === 'equals') {
      filter.mustNot[camelKey] = (filter.mustNot[camelKey] ?? []).concat([p.value]);
      continue;
    }

    if (p.type === 'in') {
      filter.mustNot[camelKey] = (filter.mustNot[camelKey] ?? []).concat(p.values);
      continue;
    }

    if (p.type === 'like') {
      // TODO we should check that the field supports like filtering in the UI
      if (filters[camelKey].filterType === filterConfigTypes.WILDCARD) {
        filter.mustNot[camelKey] = (filter.mustNot[camelKey] ?? []).concat([
          { type: 'like', value: p.value },
        ]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    return { error: 'UNABLE_TO_CONVERT' };
  }

  // proces regular predicates
  for (const p of regularPredicates) {
    const camelKey = fieldMap[p.key];
    const camelParameter = fieldMap[p.parameter];
    if (p.key && !supportConstantCaseFields.includes(p.key)) {
      return { error: 'UNABLE_TO_CONVERT' };
    }
    if (p.type === 'equals') {
      filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([p.value]);
      continue;
    }

    if (p.type === 'in') {
      filter.must[camelKey] = (filter.must[camelKey] ?? []).concat(p.values);
      continue;
    }

    if (p.type === 'like') {
      // TODO we should check that the field supports like filtering in the UI
      if (filters[camelKey].filterType === filterConfigTypes.WILDCARD) {
        filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([
          { type: 'like', value: p.value },
        ]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'greaterThanOrEquals') {
      if (searchConfig.fields[camelKey]?.v1?.supportedTypes?.includes('range')) {
        filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([rangeOrTerm(`${p.value},`)]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'lessThanOrEquals') {
      if (searchConfig.fields[camelKey]?.v1?.supportedTypes?.includes('range')) {
        filter.must[camelKey] = (filter.must[camelKey] ?? []).concat([rangeOrTerm(`,${p.value}`)]);
        continue;
      }
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'and') {
      // this is only accepted in the case that there are exactly 2 children and they are of the same key. One greaterThanOrEquals and one lessThanOrEquals
      if (p.predicates.length === 2) {
        const subPredicates = p.predicates.sort((a, b) => a.type.localeCompare(b.type));
        const p1 = subPredicates[0];
        const p2 = subPredicates[1];
        if (
          p1.type === 'greaterThanOrEquals' &&
          p2.type === 'lessThanOrEquals' &&
          p1.key === p2.key
        ) {
          // check that it is a known key
          if (!supportConstantCaseFields.includes(p1.key)) {
            return { error: 'UNABLE_TO_CONVERT' };
          }
          if (searchConfig.fields[fieldMap[p1.key]]?.v1?.supportedTypes?.includes('range')) {
            filter.must[fieldMap[p1.key]] = (filter.must[fieldMap[p1.key]] ?? []).concat([
              rangeOrTerm(`${p1.value},${p2.value}`),
            ]);
            continue;
          }
        }
      }
      console.log('Failed to convert', p);
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'isNotNull') {
      // check if allowed. There is a risk here that different naming is used. I will ignore that for now
      if (filters[camelParameter].allowExistence) {
        filter.must[camelParameter] = (filter.must[camelParameter] ?? []).concat([
          { type: 'isNotNull' },
        ]);
        continue;
      }
      console.log('Failed to convert', p);
      return { error: 'UNABLE_TO_CONVERT' };
    }

    if (p.type === 'isNull') {
      // check if allowed. There is a risk here that different naming is used. I will ignore that for now
      if (filters[camelParameter].allowExistence) {
        filter.must[camelParameter] = (filter.must[camelParameter] ?? []).concat([
          { type: 'isNull' },
        ]);
        continue;
      }
      console.log('Failed to convert', p);
      return { error: 'UNABLE_TO_CONVERT' };
    }

    return { error: 'UNABLE_TO_CONVERT' };
  }
  return { filter };
}
