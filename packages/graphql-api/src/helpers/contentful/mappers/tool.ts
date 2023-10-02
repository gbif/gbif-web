import { z } from "zod";
import { pickLanguage } from "../languages";
import { DateAsStringSchema } from "../utils";
import { Mapper, localized } from "./_shared";
import { Asset, AssetDTOSchema, parseAssetDTO } from "./asset";
import { Link, LinkDTOSchema, parseLinkDTO } from "./link";

export const toolContentType = 'tool';

export type Tool = {
    contentType: typeof toolContentType;
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: Asset;
    primaryLink?: Link;
    secondaryLinks: Link[];
    documents: Asset[];
    citation?: string;
    author?: string;
    rights?: string;
    rightsHolder?: string;
    publicationDate?: Date;
    keywords: string[];
    searchable: boolean;
    homepage?: boolean;
    machineIdentifier?: string;
}

export const ToolDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    summary: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    primaryImage: AssetDTOSchema.optional(),
    primaryLink: LinkDTOSchema.optional(),
    secondaryLinks: z.array(LinkDTOSchema).optional(),
    documents: z.array(AssetDTOSchema).optional(),
    citation: z.string().optional(),
    author: z.string().optional(),
    rights: z.string().optional(),
    rightsHolder: z.string().optional(),
    publicationDate: DateAsStringSchema.optional(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean(),
    homepage: z.boolean().optional(),
    machineIdentifier: z.string().optional(),
});

export function parseToolDTO(dto: z.infer<typeof ToolDTOSchema>, language?: string): Tool {
    return {
        contentType: toolContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseAssetDTO(dto.primaryImage),
        primaryLink: dto.primaryLink == null ? undefined : parseLinkDTO(dto.primaryLink, language),
        secondaryLinks: dto.secondaryLinks?.map(l => parseLinkDTO(l, language)) ?? [],
        documents: dto.documents?.map(d => parseAssetDTO(d)) ?? [],
        citation: dto.citation,
        author: dto.author,
        rights: dto.rights,
        rightsHolder: dto.rightsHolder,
        publicationDate: dto.publicationDate,
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
        machineIdentifier: dto.machineIdentifier,
    };
}

export const toolMapper: Mapper<Tool, typeof ToolDTOSchema> = {
    contentType: toolContentType,
    Schema: ToolDTOSchema,
    map: parseToolDTO,
}