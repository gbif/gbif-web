import { RESTDataSource } from "apollo-datasource-rest";
import { ContentfulErrorSchema } from "./validation";
import { GraphQLError } from "graphql";

interface ContentfulAPIConfig {
    contentfulApi: string;
    access_token: string;
    space: string;
    environment: string;
}

const _config: ContentfulAPIConfig = {
    contentfulApi: `https://cdn.contentful.com`,
    access_token: `TODO`,
    space: `TODO`,
    environment: `TODO`,
}

export abstract class BaseContentfulAPI<T> extends RESTDataSource {
    private readonly config: ContentfulAPIConfig;
    protected abstract readonly parseResponseToType: (response: unknown) => T;

    constructor(config: ContentfulAPIConfig) {
        super();
        this.baseURL = _config.contentfulApi;
        this.config = _config;
    }

    public async getEntry(id: string): Promise<T | null> {
        const result = await this.get(`/spaces/${this.config.space}/environments/${this.config.environment}/entries/${id}?access_token=${this.config.access_token}`);
        return this.parseResponse(result);
    }

    private parseResponse = (response: unknown): T | null => {
        // Try to parse the response as an error
        const errorResult = ContentfulErrorSchema.safeParse(response);

        // If the error is a 404, return null
        if (errorResult.success && errorResult.data.sys.id === "NotFound") return null;

        // If it is any other error, throw the error
        if (errorResult.success) {
            console.error(errorResult.data.message);
            throw new GraphQLError(`Contentful response error: ${errorResult.data.message}`);
        }

        // Delegate the parsing to the subclass
        return this.parseResponseToType(response);
    }
}