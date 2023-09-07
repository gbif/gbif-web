import { z } from "zod";
import { Event } from "../../entities/event";
import { ContentfulReferenceSchema, DateAsStringSchema } from "./_shared";

export const ContentfulEventDTOSchema = z.object({
    sys: z.object({
        id: z.string(),
        contentType: z.object({
            sys: z.object({
                id: z.literal('Event')
            })
        })
    }),
    fields: z.object({
        title: z.string(),
        summary: z.string().optional(),
        body: z.string().optional(),
        primaryImage: ContentfulReferenceSchema.optional(),
        primaryLink: ContentfulReferenceSchema.optional(),
        secondaryLinks: z.array(ContentfulReferenceSchema).optional(),
        start: DateAsStringSchema,
        end: DateAsStringSchema,
        allDayEvent: z.boolean(),
        organisingParticipants: z.array(ContentfulReferenceSchema).optional(),
        venue: z.string().optional(),
        location: z.string().optional(),
        country: ContentfulReferenceSchema.optional(),
        coordinates: z.string().optional(),
        eventLanguage: z.string().optional(),
        documents: z.array(ContentfulReferenceSchema).optional(),
        attendees: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
        homepage: z.boolean()
    })
});

export function parseContentfulEventDTO(eventDTO: z.infer<typeof ContentfulEventDTOSchema>): Event {
    return {
        contentType: 'event',
        id: eventDTO.sys.id,
        title: eventDTO.fields.title,
        summary: eventDTO.fields.summary,
        body: eventDTO.fields.body,
        primaryImage: eventDTO.fields.primaryImage?.sys.id != null ? { id: eventDTO.fields.primaryImage.sys.id } : undefined,
        primaryLink: eventDTO.fields.primaryLink?.sys.id != null ? { id: eventDTO.fields.primaryLink.sys.id } : undefined,
        secondaryLinks: eventDTO.fields.secondaryLinks?.map(l => ({ id: l.sys.id })) ?? [],
        start: eventDTO.fields.start,
        end: eventDTO.fields.end,
        allDayEvent: eventDTO.fields.allDayEvent,
        organisingParticipants: eventDTO.fields.organisingParticipants?.map(l => ({ id: l.sys.id })) ?? [],
        venue: eventDTO.fields.venue,
        location: eventDTO.fields.location,
        country: eventDTO.fields.country?.sys.id,
        coordinates: eventDTO.fields.coordinates,
        eventLanguage: eventDTO.fields.eventLanguage,
        documents: eventDTO.fields.documents?.map(l => ({ id: l.sys.id })) ?? [],
        attendees: eventDTO.fields.attendees,
        keywords: eventDTO.fields.keywords ?? [],
        searchable: eventDTO.fields.searchable,
        homepage: eventDTO.fields.homepage,
    };
}