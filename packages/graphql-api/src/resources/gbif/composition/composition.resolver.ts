import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService"
import { Composition } from "#/helpers/contentful/mappers/composition"
import { GraphQLError } from "graphql"

type PartialContext = {
    dataSources: {
        contentfulDetailService: ContentfulDetailService
    }
    language?: string
}

type CompositionQueryArgs = {
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
        dataUse: async (_: unknown, args: CompositionQueryArgs, context: PartialContext): Promise<Composition> => {
            const entry = await context.dataSources.contentfulDetailService.getById(args.id, args.preview, context.language);
            if (entry == null) throw new GraphQLError(`There is no composition entry with an id of ${args.id}`);
            if (entry.contentType !== 'composition') throw new GraphQLError(`The entry with an id of ${args.id} is not a composition entry`);
            return entry;
        }
    },
    Composition: {
    } as Record<string, (src: Composition, args: unknown, context: PartialContext) => unknown>
}