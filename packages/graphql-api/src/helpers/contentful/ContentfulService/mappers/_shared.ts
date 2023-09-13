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


export interface DataMapper<T> {
    contentType: string;
    parse: (dto: unknown) => T | null;
}

function createSchema<TContentType extends string, TFields extends z.ZodObject<any>>(contentType: TContentType, fields: TFields) {
    return z.object({
        sys: z.union([
            z.object({
                id: z.string(),
                contentType: z.object({
                    sys: z.object({
                        id: z.literal(contentType)
                    })
                })
            }),
            z.object({
                id: z.string(),
                type: z.literal(contentType)
            }),
        ]),
        fields,
    })
}

export function createContentfulMapper<
    TResult,
    TContentType extends string,
    TFields extends z.ZodObject<any>,
    TSchema extends ReturnType<typeof createSchema<TContentType, TFields>>>
    (config: {
        contentType: TContentType,
        fields: TFields,
        map: (dto: z.infer<TSchema>) => TResult
    }
    ): DataMapper<TResult> {
    const Schema = createSchema(config.contentType, config.fields);

    return {
        contentType: config.contentType,
        parse: (dto: unknown): TResult | null => {
            // Try to parse the DTO
            const result = Schema.safeParse(dto);

            // If the DTO is invalid, return null
            if (!result.success) {
                console.error(`Failed to parse Contentful DTO of type '${config.contentType}'`, result.error);
                return null;
            }

            // Otherwise, map the DTO to the entity
            return config.map(result.data);
        }
    }
}

