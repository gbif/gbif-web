import { z } from "zod";
import { pickLanguage } from "../languages";
import { DateAsStringSchema } from "../utils";
import { CoordinatesSchema, Mapper, localized } from "./_shared";
import { Asset, AssetDTOSchema, parseAssetDTO } from "./asset";
import { Link, LinkDTOSchema, parseLinkDTO } from "./link";

export const eventContentType = 'event';

export type Event = {
    contentType: typeof eventContentType;
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: Asset;
    primaryLink?: Link;
    secondaryLinks: Link[];
    start: Date;
    end?: Date;
    allDayEvent?: boolean;
    // TODO
    organisingParticipants: any[];
    venue?: string;
    location?: string;
    country?: string;
    coordinates?: unknown;
    eventLanguage?: string;
    // Ids of contentful Asset entries
    documents: Asset[];
    attendees?: string;
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}

export const EventDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    summary: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    primaryImage: AssetDTOSchema.optional(),
    primaryLink: LinkDTOSchema.optional(),
    secondaryLinks: z.array(LinkDTOSchema).optional(),
    start: DateAsStringSchema,
    end: DateAsStringSchema.optional(),
    allDayEvent: z.boolean().optional(),
    organisingParticipants: z.array(
        z.object({
            id: z.string(),
            country: z.string().optional(),
            title: localized(z.string())
        })
    ).optional(),
    venue: z.string().optional(),
    location: z.string().optional(),
    country: z.string().optional(),
    coordinates: CoordinatesSchema.optional(),
    eventLanguage: localized(z.string()).optional(),
    documents: z.array(AssetDTOSchema).optional(),
    attendees: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean(),
    homepage: z.boolean(),
});

export function parseEventDTO(dto: z.infer<typeof EventDTOSchema>, language?: string): Event {
    return {
        contentType: eventContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseAssetDTO(dto.primaryImage, language),
        primaryLink: dto.primaryLink == null ? undefined : parseLinkDTO(dto.primaryLink, language),
        secondaryLinks: dto.secondaryLinks?.map(l => parseLinkDTO(l, language)) ?? [],
        start: dto.start,
        end: dto.end,
        allDayEvent: dto.allDayEvent,
        organisingParticipants: dto.organisingParticipants?.map(p => ({
            contentType: 'participant',
            id: p.id,
            country: p.country,
            title: pickLanguage(p.title, language),
        })) ?? [],
        venue: dto.venue,
        location: dto.location,
        country: dto.country,
        coordinates: dto.coordinates,
        eventLanguage: dto.eventLanguage == null ? undefined : pickLanguage(dto.eventLanguage, language),
        documents: dto.documents?.map(l => parseAssetDTO(l, language)) ?? [],
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
    }
}

export const eventMapper: Mapper<Event, typeof EventDTOSchema> = {
    contentType: eventContentType,
    Schema: EventDTOSchema,
    map: parseEventDTO,
}