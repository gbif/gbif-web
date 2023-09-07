import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { ValueOrPromise } from "apollo-server-types";
import { ContentfulDataUseDTOSchema, parseContentfulDataUseDTO } from "./mappers/dataUse";
import { DataUse } from "../entities/dataUse";
import { z } from "zod";
import { GraphQLError } from "graphql";
import { ContentfulEventDTOSchema, parseContentfulEventDTO } from "./mappers/event";
import { Event } from "../entities/event";
import { ContentfulNewsDTOSchema, parseContentfulNewsDTO } from "./mappers/news";
import { News } from "../entities/news";
import { Notification } from "../entities/notification";
import { ContentfulNotificationDTOSchema, parseContentfulNotificationDTO } from "./mappers/notification";

// Add new DTO schemas here
const DTO_SCHEMAS = [
    ContentfulDataUseDTOSchema,
    ContentfulEventDTOSchema,
    ContentfulNewsDTOSchema,
    ContentfulNotificationDTOSchema,
] as const;

// Add new Entities here
type Entities = DataUse | Event | News | Notification;

// Add switch case for new DTO types here
function parseContentfulDTO(dto: z.infer<typeof GetEntityResultSchema>): Entities | null {
    const contentType = dto?.sys?.contentType?.sys?.id;

    if (typeof contentType !== 'string') {
        console.warn(`Unable to parse result from Contentful because it has no contentType property`)
        return null;
    }

    switch (contentType) {
        case 'DataUse': return parseContentfulDataUseDTO(dto);
        case 'Event': return parseContentfulEventDTO(dto);
        case 'News': return parseContentfulNewsDTO(dto);
        case 'notification': return parseContentfulNotificationDTO(dto);
    }

    console.warn(`Unable to parse result from Contentful because there is no mapper for the contentType of: ${contentType}`)
    return null;
}

type ContentfulServiceConfig = {
    contentful: {
        baseURL: string;
        access_token: string;
        space: string;
        environment: string;
    }
}

const GetEntityResultSchema = z.union([...DTO_SCHEMAS, z.any()]);

export const ContentfulErrorResponseSchema = z.object({
    sys: z.object({ type: z.string(), id: z.string() }),
    message: z.string(),
    details: z.object({
        type: z.string(),
        id: z.string(),
        environment: z.string(),
        space: z.string()
    }),
    requestId: z.string()
});

export class ContentfulService extends RESTDataSource {
    private readonly config: ContentfulServiceConfig['contentful'];

    constructor(config: ContentfulServiceConfig) {
        super();
        this.baseURL = config.contentful.baseURL;
        this.config = config.contentful;
    }

    protected willSendRequest(request: RequestOptions): ValueOrPromise<void> {
        request.params.set('access_token', this.config.access_token);
    }

    public getEntityById = async (id: string): Promise<Entities | null> => {
        const response = await this.get(`/spaces/${this.config.space}/environments/${this.config.environment}/entries/${id}`);

        // Try to parse the response as an error
        const errorResult = ContentfulErrorResponseSchema.safeParse(response);

        // If the error is a 404, return null
        if (errorResult.success && errorResult.data.sys.id === "NotFound") return null;

        // If it is any other error, throw the error
        if (errorResult.success) {
            console.error(errorResult.data.message);
            throw new GraphQLError(`Contentful response error: ${errorResult.data.details.id}`);
        }

        // Try to parse the response as an DTO
        const parsedResponse = GetEntityResultSchema.safeParse(response);

        // If the response is not an DTO, throw an error
        if (!parsedResponse.success) {
            console.error(parsedResponse.error);
            throw new Error(`Unable to parse response from Contentful: ${parsedResponse.error.message}`);
        }

        // Map the DTO to an entity
        return parseContentfulDTO(parsedResponse.data);
    }
}