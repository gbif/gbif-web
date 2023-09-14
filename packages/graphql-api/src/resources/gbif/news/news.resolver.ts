import { GraphQLError } from "graphql";
import { News } from "#/helpers/contentful/contentTypes/news";
import { Asset } from "#/helpers/contentful/contentTypes/asset";
import { Link } from "#/helpers/contentful/contentTypes/link";
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService";

interface PartialContext {
    dataSources: {
        contentfulDetailService: ContentfulDetailService
    }
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
            const entity = await context.dataSources.contentfulDetailService.getById(args.id, args.preview);
            if (entity == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            if (entity.contentType !== 'news') throw new GraphQLError(`The entry with an id of ${args.id} is not a news entry`);
            return entity;
        }
    },
    News: {
        id: (src): string => src.id,
        title: (src): string => src.title,
        summary: (src): string | undefined => src.summary,
        body: (src): string | undefined => src.body,
        primaryImage: (src): Asset | undefined=> src.primaryImage,
        primaryLink: (src): Link | undefined => src.primaryLink,
        secondaryLinks: (src): Link[] => src.secondaryLinks,
        citation: (src): string | undefined => src.citation,
        countriesOfCoverage: (src): string[] => src.countriesOfCoverage,
        topics: (src): string[] => src.topics.map(topic => topic.term),
        purposes: (src): string[] => src.purposes.map(purpose => purpose.term),
        audiences: (src): string[] => src.audiences.map(audience => audience.term),
        keywords: (src): string[] => src.keywords,
        searchable: (src): boolean => src.searchable,
        homepage: (src): boolean  => src.homepage,
    } as Record<string, (src: News, args: unknown, context: PartialContext) => unknown>
}

