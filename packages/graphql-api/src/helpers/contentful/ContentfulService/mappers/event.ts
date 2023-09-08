import { z } from "zod";
import { Event } from "../../contentTypes/event";
import { ContentfulReferenceSchema, DataMapper, DateAsStringSchema, createContentfulMapper } from "./_shared";

export const contentfulEventMapper: DataMapper<Event> = createContentfulMapper({
    contentType: 'Event',
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
    }),
    map: dto => ({
        contentType: 'event',
        id: dto.sys.id,
        title: dto.fields.title,
        summary: dto.fields.summary,
        body: dto.fields.body,
        primaryImage: dto.fields.primaryImage?.sys.id != null ? { id: dto.fields.primaryImage.sys.id } : undefined,
        primaryLink: dto.fields.primaryLink?.sys.id != null ? { id: dto.fields.primaryLink.sys.id } : undefined,
        secondaryLinks: dto.fields.secondaryLinks?.map(l => ({ id: l.sys.id })) ?? [],
        start: dto.fields.start,
        end: dto.fields.end,
        allDayEvent: dto.fields.allDayEvent,
        organisingParticipants: dto.fields.organisingParticipants?.map(l => ({ id: l.sys.id })) ?? [],
        venue: dto.fields.venue,
        location: dto.fields.location,
        country: dto.fields.country?.sys.id,
        coordinates: dto.fields.coordinates,
        eventLanguage: dto.fields.eventLanguage,
        documents: dto.fields.documents?.map(l => ({ id: l.sys.id })) ?? [],
        attendees: dto.fields.attendees,
        keywords: dto.fields.keywords ?? [],
        searchable: dto.fields.searchable,
        homepage: dto.fields.homepage,
    })
});