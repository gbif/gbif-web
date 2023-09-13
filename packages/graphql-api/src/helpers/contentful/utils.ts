import { z } from "zod";
import { performance } from 'perf_hooks';

export function pickLanguage<T>(data: Record<string, T>, language?: string): T {
  // Try to get the specified translation
  if (language != null && data[language] != null) return data[language];

  // Get the english translation or the first available translation
  return data["en-GB"] ?? data[Object.keys(data)[0]];
}

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

export async function timeExecution<T>(
  asyncFn: () => Promise<T>,
  shouldLog: boolean = true,
  logMessage: string = 'Time taken'
): Promise<T> {
  let result: T;

  const startTime = performance.now();

  try {
    result = await asyncFn();
  } catch (error) {
    // Rethrow the error after logging (if logging is enabled)
    if (shouldLog) {
      const endTime = performance.now();
      console.error(`${logMessage}: ${(endTime - startTime).toFixed(2)} ms`);
    }
    throw error;
  }

  if (shouldLog) {
    const endTime = performance.now();
    console.log(`${logMessage}: ${(endTime - startTime).toFixed(2)} ms`);
  }

  return result;
}

export function toConstCase(str: string): string {
  return str
    // Replace any non-letter or non-number characters with a space
    .replace(/[^a-zA-Z0-9]/g, ' ')
    // Trim any leading or trailing spaces
    .trim()
    // Convert the string to uppercase
    .toUpperCase()
    // Replace any spaces with underscores
    .replace(/ +/g, '_');
}