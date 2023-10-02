import { z } from "zod";
import { pickLanguage } from "../languages";
import { Mapper, localized } from "./_shared";
import { Asset, AssetDTOSchema, parseAssetDTO } from "./asset";
import { Link, LinkDTOSchema, parseLinkDTO } from "./link";

export const documentContentType = 'document';

export type Document = {
    contentType: typeof documentContentType;
    id: string;
    title: string;
    summary?: string;
    body?: string;
    document?: Asset;
    primaryLink?: Link;
    citation?: string;
    keywords: string[];
    searchable: boolean;
}

export const DocumentDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    summary: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    document: AssetDTOSchema.optional(),
    primaryLink: LinkDTOSchema.optional(),
    citation: localized(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean(),
});

export function parseDocumentDTO(dto: z.infer<typeof DocumentDTOSchema>, language?: string): Document {
    return {
        contentType: documentContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        document: dto.document == null ? undefined : parseAssetDTO(dto.document),
        primaryLink: dto.primaryLink == null ? undefined : parseLinkDTO(dto.primaryLink, language),
        citation: dto.citation == null ? undefined : pickLanguage(dto.citation, language),
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
    }
}

export const documentMapper: Mapper<Document, typeof DocumentDTOSchema> = {
    contentType: documentContentType,
    Schema: DocumentDTOSchema,
    map: parseDocumentDTO,
}