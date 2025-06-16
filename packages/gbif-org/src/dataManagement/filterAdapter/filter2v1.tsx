import { FilterType } from '@/contexts/filter';
import { FilterConfigType } from './filter2predicate';

type ErrorEnumType =
  | 'INVALID_PREDICATE_TYPE'
  | 'UNKNOWN_PREDICATE_TYPE'
  | 'UNKNOWN_PREDICATE_VALUE_FORMAT'
  | 'UNSUPPORTED_NEGATION';
type ErrorType = {
  errorType: ErrorEnumType;
  filterName?: string;
  type?: string;
};

type SingleOrArray<T> = T | T[];
type ValuesType = SingleOrArray<string | boolean | number>;

type V1FilterType = Record<string, ValuesType>;

export function filter2v1(
  filter: FilterType | undefined | null,
  filterConfig?: FilterConfigType
): { filter?: V1FilterType; errors?: ErrorType[] } {
  if (!filter) return {};
  if (filterConfig?.preFilterTransform) {
    filter = filterConfig?.preFilterTransform(filter);
  }
  const { must, mustNot, checklistKey } = filter;

  const composedFilter: { [key: string]: ValuesType } = {};
  const errors: ErrorType[] = [];

  if (must)
    Object.entries(must)
      .filter(([, values]) => values)
      .forEach(([filterName, values]) => {
        const fieldFilter = getField({ filterName, values, filterConfig, errors });
        if (fieldFilter?.values) composedFilter[fieldFilter.name] = fieldFilter.values;
      });

  // Negation support removed as discussed in https://github.com/gbif/hosted-portals/issues/209
  // Previous version in https://github.com/gbif/gbif-web/blob/8720cf9c9df0df089c4f54462d0b12c1696fffd1/packages/react-components/src/dataManagement/filterAdapter/filter2v1.js#L22
  if (mustNot) {
    const negatedFields = Object.entries(mustNot).filter(([, values]) => values);
    if (negatedFields.length > 0) {
      errors.push({
        errorType: 'UNSUPPORTED_NEGATION',
      });
    }
  }

  if (checklistKey) {
    composedFilter.checklistKey = checklistKey;
  }

  return {
    filter: composedFilter,
    errors: errors.length > 0 ? errors : undefined,
  };
}

function getField({
  filterName,
  values,
  filterConfig,
  errors,
}: {
  filterName: string;
  values: any[];
  filterConfig?: FilterConfigType;
  errors: ErrorType[];
}): { name: string; values: ValuesType } | undefined {
  // if no values or an empty array is provided, then there it no predicates to create
  if (values && !Array.isArray(values)) {
    console.warn('Filter values should be an array');
    return;
  }
  if (values?.length === 0) return;

  // get the configuration for this filter if any is provided
  const config = filterConfig?.fields?.[filterName] || {};

  // if a mapping function for the values is provided, then apply it
  const mappedValues =
    typeof config?.transformValue === 'function' ? values.map(config.transformValue) : values;

  const serializedValues = mappedValues
    .filter((v) => typeof v !== 'undefined') // remove undefined values
    .map((value) => serializeValue({ value, config, filterName, errors }))
    .filter((v) => typeof v !== 'undefined'); // remove filters that couldn't be parsed

  if (serializedValues.length === 0) return;
  const singleOrListValues = config.singleValue ? serializedValues[0] : serializedValues;

  return {
    name: config?.defaultKey || filterName,
    values: singleOrListValues,
  };
}

function serializeValue({
  value,
  config,
  filterName,
  errors,
}: {
  value: any;
  config: any;
  filterName: string;
  errors: ErrorType[];
}): string | boolean | number | undefined {
  // if already string or value, then simply return as is
  const type = value?.type || config?.defaultType || 'equals';
  const v1Types = config?.v1?.supportedTypes || ['equals'];

  // test that the type is compatible with API v1
  if (!v1Types.includes(type)) {
    errors.push({
      errorType: 'INVALID_PREDICATE_TYPE',
      filterName,
      type,
    });
    return;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'object' && value !== null) {
    //serlialize object if known type
    if (['equals', 'fuzzy', 'like', 'within'].includes(type)) {
      return value.value;
    } else if (type === 'range') {
      // if a range query, then transform to string format
      return `${value.value.gte || value.value.gt || '*'},${
        value.value.lte || value.value.lgt || '*'
      }`;
    } else if (type === 'geoDistance') {
      // if a geoDistance query, then transform to string format
      return `${value.latitude},${value.longitude},${value.distance}`;
    } else {
      errors.push({
        errorType: 'UNKNOWN_PREDICATE_TYPE',
        filterName,
        type,
      });
      return;
    }
  } else {
    errors.push({
      errorType: 'UNKNOWN_PREDICATE_VALUE_FORMAT',
      filterName,
      type,
    });
    return;
  }
}
