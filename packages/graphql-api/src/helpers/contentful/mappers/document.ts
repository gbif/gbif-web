import { z } from "zod";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, createElasticSearchMapper, localized } from "./_shared";

type Document = {
    contentType: 'document';
    id: string;
}

export const elasticSearchDocumentMapper: DataMapper<Document> = createElasticSearchMapper({
    contentType: 'document',
    fields: z.object({
        id: z.string(),
        title: localized(z.string()),
        summary: localized(z.string()).optional(),
        body: localized(z.string()).optional(),
        document: ElasticSearchAssetSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        citation: localized(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
    }),
    map: (dto, language) => ({
        contentType: 'document',
        id: dto.id,
    }),
});