import { z } from "zod"

export const ContentfulReferenceSchema = z.object({
  sys: z.object({
      type: z.string(),
      linkType: z.string(),
      id: z.string()
  })
});

export const DateAsStringSchema = z.string()
    .refine(value => !isNaN(Date.parse(value)), {
        message: 'Invalid date',
    }).transform(value => new Date(value));
