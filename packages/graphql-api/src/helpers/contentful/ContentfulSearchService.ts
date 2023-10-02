import { RESTDataSource } from "apollo-datasource-rest";
import { z } from "zod";
import { nullFilter, objectToQueryString } from "./utils";
import { MapperResult, mappers } from "./mappers";

export type ElasticSearchMapperResult = MapperResult;

export type ElasticSearchSearchParams = {
    q: string
    contentType: string[];
    topics: string[];
    countriesOfCoverage: string[];
    countriesOfResearcher: string[];
    from: number;
    size: number;
}

type ContentfulSearchServiceConfig = {
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
    results: MapperResult[];
}

export class ContentfulSearchService extends RESTDataSource {
    constructor(config: ContentfulSearchServiceConfig) {
        super();
        this.baseURL = config.apiEs;
    }

    public search = async (params?: Partial<ElasticSearchSearchParams>, language?: string): Promise<SearchResult> => {
        const response = await this.get(`/content`, objectToQueryString({
            // Restirct the content types returned to the ones we have mappers for. This can be overwritte by the params
            contentType: mappers.map(m => m.contentType),
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
                const mapper = mappers.find(m => m.contentType === contentType);

                // If there is no mapper, return null
                if (mapper == null) {
                    console.warn(`Unable to parse result from ElasticSearch because there is no mapper for the contentType of: ${contentType}`);
                    return null;
                }

                // Otherwise, parse the result
                const parseResult = mapper.Schema.safeParse(result);
                if (!parseResult.success) {
                    console.warn(`Unable to parse result from ElasticSearch: ${parseResult.error.message}`);
                    return null;
                }

                // Map the DTO to the entry
                const dto = parseResult.data;
                return mapper.map(dto as any, language);
            }).filter(nullFilter),
        }
    }
}