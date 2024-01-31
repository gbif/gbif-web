export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0;
}
