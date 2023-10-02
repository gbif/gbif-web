import { z } from "zod";
import { pickLanguage } from "../languages";
import { Mapper, localized } from "./_shared";
import { Asset, AssetDTOSchema, parseAssetDTO } from "./asset";
import { Link, LinkDTOSchema, parseLinkDTO } from "./link";

export const dataUseContentType = 'dataUse';

export type DataUse = {
    contentType: typeof dataUseContentType;
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: Asset;
    primaryLink?: Link;
    secondaryLinks: Link[];
    citation?: string;
    resourceUsed?: string;
    // Language codes
    countriesOfResearchers: string[];
    // Language codes
    countriesOfCoverage: string[];
    topics: string[];
    purposes: string[];
    audiences: string[];
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}

export const DataUseDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    summary: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    primaryImage: AssetDTOSchema.optional(),
    primaryLink: LinkDTOSchema.optional(),
    secondaryLinks: z.array(LinkDTOSchema).optional(),
    citation: z.string().optional(),
    resourceUsed: localized(z.string()).optional(),
    countriesOfResearcher: z.array(z.string()).optional(),
    countriesOfCoverage: z.array(z.string()).optional(),
    topics: z.array(z.string()).optional(),
    purposes: z.array(z.string()).optional(),
    audiences: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean(),
    homepage: z.boolean(),
});

export function parseDataUseDTO(dto: z.infer<typeof DataUseDTOSchema>, language?: string): DataUse {
    return {
        contentType: dataUseContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseAssetDTO(dto.primaryImage, language),
        primaryLink: dto.primaryLink == null ? undefined : parseLinkDTO(dto.primaryLink, language),
        secondaryLinks: dto.secondaryLinks?.map(l => parseLinkDTO(l, language)) ?? [],
        citation: dto.citation,
        resourceUsed: dto.resourceUsed == null ? undefined : pickLanguage(dto.resourceUsed, language),
        countriesOfResearchers: dto.countriesOfResearcher ?? [],
        countriesOfCoverage: dto.countriesOfCoverage ?? [],
        topics: dto.topics ?? [],
        purposes: dto.purposes ?? [],
        audiences: dto.audiences ?? [],
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
    }
}

export const datauseMapper: Mapper<DataUse, typeof DataUseDTOSchema> = {
    contentType: dataUseContentType,
    Schema: DataUseDTOSchema,
    map: parseDataUseDTO,
}
