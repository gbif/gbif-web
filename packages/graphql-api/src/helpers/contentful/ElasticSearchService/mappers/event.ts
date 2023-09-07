import { z } from "zod";
import { DateAsStringSchema, pickLanguage } from "../../utils";
import { ElasticSearchDocumentSchema, ElasticSearchImageSchema, ElasticSearchLinkSchema } from "./_shared";
import { Event } from "../../entities/event";

export const ElasticSearchEventDTOSchema = z.object({
    contentType: z.literal('event'),
    id: z.string(),
    title: z.record(z.string(), z.string()),
    summary: z.record(z.string(), z.string()).optional(),
    body: z.record(z.string(), z.string()).optional(),
    primaryImage: ElasticSearchImageSchema.optional(),
    primaryLink: ElasticSearchLinkSchema.optional(),
    secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
    start: DateAsStringSchema,
    end: DateAsStringSchema,
    allDayEvent: z.boolean().optional(),
    organisingParticipants: z.array(
        z.object({
            id: z.string(),
            country: z.string(),
            title: z.record(z.string(), z.string())
        })
    ).optional(),
    venue: z.string().optional(),
    location: z.string().optional(),
    country: z.string().optional(),
    coordinates: z.unknown().optional(),
    eventLanguage: z.record(z.string(), z.string()).optional(),
    documents: z.array(ElasticSearchDocumentSchema).optional(),
    attendees: z.unknown().optional(),
    keywords: z.array(z.string()).optional(),
    searchable: z.boolean().optional().default(false),
    homepage: z.boolean().optional().default(false),
});

export function parseElasticSearchEventDTO(eventDTO: z.infer<typeof ElasticSearchEventDTOSchema>): Event {
    return {
        contentType: 'event',
        id: eventDTO.id,
        title: pickLanguage(eventDTO.title),
        summary: eventDTO.summary == null ? undefined : pickLanguage(eventDTO.summary),
        body: eventDTO.body == null ? undefined : pickLanguage(eventDTO.body),
        primaryImage: eventDTO.primaryImage == null ? undefined : {
            title: eventDTO.primaryImage.title == null ? undefined : pickLanguage(eventDTO.primaryImage.title),
            description: eventDTO.primaryImage.description == null ? undefined : pickLanguage(eventDTO.primaryImage.description),
            file: {
                url: pickLanguage(eventDTO.primaryImage.file).url,
                details: {
                    size: pickLanguage(eventDTO.primaryImage.file).details.size,
                    width: pickLanguage(eventDTO.primaryImage.file).details.image.width,
                    height: pickLanguage(eventDTO.primaryImage.file).details.image.height,
                },
                fileName: pickLanguage(eventDTO.primaryImage.file).fileName,
                contentType: pickLanguage(eventDTO.primaryImage.file).contentType,
            },
        },
        primaryLink: eventDTO.primaryLink == null ? undefined : {
            label: pickLanguage(eventDTO.primaryLink.label),
            url: pickLanguage(eventDTO.primaryLink.url),
        },
        secondaryLinks: eventDTO.secondaryLinks == null ? [] : eventDTO.secondaryLinks.map(l => ({
            label: pickLanguage(l.label),
            url: pickLanguage(l.url),
        })),
        start: eventDTO.start,
        end: eventDTO.end,
        allDayEvent: eventDTO.allDayEvent,
        organisingParticipants: eventDTO.organisingParticipants?.map(p => ({
            id: p.id,
            country: p.country,
            title: pickLanguage(p.title),
        })) ?? [],
        venue: eventDTO.venue,
        location: eventDTO.location,
        country: eventDTO.country,
        coordinates: eventDTO.coordinates,
        eventLanguage: eventDTO.eventLanguage == null ? undefined : pickLanguage(eventDTO.eventLanguage),
        documents: eventDTO.documents == null ? undefined : eventDTO.documents.map(d => ({
            title: d.title == null ? undefined : pickLanguage(d.title),
            description: d.description == null ? undefined : pickLanguage(d.description),
            file: {
                url: pickLanguage(d.file).url,
                details: {
                    size: pickLanguage(d.file).details.size,
                },
                fileName: pickLanguage(d.file).fileName,
                contentType: pickLanguage(d.file).contentType,
            },
        })),
        keywords: eventDTO.keywords ?? [],
        searchable: eventDTO.searchable,
        homepage: eventDTO.homepage,
    }

}