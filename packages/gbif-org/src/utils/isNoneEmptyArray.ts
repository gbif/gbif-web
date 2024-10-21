export function isNoneEmptyArray<T>(value?: undefined | null | T[]): value is T[] {
  return Array.isArray(value) && value.length > 0;
}
