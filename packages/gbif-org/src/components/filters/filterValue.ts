// Shapes of the non-primitive values stored in a filter's must/mustNot lists.
export type RangeBound = 'gte' | 'gt' | 'lte' | 'lt';
export type RangeBounds = Partial<Record<RangeBound, string | number>>;

export type RangeFilterValue = { type: 'range'; value: RangeBounds };
export type SingleFilterValue = {
  type: 'equals' | 'like' | 'greaterThan' | 'greaterThanOrEquals' | 'lessThan' | 'lessThanOrEquals';
  value: string | number;
};
export type ExistenceFilterValue = { type: 'isNull' | 'isNotNull' };

export type FilterValueObject = RangeFilterValue | SingleFilterValue | ExistenceFilterValue;

export function isFilterValueObject(value: unknown): value is FilterValueObject {
  return typeof value === 'object' && value !== null && 'type' in value;
}

export function isRangeFilterValue(value: unknown): value is RangeFilterValue {
  return isFilterValueObject(value) && value.type === 'range';
}

// 0 is a valid bound, so presence can't be tested with truthiness
export function isPresentBound(
  bound: string | number | undefined | null
): bound is string | number {
  return bound !== undefined && bound !== null && bound !== '';
}
