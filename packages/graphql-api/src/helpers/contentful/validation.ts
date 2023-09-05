import { z } from "zod";

export const ContentfulReferenceSchema = z.object({
    sys: z.object({
        type: z.string(),
        linkType: z.string(),
        id: z.string()
    })
});

export const ContentfulErrorSchema = z.object({
    sys: z.object({ type: z.string(), id: z.string() }),
    message: z.string(),
    details: z.object({
        type: z.string(),
        id: z.string(),
        environment: z.string(),
        space: z.string()
    }),
    requestId: z.string()
});

export const DateAsStringSchema = z.string()
    .refine(value => !isNaN(Date.parse(value)), {
        message: 'Invalid date',
    }).transform(value => new Date(value));