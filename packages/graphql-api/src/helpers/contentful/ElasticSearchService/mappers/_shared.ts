import { z } from "zod";
import { Link } from "../../contentTypes/link";
import { Asset } from "../../contentTypes/asset";
import { pickLanguage } from "../../utils";

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

export function parseElasticSearchAssetDTO(imageDto: z.infer<typeof ElasticSearchAssetSchema>): Asset {
    return {
        contentType: 'asset',
        title: imageDto.title == null ? undefined : pickLanguage(imageDto.title),
        description: imageDto.description == null ? undefined : pickLanguage(imageDto.description),
        file: {
            url: pickLanguage(imageDto.file).url,
            details: {
                size: pickLanguage(imageDto.file).details.size,
                width: pickLanguage(imageDto.file).details.image?.width,
                height: pickLanguage(imageDto.file).details.image?.height,
            },
            fileName: pickLanguage(imageDto.file).fileName,
            contentType: pickLanguage(imageDto.file).contentType,
        },
    }
}

export function parseElasticSearchLinkDTO(linkDto: z.infer<typeof ElasticSearchLinkSchema>): Link {
    return {
        contentType: 'link',
        label: pickLanguage(linkDto.label),
        url: pickLanguage(linkDto.url),
    }
}

export interface DataMapper<T> {
    contentType: string;
    parse: (dto: unknown) => T | null;
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
                console.error(`Failed to parse ElasticSearch DTO of type '${config.contentType}'`, result.error);
                return null;
            }

            // Otherwise, map the DTO to the entity
            return config.map(result.data);
        }
    }
}