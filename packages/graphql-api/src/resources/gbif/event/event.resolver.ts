import { GraphQLError } from "graphql";
import { Event } from "./event.type";
import ContentfulEventAPI from "./event.source";

interface PartialContext {
    dataSources: {
        contentfulEventAPI: ContentfulEventAPI;
    }
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
    Query: {
        event: async (_: unknown, args: { id: string }, context: PartialContext): Promise<Event> => {
            const entry = await context.dataSources.contentfulEventAPI.getEntry(args.id);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            return entry;
        }
    },
    Event: {
        title: src => src.title,
        summary: src => src.summary,
        body: src => src.body,
        primaryImageId: src => src.primaryImageId,
        primaryLink: src => src.primaryLink,
        secondaryLinks: src => src.secondaryLinks,
        start: src => src.start.toISOString(),
        end: src => src.end.toISOString(),
        allDayEvent: src => src.allDayEvent,
        organisingParticipantsIds: src => src.organisingParticipantsIds,
        venue: src => src.venue,
        location: src => src.location,
        countryId: src => src.countryId,
        coordinates: src => src.coordinates,
        eventLanguage: src => src.eventLanguage,
        documents: src => src.documents,
        attendees: src => src.attendees,
        keywords: src => src.keywords,
        searchable: src => src.searchable,
        homepage: src => src.homepage,
    } as Record<string, (src: Event) => unknown>
}

