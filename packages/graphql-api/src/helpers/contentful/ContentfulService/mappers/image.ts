import { z } from "zod";
import { Asset } from "../../contentTypes/asset";
import { DataMapper, createContentfulMapper } from "./_shared";

export const contentfulAssetMapper: DataMapper<Asset> = createContentfulMapper({
    contentType: 'Asset',
    fields: z.object({
        title: z.string(),
        description: z.string().optional(),
        file: z.object({
            url: z.string(),
            details: z.object({
                size: z.number(),
                image: z.object({
                    width: z.number(),
                    height: z.number()
                }).optional(),
            }),
            fileName: z.string(),
            contentType: z.string(),
        })
    }),
    map: dto => ({
        contentType: 'asset',
        id: dto.sys.id,
        title: dto.fields.title,
        description: dto.fields.description,
        file: {
            url: dto.fields.file.url,
            details: {
                size: dto.fields.file.details.size,
                width: dto.fields.file.details.image?.width,
                height: dto.fields.file.details.image?.height,
            },
            fileName: dto.fields.file.fileName,
            contentType: dto.fields.file.contentType,
        }
    })
});