export function toRecord<T, K extends string | number | symbol>(
  array: T[],
  key: (item: T) => K
): Record<K, T> {
  return array.reduce(
    (acc, item) => {
      acc[key(item)] = item;
      return acc;
    },
    {} as Record<K, T>
  );
}
