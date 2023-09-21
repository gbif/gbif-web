import { GraphQLError } from "graphql";
import { DataUse } from "#/helpers/contentful/contentTypes/dataUse";
import { Asset } from "#/helpers/contentful/contentTypes/asset";
import { Link } from "#/helpers/contentful/contentTypes/link";
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService";
import { getHtml } from "#/helpers/utils";
import { previewText } from "#/helpers/ts-utils";

type PartialContext = {
    dataSources: {
        contentfulDetailService: ContentfulDetailService
    }
    language?: string
}

type DataUseQueryArgs = {
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
        dataUse: async (_: unknown, args: DataUseQueryArgs, context: PartialContext): Promise<DataUse> => {
            const entry = await context.dataSources.contentfulDetailService.getById(args.id, args.preview, context.language);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            if (entry.contentType !== 'dataUse') throw new GraphQLError(`The entry with an id of ${args.id} is not a dataUse entry`);
            return entry;
        }
    },
    DataUse: {
        id: (src): string => src.id,
        title: (src): string => getHtml(src.title, { inline: true }),
        summary: (src): string | undefined => getHtml(src.summary),
        body: (src): string | undefined => getHtml(src.body),
        previewText: (src): string | undefined => previewText(src),
        primaryImage: (src): Asset | undefined=> src.primaryImage,
        primaryLink: (src): Link | undefined => src.primaryLink,
        secondaryLinks: (src): Link[] => src.secondaryLinks,
        citation: (src): string | undefined => src.citation,
        resourceUsed: (src): string | undefined => src.resourceUsed,
        countriesOfResearchers: (src): string[] => src.countriesOfResearchers,
        countriesOfCoverage: (src): string[] => src.countriesOfCoverage,
        topics: (src): string[] => src.topics.map(topic => topic.term),
        purposes: (src): string[] => src.purposes.map(purpose => purpose.term),
        audiences: (src): string[] => src.audiences.map(audience => audience.term),
        keywords: (src): string[]  => src.keywords,
        searchable: (src): boolean => src.searchable,
        homepage: (src): boolean => src.homepage,
    } as Record<string, (src: DataUse, args: unknown, context: PartialContext) => unknown>
}

