import { RESTDataSource } from "apollo-datasource-rest";
import { z } from "zod";
import { ElasticSearchDataUseDTOSchema, parseElasticSearchDataUseDTO } from "./mappers/dataUse";
import { DataUse } from "../entities/dataUse";
import { Event } from "../entities/event";
import { nullFilter } from "../utils";
import { ElasticSearchEventDTOSchema, parseElasticSearchEventDTO } from "./mappers/event";
import { ElasticSearchNewsDTOSchema, parseElasticSearchNewsDTO } from "./mappers/news";
import { ElasticSearchNotificationDTOSchema, parseElasticSearchNotificationDTO } from "./mappers/notification";
import { News } from "../entities/news";
import { Notification } from "../entities/notification";
import fs from 'fs';

// Add new DTO schemas here
const DTO_SCHEMAS = [
    ElasticSearchDataUseDTOSchema,
    ElasticSearchEventDTOSchema,
    ElasticSearchNewsDTOSchema,
    ElasticSearchNotificationDTOSchema,
] as const;

// Add new Entities here
export type Entities = DataUse | Event | News | Notification;

// Add switch case for new DTO types here
function parseElasticSearchDTO(dto: z.infer<typeof SearchResultSchema>['documents']['results'][number]): Entities | null {
    if ('contentType' in dto === false) {
        console.warn(`Unable to parse result from ElasticSearch because it has no contentType property`)
        return null;
    }

    switch (dto.contentType) {
        case 'dataUse': return parseElasticSearchDataUseDTO(dto as any);
        case 'event': return parseElasticSearchEventDTO(dto as any);
        case 'news': return parseElasticSearchNewsDTO(dto as any);
        case 'notification': return parseElasticSearchNotificationDTO(dto as any);
    }

    // console.warn(`Unable to parse result from ElasticSearch because there is no mapper for the contentType of: ${dto.contentType}`)
    return null;
}

export type ElasticSearchSearchParams = {
    q: string
    from: number
    contentType: string;
    // TODO: Should be an enum
    topics: string[];
    // TODO: Should be an enum of lang codes
    countriesOfCoverage: string[];
    // TODO: Should be an enum of lang codes
    countriesOfResearcher: string[];
    // TODO: find better alternative to _showPastEvents
}

type ElasticSearchServiceConfig = {
    apiEs: string;
}

// TODO: This can produce some pain in the ass errors that will be very hard to debug for others. It should not work like this
const UnknownContentTypeSchema = z.object({ 
    contentType: z.string()
        // Make sure the "unknown" content type is not just a mutation of one of the known ones that was't able to be parsed
        .refine(value => !['dataUse', 'event', 'news', 'notification'].includes(value), { 
            message: `Error pasing known content type`
        })
        .optional()
})

const SearchResultSchema = z.object({
    documents: z.object({
        size: z.number(),
        from: z.number(),
        total: z.number(),
        results: z.array(z.union([...DTO_SCHEMAS, /*UnknownContentTypeSchema*/])),
    })
});

type SearchResult = {
    size: number;
    from: number;
    total: number;
    results: Entities[];
}

export class ElasticSearchService extends RESTDataSource {
    constructor(config: ElasticSearchServiceConfig) {
        super();
        this.baseURL = config.apiEs;
    }

    public search = async (params?: Partial<ElasticSearchSearchParams>): Promise<SearchResult> => {
        const response = await this.get(`/content`, params);

        const parsedResponse = SearchResultSchema.safeParse(response);

        if (!parsedResponse.success) {
            fs.writeFileSync('dump.json', JSON.stringify({
                response: response,
                errors: parsedResponse.error
            }, null, 2));
            console.error(parsedResponse.error);
            throw new Error(`Unable to parse response from ElasticSearch: ${parsedResponse.error.message}`);
        }

        const { data } = parsedResponse;

        // Map the DTOd to the entities
        return {
            size: data.documents.size,
            from: data.documents.from,
            total: data.documents.total,
            results: data.documents.results.map(parseElasticSearchDTO).filter(nullFilter),
        }
    }
}