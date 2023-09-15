import { z } from "zod";
import { Link } from "../contentTypes/link";
import { Asset } from "../contentTypes/asset";
import { pickLanguage } from "../languages";

export const ElasticSearchLinkSchema = z.object({
    id: z.string(),
    label: z.record(z.string(), z.string()),
    url: z.record(z.string(), z.string()),
})

export const ElasticSearchAssetSchema = z.object({
    file: z.record(
        z.string(),
        z.object({
            url: z.string(),
            details: z.object({
                size: z.number(),
                image: z.object({ width: z.number(), height: z.number() }).optional(),
            }),
            fileName: z.string(),
            contentType: z.string()
        })
    ),
    description: z.record(z.string(), z.string()).optional(),
    title: z.record(z.string(), z.string()).optional(),
});

export function parseElasticSearchAssetDTO(imageDto: z.infer<typeof ElasticSearchAssetSchema>, language?: string): Asset {
    const file = pickLanguage(imageDto.file, language);

    return {
        contentType: 'asset',
        title: imageDto.title == null ? undefined : pickLanguage(imageDto.title, language),
        description: imageDto.description == null ? undefined : pickLanguage(imageDto.description, language),
        file: {
            url: file.url,
            details: {
                size: file.details.size,
                width: file.details.image?.width,
                height: file.details.image?.height,
            },
            fileName: file.fileName,
            contentType: file.contentType,
        },
    }
}

export function parseElasticSearchLinkDTO(linkDto: z.infer<typeof ElasticSearchLinkSchema>, language?: string): Link {
    return {
        contentType: 'link',
        label: pickLanguage(linkDto.label, language),
        url: pickLanguage(linkDto.url, language),
    }
}

export interface DataMapper<T> {
    contentType: string;
    parse: (dto: unknown, language?: string) => T | null;
}

function createSchema<TContentType extends string, TFields extends z.ZodObject<any>>(contentType: TContentType, fields: TFields) {
    return z.object({
        contentType: z.literal(contentType)
    }).merge(fields)
}

export function createElasticSearchMapper<
    TResult,
    TContentType extends string,
    TFields extends z.ZodObject<any>,
    TSchema extends ReturnType<typeof createSchema<TContentType, TFields>>>
    (config: {
        contentType: TContentType,
        fields: TFields,
        map: (dto: z.infer<TSchema>, language?: string) => TResult
    }
    ): DataMapper<TResult> {
    const Schema = createSchema(config.contentType, config.fields);

    return {
        contentType: config.contentType,
        parse: (dto: unknown, language?: string): TResult | null => {
            // Try to parse the DTO
            const result = Schema.safeParse(dto);

            // If the DTO is invalid, return null
            if (!result.success) {
                console.error(`Failed to parse ElasticSearch DTO of type '${config.contentType}'`, result.error);
                return null;
            }

            // Otherwise, map the DTO to the entity
            return config.map(result.data, language);
        }
    }
}