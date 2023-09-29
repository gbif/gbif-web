import { z } from "zod";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, createElasticSearchMapper, localized } from "./_shared";
import { DateAsStringSchema } from "../utils";

type Tool = {
    contentType: 'tool';
    id: string;
}

export const elasticSearchToolMapper: DataMapper<Tool> = createElasticSearchMapper({
    contentType: 'tool',
    fields: z.object({
        id: z.string(),
        title: localized(z.string()),
        summary: localized(z.string()).optional(),
        body: localized(z.string()).optional(),
        primaryImage: ElasticSearchAssetSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
        documents: z.array(ElasticSearchAssetSchema).optional(),
        citation: z.string().optional(),
        author: z.string().optional(),
        rights: z.string().optional(),
        rightsHolder: z.string().optional(),
        publicationDate: DateAsStringSchema.optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
        homepage: z.boolean().optional(),
        machineIdentifier: z.string().optional(),
    }),
    map: (dto, language) => ({
        contentType: 'tool',
        id: dto.id,
    }),
});