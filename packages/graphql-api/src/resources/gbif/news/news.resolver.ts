import { GraphQLError } from "graphql";
import ContentfulNewsAPI from "./news.source";
import { News } from "./news.type";

interface PartialContext {
    dataSources: {
        contentfulNewsAPI: ContentfulNewsAPI;
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
        news: async (_: unknown, args: { id: string }, context: PartialContext): Promise<News> => {
            const entry = await context.dataSources.contentfulNewsAPI.getEntry(args.id);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            return entry;
        }
    },
    News: {
        title: src => src.title,
        summary: src => src.summary,
        body: src => src.body,
        primaryImageId: src => src.primaryImageId,
        primaryLink: src => src.primaryLink,
        secondaryLinks: src => src.secondaryLinks,
        citation: src => src.citation,
        countriesOfCoverageIds: src => src.countriesOfCoverageIds,
        topicIds: src => src.topicIds,
        purposes: src => src.purposes,
        audiences: src => src.audiences,
        keywords: src => src.keywords,
        searchable: src => src.searchable,
        homepage: src => src.homepage,
    } as Record<string, (src: News) => unknown>
}

