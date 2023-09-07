import { z } from "zod";
import { Image, Link } from "../../entities/_shared";
import { pickLanguage } from "../../utils";

export const ElasticSearchLinkSchema = z.object({
    id: z.string(),
    label: z.record(z.string(), z.string()),
    url: z.record(z.string(), z.string()),
})

export const ElasticSearchImageSchema = z.object({
    file: z.record(
        z.string(),
        z.object({
            url: z.string(),
            details: z.object({
                size: z.number(),
                image: z.object({ width: z.number(), height: z.number() })
            }),
            fileName: z.string(),
            contentType: z.string()
        })
    ),
    description: z.record(z.string(), z.string()).optional(),
    title: z.record(z.string(), z.string()).optional(),
});

export const ElasticSearchDocumentSchema = z.object({
    file: z.record(
        z.string(),
        z.object({
            url: z.string(),
            details: z.object({
                size: z.number(),
            }),
            fileName: z.string(),
            contentType: z.string()
        })
    ),
    description: z.record(z.string(), z.string()).optional(),
    title: z.record(z.string(), z.string()).optional(),
});

export function parseElasticSearchImageDTO(imageDto: z.infer<typeof ElasticSearchImageSchema>): Image {
    return {
        title: imageDto.title == null ? undefined : pickLanguage(imageDto.title),
        description: imageDto.description == null ? undefined : pickLanguage(imageDto.description),
        file: {
            url: pickLanguage(imageDto.file).url,
            details: {
                size: pickLanguage(imageDto.file).details.size,
                width: pickLanguage(imageDto.file).details.image.width,
                height: pickLanguage(imageDto.file).details.image.height,
            },
            fileName: pickLanguage(imageDto.file).fileName,
            contentType: pickLanguage(imageDto.file).contentType,
        },
    }
}

export function parseElasticSearchLinkDTO(linkDto: z.infer<typeof ElasticSearchLinkSchema>): Link {
    return {
        label: pickLanguage(linkDto.label),
        url: pickLanguage(linkDto.url),
    }
}