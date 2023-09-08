import { GraphQLError } from "graphql";
import { ContentfulService } from "#/helpers/contentful/ContentfulService";
import { Event } from "#/helpers/contentful/contentTypes/event";
import { CountryWithTitle, Image, Link } from "#/helpers/contentful/contentTypes/_shared";

interface PartialContext {
    dataSources: {
        contentfulService: ContentfulService;
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
            const entry = await context.dataSources.contentfulService.getEntityById(args.id);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            if (entry.contentType !== 'event') throw new GraphQLError(`The entry with an id of ${args.id} is not a news entry`);
            return entry;
        }
    },
    Event: {
        id: (src): string => src.id,
        title: (src): string => src.title,
        summary: (src): string | undefined => src.summary,
        body: (src): string | undefined => src.body,
        primaryImage: (src): Image | undefined => {
            if (src.primaryImage == null) return;
            if ('file' in src.primaryImage) return src.primaryImage;

            // TODO: fetch the image from the contentful service (must add a new mapper for the Image type)
            return;
        },
        primaryLink: (src): Link | undefined => {
            if (src.primaryLink == null) return;
            if ('url' in src.primaryLink) return src.primaryLink;

            // TODO: fetch the link from the contentful service (must add a new mapper for the Link type)
            return;
        },
        secondaryLinks: (src): Array<Link | undefined> => src.secondaryLinks.map(link => {
            if ('url' in link) return link;

            // TODO: fetch the link from the contentful service (must add a new mapper for the Link type)
            return;
        }),
        start: (src): string => src.start.toISOString(),
        end: (src): string => src.end.toISOString(),
        allDayEvent: (src): boolean | undefined => src.allDayEvent,
        organisingParticipants: (src): Array<CountryWithTitle | undefined> => src.organisingParticipants.map(country => {
            if ('country' in country) return country;

            // TODO: fetch the country from the contentful service (must add a new mapper for the Country type)
            return;
        }),
        venue: (src): string | undefined => src.venue,
        location: (src): string | undefined => src.location,
        country: (src): string | undefined => src.country,
        // TODO: Figure out the type of coordinates
        coordinates: (src): unknown | undefined => src.coordinates,
        eventLanguage: (src): string | undefined => src.eventLanguage,
        documents: src => src.documents,
        attendees: (src): string | undefined => src.attendees,
        keywords: (src): string[] => src.keywords,
        searchable: (src): boolean | undefined => src.searchable,
        homepage: (src): boolean | undefined => src.homepage,
    } as Record<string, (src: Event) => unknown>
}

