import { z } from "zod";
import { Mapper, localized } from "./_shared";
import { Asset, AssetDTOSchema, parseAssetDTO } from "./asset";
import { LinkDTOSchema, parseLinkDTO, Link } from "./link";
import { pickLanguage } from "../languages";

export const articleContentType = 'article';

export type Article = {
    contentType: typeof articleContentType;
    id: string;
    title: string;
    summary?: string;
    body: string;
    primaryImage?: Asset;
    secondaryLinks: Link[];
    documents: Asset[];
    citation?: string;
    topics: string[];
    purposes: string[];
    audiences: string[];
    keywords: string[];
    searchable: boolean;
    displayDate?: boolean;
    articleType?: string;
    urlAlias?: string;
}

export const ArticleDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    summary: localized(z.string()).optional(),
    body: localized(z.string()),
    primaryImage: AssetDTOSchema.optional(),
    secondaryLinks: z.array(LinkDTOSchema).optional(),
    documents: z.array(AssetDTOSchema).optional(),
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

export function parseArticleDTO(dto: z.infer<typeof ArticleDTOSchema>, language?: string): Article {
    return {
        contentType: articleContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseAssetDTO(dto.primaryImage),
        secondaryLinks: dto.secondaryLinks?.map(l => parseLinkDTO(l, language)) ?? [],
        documents: dto.documents?.map(d => parseAssetDTO(d)) ?? [],
        citation: dto.citation,
        topics: dto.topics ?? [],
        purposes: dto.purposes ?? [],
        audiences: dto.audiences ?? [],
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        displayDate: dto.displayDate,
        articleType: dto.articleType,
        urlAlias: dto.urlAlias,
    }
}

export const articleMapper: Mapper<Article, typeof ArticleDTOSchema> = {
    contentType: articleContentType,
    Schema: ArticleDTOSchema,
    map: parseArticleDTO,
}