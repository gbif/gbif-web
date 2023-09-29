import { GraphQLError } from "graphql";
import { Event } from "#/helpers/contentful/contentTypes/event";
import { Asset } from "#/helpers/contentful/contentTypes/asset";
import { Link } from "#/helpers/contentful/contentTypes/link";
import { Participant } from "#/helpers/contentful/contentTypes/participant";
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService";
import { getHtml } from "#/helpers/utils";
import { previewText } from "#/helpers/ts-utils";

type PartialContext = {
    dataSources: {
        contentfulDetailService: ContentfulDetailService
    }
    language?: string
}

type EventQueryArgs = {
    id: string;
    preview?: boolean;
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
        event: async (_: unknown, args: EventQueryArgs, context: PartialContext): Promise<Event> => {
            const entry = await context.dataSources.contentfulDetailService.getById(args.id, args.preview, context.language);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            if (entry.contentType !== 'event') throw new GraphQLError(`The entry with an id of ${args.id} is not a news entry`);
            return entry;
        }
    },
    Event: {
        id: (src): string => src.id,
        title: (src): string => getHtml(src.title, { inline: true }),
        summary: (src): string | undefined => getHtml(src.summary),
        body: (src): string | undefined => getHtml(src.body),
        previewText: (src): string | undefined => previewText(src),
        primaryImage: (src): Asset | undefined => src.primaryImage,
        primaryLink: (src): Link | undefined => src.primaryLink,
        secondaryLinks: (src): Array<Link | undefined> => src.secondaryLinks,
        start: (src): string => src.start.toISOString(),
        end: (src): string | undefined => src.end?.toISOString(),
        allDayEvent: (src): boolean | undefined => src.allDayEvent,
        organisingParticipants: (src): Array<Participant | undefined> => src.organisingParticipants,
        venue: (src): string | undefined => src.venue,
        location: (src): string | undefined => src.location,
        country: (src): string | undefined => src.country,
        // TODO: Figure out the type of coordinates
        coordinates: (src): unknown | undefined => src.coordinates,
        eventLanguage: (src): string | undefined => src.eventLanguage,
        documents: (src): Array<Asset | undefined> => src.documents,
        attendees: (src): string | undefined => src.attendees,
        keywords: (src): string[] => src.keywords,
        searchable: (src): boolean => src.searchable,
        homepage: (src): boolean => src.homepage,
    } as Record<string, (src: Event, args: unknown, context: PartialContext) => unknown>
}

