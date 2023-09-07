import { z } from "zod";
import { pickLanguage } from "../../utils";
import { DataUse } from "../../entities/dataUse";
import { ElasticSearchImageSchema, ElasticSearchLinkSchema, parseElasticSearchImageDTO, parseElasticSearchLinkDTO } from "./_shared";

export const ElasticSearchDataUseDTOSchema = z.object({
    contentType: z.literal('dataUse'),
    id: z.string(),
    title: z.record(z.string(), z.string()),
    summary: z.record(z.string(), z.string()).optional(),
    body: z.record(z.string(), z.string()).optional(),
    primaryImage: ElasticSearchImageSchema.optional(),
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
});

export function parseElasticSearchDataUseDTO(dataUseDTO: z.infer<typeof ElasticSearchDataUseDTOSchema>): DataUse {
    return {
        contentType: 'dataUse',
        id: dataUseDTO.id,
        title: pickLanguage(dataUseDTO.title),
        summary: dataUseDTO.summary == null ? undefined : pickLanguage(dataUseDTO.summary),
        body: dataUseDTO.body == null ? undefined : pickLanguage(dataUseDTO.body),
        primaryImage: dataUseDTO.primaryImage == null ? undefined : parseElasticSearchImageDTO(dataUseDTO.primaryImage),
        primaryLink: dataUseDTO.primaryLink == null ? undefined : parseElasticSearchLinkDTO(dataUseDTO.primaryLink),
        secondaryLinks: dataUseDTO.secondaryLinks?.map(parseElasticSearchLinkDTO) ?? [],
        citation: dataUseDTO.citation,
        resourceUsed: dataUseDTO.resourceUsed == null ? undefined : pickLanguage(dataUseDTO.resourceUsed),
        countriesOfResearchers: dataUseDTO.countriesOfResearcher ?? [],
        countriesOfCoverage: dataUseDTO.countriesOfCoverage ?? [],
        topics: dataUseDTO.topics ?? [],
        purposes: dataUseDTO.purposes ?? [],
        audiences: dataUseDTO.audiences ?? [],
        keywords: dataUseDTO.keywords ?? [],
        searchable: dataUseDTO.searchable,
        homepage: dataUseDTO.homepage,
    }
}