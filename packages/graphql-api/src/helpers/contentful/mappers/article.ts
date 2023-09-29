import { z } from "zod";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, createElasticSearchMapper, localized, parseElasticSearchAssetDTO, parseElasticSearchLinkDTO } from "./_shared";
import { Asset } from "../contentTypes/asset";
import { Link } from "../contentTypes/link";
import { pickLanguage } from "../languages";
import { Topic } from "../contentTypes/topic";
import { Purpose } from "../contentTypes/purpose";
import { Audience } from "../contentTypes/audience";

type Article = {
    contentType: 'article';
    id: string;
    title: string;
    summary?: string;
    body: string;
    primaryImage?: Asset;
    secondaryLinks: Link[];
    documents: Asset[];
    citation?: string;
    topics: Topic[];
    purposes: Purpose[];
    audiences: Audience[];
    keywords: string[];
    searchable: boolean;
    displayDate?: boolean;
    articleType?: string;
    urlAlias?: string;
}

const ArticleSchema = z.object({
    contentType: z.literal('article'),
    id: z.string(),
    title: localized(z.string()),
    summary: localized(z.string()).optional(),
    body: localized(z.string()),
    primaryImage: ElasticSearchAssetSchema.optional(),
    secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
    documents: z.array(ElasticSearchAssetSchema).optional(),
    citation: z.string().optional(),
    topics: z.array(z.string()).optional(),
    purposes: z.array(z.string()).optional(),
    audiences: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean(),
    displayDate: z.boolean().optional(),
    articleType: z.string().optional(),
    urlAlias: z.string().optional(),
});

function parseArticleDTO(dto: z.infer<typeof ArticleSchema>, language?: string): Article {
    return {
        contentType: 'article',
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchAssetDTO(dto.primaryImage),
        secondaryLinks: dto.secondaryLinks?.map(l => parseElasticSearchLinkDTO(l, language)) ?? [],
        documents: dto.documents?.map(d => parseElasticSearchAssetDTO(d)) ?? [],
        citation: dto.citation,
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
        displayDate: dto.displayDate,
        articleType: dto.articleType,
        urlAlias: dto.urlAlias,
    }
}

export const elasticSearchArticleMapper: DataMapper<Article> = createElasticSearchMapper({
    contentType: 'article',
    fields: ArticleSchema,
    map: (dto, language) => ({
        contentType: 'article',
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchAssetDTO(dto.primaryImage),
        secondaryLinks: dto.secondaryLinks?.map(l => parseElasticSearchLinkDTO(l, language)) ?? [],
        documents: dto.documents?.map(d => parseElasticSearchAssetDTO(d)) ?? [],
        citation: dto.citation,
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
        displayDate: dto.displayDate,
        articleType: dto.articleType,
        urlAlias: dto.urlAlias,
    }),
})