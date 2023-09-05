import { GraphQLError } from "graphql";
import ContentfulDataUseAPI from "./dataUse.source";
import { DataUse } from "./dataUse.type";

interface PartialContext {
    dataSources: {
        contentfulDataUseAPI: ContentfulDataUseAPI;
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
            const entry = await context.dataSources.contentfulDataUseAPI.getEntry(args.id);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            return entry;
        }
    },
    DataUse: {
        title: src => src.title,
        summary: src => src.summary,
        body: src => src.body,
        primaryImageId: src => src.primaryImageId,
        primaryLink: src => src.primaryLink,
        secondaryLinks: src => src.secondaryLinks,
        citation: src => src.citation,
        resourceUsed: src => src.resourceUsed,
        countriesOfResearcherIds: src => src.countriesOfResearcherIds,
        countriesOfCoverageIds: src => src.countriesOfCoverageIds,
        topicIds: src => src.topicIds,
        purposes: src => src.purposes,
        audiences: src => src.audiences,
        keywords: src => src.keywords,
        searchable: src => src.searchable,
        homepage: src => src.homepage,
    } as Record<string, (src: DataUse) => unknown>
}

