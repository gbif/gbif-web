export function notNull<T>(value: T | null | undefined): value is NonNullable<T> {
  return value != null;
}
