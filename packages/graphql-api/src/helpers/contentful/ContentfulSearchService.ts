import { RESTDataSource } from "apollo-datasource-rest";
import { z } from "zod";
import { nullFilter, objectToQueryString } from "./utils";
import { ElasticSearchMapperResult, elasticSearchMappers } from "./mappers";
export { ElasticSearchMapperResult} from "./mappers";

export type ElasticSearchSearchParams = {
    q: string
    contentType: string;
    // TODO: Should be an enum
    topics: string[];
    // TODO: Should be an enum of lang codes
    countriesOfCoverage: string[];
    // TODO: Should be an enum of lang codes
    countriesOfResearcher: string[];
    // TODO: find better alternative to _showPastEvents
    from: number;
    size: number;
}

type ElasticSearchServiceConfig = {
    apiEs: string;
}

const SearchResultSchema = z.object({
    documents: z.object({
        size: z.number(),
        from: z.number(),
        total: z.number(),
        results: z.array(z.object({ contentType: z.string() }).and(z.record(z.string(), z.unknown()))),
    })
});

type SearchResult = {
    size: number;
    from: number;
    total: number;
    results: ElasticSearchMapperResult[];
}

export class ElasticSearchService extends RESTDataSource {
    constructor(config: ElasticSearchServiceConfig) {
        super();
        this.baseURL = config.apiEs;
    }

    public search = async (params?: Partial<ElasticSearchSearchParams>): Promise<SearchResult> => {
        const response = await this.get(`/content`, objectToQueryString({
            // Restirct the content types returned to the ones we have mappers for. This can be overwritte by the params
            contentType: elasticSearchMappers.map(m => m.contentType),
            ...params,
        }));

        // Try to parse the response
        const parsedResponse = SearchResultSchema.safeParse(response);

        // If the response is not valid, throw an error
        if (!parsedResponse.success) {
            console.error(parsedResponse.error);
            throw new Error(`Unable to parse response from ElasticSearch: ${parsedResponse.error.message}`);
        }

        const { data } = parsedResponse;

        // Map the DTOs to the entities
        return {
            size: data.documents.size,
            from: data.documents.from,
            total: data.documents.total,
            results: data.documents.results.map(result => {
                // Try to get the mapper for the content type
                const contentType = result.contentType;
                const mapper = elasticSearchMappers.find(m => m.contentType === contentType);

                // If there is no mapper, return null
                if (mapper == null) {
                    console.warn(`Unable to parse result from ElasticSearch because there is no mapper for the contentType of: ${contentType}`);
                    return null;
                }

                // Otherwise, parse the result
                return mapper.parse(result);
            }).filter(nullFilter),
        }
    }
}