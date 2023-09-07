import { z } from "zod";
import { ElasticSearchImageSchema, ElasticSearchLinkSchema, parseElasticSearchImageDTO, parseElasticSearchLinkDTO } from "./_shared";
import { News } from "../../entities/news";
import { pickLanguage } from "../../utils";

export const ElasticSearchNewsDTOSchema = z.object({
    contentType: z.literal('news'),
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
});

export function parseElasticSearchNewsDTO(newsDto: z.infer<typeof ElasticSearchNewsDTOSchema>): News {
    return {
        contentType: 'news',
        id: newsDto.id,
        title: pickLanguage(newsDto.title),
        summary: newsDto.summary == null ? undefined : pickLanguage(newsDto.summary),
        body: newsDto.body == null ? undefined : pickLanguage(newsDto.body),
        primaryImage: newsDto.primaryImage == null ? undefined : parseElasticSearchImageDTO(newsDto.primaryImage),
        primaryLink: newsDto.primaryLink == null ? undefined : parseElasticSearchLinkDTO(newsDto.primaryLink),
        secondaryLinks: newsDto.secondaryLinks?.map(parseElasticSearchLinkDTO) ?? [],
        citation: newsDto.citation,
        countriesOfCoverage: newsDto.countriesOfCoverage ?? [],
        topics: newsDto.topics ?? [],
        purposes: newsDto.purposes ?? [],
        audiences: newsDto.audiences ?? [],
        keywords: newsDto.keywords ?? [],
        searchable: newsDto.searchable,
        homepage: newsDto.homepage,
    }
}