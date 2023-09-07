import { ElasticSearchSearchParams, ElasticSearchService, Entities } from "#/helpers/contentful/ElasticSearchService";
import { PaginatedSearchResult } from "./resourceSearch.type";

type PartialContext = {
    dataSources: {
        elasticSearchService: ElasticSearchService
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
        resourceSearch: async (_: unknown, args: { input: ElasticSearchSearchParams }, context: PartialContext): Promise<PaginatedSearchResult> => {
            const result = await context.dataSources.elasticSearchService.search(args.input);
            return {
                count: 0,
                endOfRecords: false,
                limit: 0,
                offset: 0,
                results: result.results,
            }
        },
    },
    SingleSearchResult: {
        __resolveType: (src: Entities): string => {
            switch (src.contentType) {
                case 'dataUse': return 'DataUse';
                case 'event': return 'Event';
                case 'news': return 'News';
                case 'notification': return 'Notification';
            }
        }
    }
}

