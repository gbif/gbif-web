import { z } from "zod";
import { DataMapper, ElasticSearchImageSchema, ElasticSearchLinkSchema, parseElasticSearchImageDTO, parseElasticSearchLinkDTO, createElasticSearchMapper } from "./_shared";
import { News } from "../../contentTypes/news";
import { pickLanguage } from "../../utils";

export const elasticSearchNewsMapper: DataMapper<News> = createElasticSearchMapper({
    contentType: 'news',
    fields: z.object({
        id: z.string(),
        title: z.record(z.string(), z.string()),
        summary: z.record(z.string(), z.string()).optional(),
        body: z.record(z.string(), z.string()).optional(),
        primaryImage: ElasticSearchImageSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
        citation: z.string().optional(),
        countriesOfCoverage: z.array(z.string()).optional(),
        topics: z.array(z.string()).optional(),
        purposes: z.array(z.string()).optional(),
        audiences: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean().optional().default(false),
        homepage: z.boolean().optional().default(false),
    }),
    map: dto => ({
        contentType: 'news',
        id: dto.id,
        title: pickLanguage(dto.title),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary),
        body: dto.body == null ? undefined : pickLanguage(dto.body),
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchImageDTO(dto.primaryImage),
        primaryLink: dto.primaryLink == null ? undefined : parseElasticSearchLinkDTO(dto.primaryLink),
        secondaryLinks: dto.secondaryLinks?.map(parseElasticSearchLinkDTO) ?? [],
        citation: dto.citation,
        countriesOfCoverage: dto.countriesOfCoverage ?? [],
        topics: dto.topics ?? [],
        purposes: dto.purposes ?? [],
        audiences: dto.audiences ?? [],
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
    })
})