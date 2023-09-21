import { z } from "zod";
import { DateAsStringSchema } from "../utils";
import { pickLanguage } from "../languages";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, parseElasticSearchAssetDTO, parseElasticSearchLinkDTO, createElasticSearchMapper } from "./_shared";
import { Event } from "../contentTypes/event";

export const elasticSearchEventMapper: DataMapper<Event> = createElasticSearchMapper({
    contentType: 'event',
    fields: z.object({
        id: z.string(),
        title: z.record(z.string(), z.string()),
        summary: z.record(z.string(), z.string()).optional(),
        body: z.record(z.string(), z.string()).optional(),
        primaryImage: ElasticSearchAssetSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
        start: DateAsStringSchema,
        end: DateAsStringSchema.optional(),
        allDayEvent: z.boolean().optional(),
        organisingParticipants: z.array(
            z.object({
                id: z.string(),
                country: z.string().optional(),
                title: z.record(z.string(), z.string())
            })
        ).optional(),
        venue: z.string().optional(),
        location: z.string().optional(),
        country: z.string().optional(),
        coordinates: z.unknown().optional(),
        eventLanguage: z.record(z.string(), z.string()).optional(),
        documents: z.array(ElasticSearchAssetSchema).optional(),
        attendees: z.unknown().optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean().optional().default(false),
        homepage: z.boolean().optional().default(false),
    }),
    map: (dto, language) => ({
        contentType: 'event',
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchAssetDTO(dto.primaryImage, language),
        primaryLink: dto.primaryLink == null ? undefined : parseElasticSearchLinkDTO(dto.primaryLink, language),
        secondaryLinks: dto.secondaryLinks == null ? [] : dto.secondaryLinks.map(l => parseElasticSearchLinkDTO(l, language)),
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
        documents: dto.documents == null ? [] : dto.documents.map(l => parseElasticSearchAssetDTO(l, language)),
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
    })
})