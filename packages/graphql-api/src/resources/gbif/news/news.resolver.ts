import { GraphQLError } from "graphql";
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService";
import { getHtml } from "#/helpers/utils";
import { previewText } from "#/helpers/ts-utils";
import { News } from "#/helpers/contentful/mappers/news";

type PartialContext = {
    dataSources: {
        contentfulDetailService: ContentfulDetailService
    }
    language?: string
}

type NewsQueryArgs = {
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
        news: async (_: unknown, args: NewsQueryArgs, context: PartialContext): Promise<News> => {
            const entity = await context.dataSources.contentfulDetailService.getById(args.id, args.preview, context.language);
            if (entity == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            if (entity.contentType !== 'news') throw new GraphQLError(`The entry with an id of ${args.id} is not a news entry`);
            return entity;
        }
    },
    News: {
        title: (src): string => getHtml(src.title, { inline: true }),
        summary: (src): string | undefined => getHtml(src.summary),
        body: (src): string | undefined => getHtml(src.body),
        previewText: (src): string | undefined => previewText(src),
    } as Record<string, (src: News, args: unknown, context: PartialContext) => unknown>
}

