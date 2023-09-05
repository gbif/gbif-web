import { BaseContentfulAPI } from "#/helpers/contentful/BaseContentfulAPI";
import { ContentfulReferenceSchema, DateAsStringSchema } from "#/helpers/contentful/validation";
import { z } from "zod";
import { Event } from "./event.type";

const EventSchema = z.object({
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

class ContentfulEventAPI extends BaseContentfulAPI<Event> {
    protected readonly parseResponseToType = (response: unknown): Event => {
        const result = EventSchema.safeParse(response);

        if (!result.success) {
            console.error(result.error);
            throw new Error(`Contentful parsing error: ${result.error}`);    
        }

        const event: Event = {
            title: result.data.fields.title,
            summary: result.data.fields.summary,
            body: result.data.fields.body,
            primaryImageId: result.data.fields.primaryImage?.sys.id,
            primaryLink: result.data.fields.primaryLink?.sys.id,
            secondaryLinks: result.data.fields.secondaryLinks?.map(l => l.sys.id) ?? [],
            start: result.data.fields.start,
            end: result.data.fields.end,
            allDayEvent: result.data.fields.allDayEvent,
            organisingParticipantsIds: result.data.fields.organisingParticipants?.map(p => p.sys.id) ?? [],
            venue: result.data.fields.venue,
            location: result.data.fields.location,
            countryId: result.data.fields.country?.sys.id,
            coordinates: result.data.fields.coordinates,
            eventLanguage: result.data.fields.eventLanguage,
            documents: result.data.fields.documents?.map(d => d.sys.id) ?? [],
            attendees: result.data.fields.attendees,
            keywords: result.data.fields.keywords ?? [],
            searchable: result.data.fields.searchable,
            homepage: result.data.fields.homepage,
        };

        return event;
    }
}

export default ContentfulEventAPI;