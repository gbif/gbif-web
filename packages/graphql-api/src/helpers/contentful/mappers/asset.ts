import { z } from "zod";
import { localized } from "./_shared";
import { pickLanguage } from "../languages";

export const assetContentType = 'asset';

export type Asset = {
    contentType: typeof assetContentType;
    description?: string;
    title?: string;
    file: {
        url: string;
        details: {
            size: number;
            width?: number;
            height?: number;
        };
        fileName: string;
        contentType: string;
    };
}

export const AssetDTOSchema = z.object({
    description: localized(z.string().nullable()).optional(),
    title: localized(z.string()).optional(),
    file: localized(z.object({
        url: z.string(),
        details: z.object({
            size: z.number(),
            image: z.object({ width: z.number(), height: z.number() }).optional(),
        }),
        fileName: z.string(),
        contentType: z.string()
    })),
});

export function parseAssetDTO(dto: z.infer<typeof AssetDTOSchema>, language?: string): Asset {
    const file = pickLanguage(dto.file, language);
    const title = pickLanguage(dto.title, language);

    return {
        contentType: assetContentType,
        title: dto.title == null ? undefined : pickLanguage(dto.title, language),
        description: dto.description == null ? undefined : (pickLanguage(dto.description, language) ?? undefined),
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
