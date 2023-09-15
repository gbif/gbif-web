import { z } from "zod";

export function nullFilter<T>(value: T | null): value is T {
  return value != null;
}

export const DateAsStringSchema = z.string()
  .refine(value => !isNaN(Date.parse(value)), {
    message: 'Invalid date',
  }).transform(value => new Date(value));


export function objectToQueryString(params: Record<string, string | number | string[] | number[]>): string {
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const element of value) {
        urlParams.append(key, String(element));
      }
    } else {
      urlParams.append(key, String(value));
    }
  }

  return urlParams.toString();
}