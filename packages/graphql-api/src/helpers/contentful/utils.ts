import { z } from "zod";

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
