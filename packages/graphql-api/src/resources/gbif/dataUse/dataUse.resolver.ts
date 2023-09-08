import { GraphQLError } from "graphql";
import { ContentfulService } from "#/helpers/contentful/ContentfulService";
import { DataUse } from "#/helpers/contentful/contentTypes/dataUse";
import { Image, Link } from "#/helpers/contentful/contentTypes/_shared";

type PartialContext = {
    dataSources: {
        contentfulService: ContentfulService
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
        dataUse: async (_: unknown, args: { id: string }, context: PartialContext): Promise<DataUse> => {
            const entry = await context.dataSources.contentfulService.getEntityById(args.id);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            if (entry.contentType !== 'dataUse') throw new GraphQLError(`The entry with an id of ${args.id} is not a dataUse entry`);
            return entry;
        }
    },
    DataUse: {
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
        citation: (src): string | undefined => src.citation,
        resourceUsed: (src): string | undefined => src.resourceUsed,
        countriesOfResearchers: (src): string[] => src.countriesOfResearchers,
        countriesOfCoverage: (src): string[] => src.countriesOfCoverage,
        topics: (src): Array<string | undefined> => src.topics.map(topic => {
            if (typeof topic === 'object') {
                // TODO: fetch the topic from the contentful service (must add a new mapper for the Topic type)
                return;
            }
            return topic;
        }),
        purposes: (src): Array<string | undefined> => src.purposes.map(purpose => {
            if (typeof purpose === 'object') {
                // TODO: fetch the purpose from the contentful service (must add a new mapper for the Purpose type)
                return;
            }
            return purpose;
        }),
        audiences: (src): Array<string | undefined> => src.audiences.map(audience => {
            if (typeof audience === 'object') {
                // TODO: fetch the audience from the contentful service (must add a new mapper for the Audience type)
                return;
            }
            return audience;
        }),
        keywords: (src): Array<string>  => src.keywords,
        searchable: (src): boolean => src.searchable,
        homepage: (src): boolean => src.homepage,
    } as Record<string, (src: DataUse) => unknown>
}

