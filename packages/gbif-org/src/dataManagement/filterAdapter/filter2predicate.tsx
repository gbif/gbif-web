import { FilterType } from '@/contexts/filter';
import { Predicate, PredicateType } from '@/gql/graphql';
import get from 'lodash/get';

type FieldConfigType = {
  defaultType?: PredicateType;
  defaultKey?: string;
  transformValue?: (value: any) => any;
  serializer?: ({
    filterName,
    values,
    config,
  }: {
    filterName: string;
    values: any[];
    config: FieldConfigType;
  }) => any;
};

export type FieldType = {
  defaultType?: PredicateType;
  defaultKey?: string;
  takesChecklistKey?: boolean;
  singleValue?: boolean;
  hoist?: boolean; // for use with q param since the occurrence predicate API do not support fuzzy matching, but consider it a distinct parameter
  transformValue?: (value: any) => any;
  serializer?: ({
    filterName,
    values,
    config,
  }: {
    filterName: string;
    values: any[];
    config: FieldConfigType;
  }) => Predicate | null;
  v1?: {
    supportedTypes?: string[];
  };
};

export type FilterConfigType = {
  preFilterTransform?: (filter: FilterType) => FilterType;
  // Applied ONLY in the URL layer (useFilterParams), not in predicate/v1 building. Lets a
  // filter use a different, more readable URL representation than its in-memory shape:
  // urlEncodeFilter runs before serializing to URL params, urlDecodeFilter after parsing them.
  urlEncodeFilter?: (filter: FilterType) => FilterType;
  urlDecodeFilter?: (filter: FilterType) => FilterType;
  fields?: {
    [key: string]: FieldType;
  };
};

export function filter2predicate(
  filter: FilterType | undefined | null,
  filterConfig?: FilterConfigType
): Predicate | null {
  if (!filter) return null;
  if (filterConfig?.preFilterTransform) {
    filter = filterConfig?.preFilterTransform(filter);
  }
  const { must, mustNot, checklistKey } = filter;
  const positive = getPredicates({ filters: must, filterConfig, checklistKey });
  const negated = getNegatedPredicates({ filters: mustNot, filterConfig, checklistKey });

  const predicates = positive.concat(negated);

  if (predicates.length === 0) {
    return null;
  } else if (predicates.length === 1) {
    return predicates[0];
  } else {
    return {
      type: PredicateType.And,
      predicates,
    };
  }
}

function getPredicates({
  filters,
  filterConfig,
  checklistKey,
}: {
  filters: Record<string, any[]> | null | undefined;
  filterConfig?: FilterConfigType;
  checklistKey?: string;
}): Predicate[] {
  if (!filters) return [];
  return Object.entries(filters)
    .map(([filterName, values]) => getPredicate({ filterName, values, filterConfig, checklistKey }))
    .filter((p) => p !== null); // remove filters that couldn't be transformed to a predicate
}

// The API leaves out records where the field is empty when a predicate is negated. So excluding
// a value would also drop every record without any value for that field. To make an exclusion
// mean "everything but these values", records where the field is null are added back.
function getNegatedPredicates({
  filters,
  filterConfig,
  checklistKey,
}: {
  filters: Record<string, unknown[]> | null | undefined;
  filterConfig?: FilterConfigType;
  checklistKey?: string;
}): Predicate[] {
  if (!filters) return [];
  return Object.entries(filters)
    .map(([filterName, values]): Predicate | null => {
      const predicate = getPredicate({ filterName, values, filterConfig, checklistKey });
      if (!predicate) return null;
      const negated: Predicate = { type: PredicateType.Not, predicate };

      const config = filterConfig?.fields?.[filterName] ?? {};
      // custom serializers build their own predicate, and existence or distance values can't be
      // combined with a null check in a meaningful way, so those are negated as they are
      const hasSpecialValue = values?.some(
        (value) =>
          typeof value === 'object' &&
          value !== null &&
          ['isNull', 'isNotNull', 'geoDistance'].includes((value as { type?: string }).type ?? '')
      );
      if (config.serializer || hasSpecialValue) return negated;

      return {
        type: PredicateType.Or,
        predicates: [
          {
            type: PredicateType.IsNull,
            key: config.defaultKey || filterName,
            ...(config.takesChecklistKey && checklistKey ? { checklistKey } : {}),
          },
          negated,
        ],
      };
    })
    .filter((p): p is Predicate => p !== null);
}

function getPredicate({
  filterName,
  values = [],
  filterConfig,
  checklistKey,
}: {
  filterName: string;
  values: any[];
  filterConfig?: FilterConfigType;
  checklistKey?: string;
}): Predicate | null {
  // get the configuration for this filter if any is provided
  const config = filterConfig?.fields?.[filterName] ?? {};

  // if a custom serializer is specified then use that
  if (config.serializer) {
    return config.serializer({ filterName, values, config, checklistKey });
  }

  // if no values or an empty array is provided, then there it no predicates to create
  if (Array.isArray(values) && values?.length === 0) return null;

  // if a mapping function for the values is provided, then apply it
  const mappedValues =
    typeof config?.transformValue === 'function' ? values.map(config.transformValue) : values;

  // if the default type is equals or undefined then we might be able to create an 'in' predicate
  if (get(config, 'defaultType', 'equals') === 'equals') {
    // if all the provided values are string or numbers, then we can create an 'in' predicate
    if (mappedValues.every((x) => typeof x === 'string' || typeof x === 'number')) {
      return {
        type: PredicateType.In,
        //if no default key is provided, then fall back to the filterName as a key
        key: config.defaultKey || filterName,
        values: mappedValues,
        ...(config.takesChecklistKey && checklistKey ? { checklistKey } : {}),
      };
    }
  }

  // the values are mixed or complex. Create an or if length > 1
  const predicates = mappedValues
    .map((value) => getPredicateFromSingleValue({ filterName, value, config, checklistKey }))
    .filter((p) => p); // remove filters that couldn't be transformed to a predicate
  if (predicates.length === 1) {
    return predicates[0];
  } else {
    return {
      type: PredicateType.Or,
      predicates,
    };
  }
}

function getPredicateFromSingleValue({
  filterName,
  value,
  config,
  checklistKey,
}: {
  filterName: string;
  value: any;
  config: FieldConfigType;
  checklistKey?: string;
}): Predicate | null {
  // the values are expected to be either a predicate object (optionally missing key and type)
  // or a string/number
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return {
      type: config?.defaultType || PredicateType.Equals,
      //if no default key is provided, then fall back to the filterName as a key
      key: config?.defaultKey || filterName,
      value: value,
      ...(checklistKey ? { checklistKey } : {}),
    };
  } else if (typeof value === 'object' && value !== null) {
    if (value.type === 'geoDistance') {
      return value;
    }
    return {
      type: config?.defaultType || PredicateType.Equals,
      key: config?.defaultKey || filterName,
      ...value, // overwrite type and key if it is defined in the value object
      ...(checklistKey ? { checklistKey } : {}),
    };
  } else {
    console.warn('Invalid filter provided. It will be ignored. Provided: ', value);
    return null;
  }
}
