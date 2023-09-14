import { z } from "zod";
import { pickLanguage } from "../utils";
import { DataUse } from "../contentTypes/dataUse";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, parseElasticSearchAssetDTO, parseElasticSearchLinkDTO, createElasticSearchMapper } from "./_shared";

export const elasticSearchDataUseMapper: DataMapper<DataUse> = createElasticSearchMapper({
    contentType: 'dataUse',
    fields: z.object({
        id: z.string(),
        title: z.record(z.string(), z.string()),
        summary: z.record(z.string(), z.string()).optional(),
        body: z.record(z.string(), z.string()).optional(),
        primaryImage: ElasticSearchAssetSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
        citation: z.string().optional(),
        resourceUsed: z.record(z.string(), z.string()).optional(),
        countriesOfResearcher: z.array(z.string()).optional(),
        countriesOfCoverage: z.array(z.string()).optional(),
        topics: z.array(z.string()).optional(),
        purposes: z.array(z.string()).optional(),
        audiences: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean().optional().default(false),
        homepage: z.boolean().optional().default(false),
    }),
    map: dto => ({
        contentType: 'dataUse',
        id: dto.id,
        title: pickLanguage(dto.title),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary),
        body: dto.body == null ? undefined : pickLanguage(dto.body),
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchAssetDTO(dto.primaryImage),
        primaryLink: dto.primaryLink == null ? undefined : parseElasticSearchLinkDTO(dto.primaryLink),
        secondaryLinks: dto.secondaryLinks?.map(parseElasticSearchLinkDTO) ?? [],
        citation: dto.citation,
        resourceUsed: dto.resourceUsed == null ? undefined : pickLanguage(dto.resourceUsed),
        countriesOfResearchers: dto.countriesOfResearcher ?? [],
        countriesOfCoverage: dto.countriesOfCoverage ?? [],
        topics: dto.topics?.map(topic => ({
            contentType: 'topic',
            term: topic,
        })) ?? [],
        purposes: dto.purposes?.map(purpose => ({
            contentType: 'purpose',
            term: purpose,
        })) ?? [],
        audiences: dto.audiences?.map(audience => ({
            contentType: 'audience',
            term: audience,
        })) ?? [],
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
    })
})