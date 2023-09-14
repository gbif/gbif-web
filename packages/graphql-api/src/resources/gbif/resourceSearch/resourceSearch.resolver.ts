import { ElasticSearchSearchParams, ContentfulSearchService, ElasticSearchMapperResult } from "#/helpers/contentful/ContentfulSearchService";
import { PaginatedSearchResult, SearchInput } from "./resourceSearch.type";

type PartialContext = {
    dataSources: {
        contentfulSearchService: ContentfulSearchService
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
        resourceSearch: async (_: unknown, args: { input: SearchInput }, context: PartialContext): Promise<PaginatedSearchResult> => {
            // Validate the input arguments
            if ((args.input.limit ?? 0) + (args.input.offset ?? 0) > 10000) throw new Error('The limit + offset cannot be greater than 10000');

            // Map the GraphQL input to the ElasticSearch input
            let elasticSearchInput: Partial<ElasticSearchSearchParams> = {
                q: args.input.q,
                size: args.input.limit,
                from: args.input.offset,
                contentType: args.input.contentType,
                topics: args.input.topics,
                countriesOfCoverage: args.input.countriesOfCoverage,
                countriesOfResearcher: args.input.countriesOfResearcher,
            }

            // Remove the null values from the input
            Object.entries(elasticSearchInput).forEach(([key, value]) => {
                if (key in elasticSearchInput && value == null) delete elasticSearchInput[key as keyof ElasticSearchSearchParams];
            });

            const result = await context.dataSources.contentfulSearchService.search(elasticSearchInput);

            return {
                count: result.results.length,
                endOfRecords: result.total <= (result.from + result.size),
                limit: args.input.limit ?? 10,
                offset: result.from,
                results: result.results,
            }
        },
    },
    SingleSearchResult: {
        __resolveType: (src: Exclude<ElasticSearchMapperResult, null>): string => {
            // Map the content types from ElasticSearch to the GraphQL types
            switch (src.contentType) {
                case 'dataUse': return 'DataUse';
                case 'event': return 'Event';
                case 'news': return 'News';
                case 'notification': return 'Notification';
            }
        }
    }
}

