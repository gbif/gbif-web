import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { ContentfulMapperResult, contentfulMappers } from "./mappers";
import { ValueOrPromise } from "apollo-server-types";
import { timeExecution } from "../utils";

type ContentfulServiceConfig = {
    debug: boolean;
    contentful: {
        baseURL: string;
        access_token: string;
        space: string;
        environment: string;
    }
}

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

const ContentfulSuccessResponseSchema = z.object({
    sys: z.union([
        z.object({
            id: z.string(),
            contentType: z.object({
                sys: z.object({
                    id: z.string()
                })
            })
        }),
        z.object({
            id: z.string(),
            type: z.string()
        }),
    ]),
    fields: z.record(z.string(), z.unknown())
})

export class ContentfulService extends RESTDataSource {
    private readonly config: ContentfulServiceConfig;

    constructor(config: ContentfulServiceConfig) {
        super();
        this.baseURL = config.contentful.baseURL;
        this.config = config;
    }

    protected willSendRequest(request: RequestOptions): ValueOrPromise<void> {
        request.params.set('access_token', this.config.contentful.access_token);
    }

    public getAssetById = async (id: string): Promise<ContentfulMapperResult | null> => {
        const response = await timeExecution(
            () => this.get(`/spaces/${this.config.contentful.space}/environments/${this.config.contentful.environment}/assets/${id}`),
            this.config.debug,
            `ContentfulService.getAssetById(${id})`
        );

        return this.proccessResponse(response);
    }

    public getEntityById = async (id: string): Promise<ContentfulMapperResult | null> => {
        const response = await timeExecution(
            () => this.get(`/spaces/${this.config.contentful.space}/environments/${this.config.contentful.environment}/entries/${id}`),
            this.config.debug,
            `ContentfulService.getEntityById(${id})`
        );

        return this.proccessResponse(response);
    }

    private proccessResponse = async (response: Promise<unknown>): Promise<ContentfulMapperResult | null> => {
        // Try to parse the response as an error
        const errorResult = ContentfulErrorResponseSchema.safeParse(response);

        // If the error is a 404, return null
        if (errorResult.success && errorResult.data.sys.id === "NotFound") return null;

        // If it is any other error, throw the error
        if (errorResult.success) {
            console.error(errorResult.data.message);
            throw new GraphQLError(`Contentful response error: ${errorResult.data.details.id}`);
        }

        // Try to parse the response as a success
        const successResult = ContentfulSuccessResponseSchema.safeParse(response);

        // If the response is not a success, throw an error
        if (!successResult.success) {
            console.error(successResult.error);
            throw new Error(`Unable to parse response from Contentful: ${successResult.error.message}`);
        }

        // Try to get the mapper for the content type
        const contentType = 'type' in successResult.data.sys ? successResult.data.sys.type : successResult.data.sys.contentType.sys.id;
        const mapper = contentfulMappers.find(m => m.contentType === contentType);

        // If there is no mapper, return null
        if (mapper == null) {
            console.warn(`Unable to parse result from Contentful because there is no mapper for the contentType of: ${contentType}`);
            return null;
        }

        // Otherwise, parse the result
        return mapper.parse(successResult.data);
    }
}