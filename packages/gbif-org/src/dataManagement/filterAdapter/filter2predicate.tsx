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
  singleValue?: boolean;
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
  const { must, mustNot } = filter;

  const positive = getPredicates({ filters: must, filterConfig });
  const negated = getPredicates({ filters: mustNot, filterConfig }).map(
    (p): Predicate => ({ type: PredicateType.Not, predicate: p })
  );

  const predicates = positive.concat(negated);

  if (predicates.length === 1) {
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
}: {
  filters: Record<string, any[]> | null | undefined;
  filterConfig?: FilterConfigType;
}): Predicate[] {
  if (!filters) return [];
  return Object.entries(filters)
    .map(([filterName, values]) => getPredicate({ filterName, values, filterConfig }))
    .filter((p) => p !== null); // remove filters that couldn't be transformed to a predicate
}

function getPredicate({
  filterName,
  values = [],
  filterConfig,
}: {
  filterName: string;
  values: any[];
  filterConfig?: FilterConfigType;
}): Predicate | null {
  // get the configuration for this filter if any is provided
  const config = filterConfig?.fields?.[filterName] ?? {};

  // if a custom serializer is specified then use that
  if (config.serializer) {
    return config.serializer({ filterName, values, config });
  }

  // if no values or an empty array is provided, then there it no predicates to create
  if (Array.isArray(values) && values?.length === 0) return null;

  // if a mapping function for the values is provided, then apply it
  let mappedValues =
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
      };
    }
  }

  // the values are mixed or complex. Create an or if length > 1
  let predicates = mappedValues
    .map((value) => getPredicateFromSingleValue({ filterName, value, config }))
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
}: {
  filterName: string;
  value: any;
  config: FieldConfigType;
}): Predicate | null {
  // the values are expected to be either a predicate object (optionally missing key and type)
  // or a string/number
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return {
      type: config?.defaultType || PredicateType.Equals,
      //if no default key is provided, then fall back to the filterName as a key
      key: config?.defaultKey || filterName,
      value: value,
    };
  } else if (typeof value === 'object' && value !== null) {
    if (value.type === 'geoDistance') {
      return value;
    }
    return {
      type: config?.defaultType || PredicateType.Equals,
      key: config?.defaultKey || filterName,
      ...value, // overwrite type and key if it is defined in the value object
    };
  } else {
    console.warn('Invalid filter provided. It will be ignored. Provided: ', value);
    return null;
  }
}
