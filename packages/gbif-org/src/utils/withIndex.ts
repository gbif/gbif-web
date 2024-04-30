export function withIndex<T extends Record<string, unknown>>(arr: T[]): (T & { idx: number })[] {
  return arr.map((v, idx) => ({ ...v, idx }));
}
