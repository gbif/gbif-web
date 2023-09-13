import { GraphQLError } from "graphql";
import { ContentfulService } from "#/helpers/contentful/ContentfulService";
import { Event } from "#/helpers/contentful/contentTypes/event";
import { Asset } from "#/helpers/contentful/contentTypes/asset";
import { Link } from "#/helpers/contentful/contentTypes/link";
import { Participant } from "#/helpers/contentful/contentTypes/participant";

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
        primaryImage: async (src, _, context): Promise<Asset | undefined> => {
            if (src.primaryImage == null) return;
            if ('file' in src.primaryImage) return src.primaryImage;

            // Get the asset from contentful
            const asset = await context.dataSources.contentfulService.getAssetById(src.primaryImage.id);
            if (asset == null) throw new GraphQLError(`There is no asset with an id of ${src.primaryImage.id}`);
            if (asset.contentType !== 'asset') throw new GraphQLError(`The asset with an id of ${src.primaryImage.id} is not a asset`);
            return asset;
        },
        primaryLink: async (src, _, context): Promise<Link | undefined> => {
            if (src.primaryLink == null) return;
            if ('url' in src.primaryLink) return src.primaryLink;

            // Get the link from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(src.primaryLink.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${src.primaryLink.id}`);
            if (entity.contentType !== 'link') throw new GraphQLError(`The entry with an id of ${src.primaryLink.id} is not a link entry`);
            return entity;
        },
        secondaryLinks: (src, _, context): Promise<Array<Link | undefined>> => Promise.all(src.secondaryLinks.map(async link => {
            if ('url' in link) return link;

            // Get the link from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(link.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${link.id}`);
            if (entity.contentType !== 'link') throw new GraphQLError(`The entry with an id of ${link.id} is not a link entry`);
            return entity;
        })),
        start: (src): string => src.start.toISOString(),
        end: (src): string => src.end.toISOString(),
        allDayEvent: (src): boolean | undefined => src.allDayEvent,
        organisingParticipants: (src, _, context): Promise<Array<Participant | undefined>> => Promise.all(src.organisingParticipants.map(async participant => {
            if ('country' in participant) return participant;

            // Get the paticipant from contentful
            const entity = await context.dataSources.contentfulService.getEntityById(participant.id);
            if (entity == null) throw new GraphQLError(`There is no entry with an id of ${participant.id}`);
            if (entity.contentType !== 'participant') throw new GraphQLError(`The entry with an id of ${participant.id} is not a participant entry`);
            return entity;
        })),
        venue: (src): string | undefined => src.venue,
        location: (src): string | undefined => src.location,
        country: (src): string | undefined => src.country,
        // TODO: Figure out the type of coordinates
        coordinates: (src): unknown | undefined => src.coordinates,
        eventLanguage: (src): string | undefined => src.eventLanguage,
        documents: (src, _, context): Promise<Array<Asset | undefined>> => Promise.all(src.documents.map(async document => {
            if ('file' in document) return document;

            // Get the asset from contentful
            const asset = await context.dataSources.contentfulService.getAssetById(document.id);
            if (asset == null) throw new GraphQLError(`There is no asset with an id of ${document.id}`);
            if (asset.contentType !== 'asset') throw new GraphQLError(`The asset with an id of ${document.id} is not a asset`);
            return asset;
        })),
        attendees: (src): string | undefined => src.attendees,
        keywords: (src): string[] => src.keywords,
        searchable: (src): boolean | undefined => src.searchable,
        homepage: (src): boolean | undefined => src.homepage,
    } as Record<string, (src: Event, args: unknown, context: PartialContext) => unknown>
}

