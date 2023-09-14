// https://api.gbif-dev.org/v1/content/41b37550-c7cf-480f-b2eb-98889cc0357e
// https://api.gbif-dev.org/v1/content/41b37550-c7cf-480f-b2eb-98889cc0357e/preview

import { RESTDataSource } from "apollo-datasource-rest";
import { z } from 'zod';
import { ElasticSearchMapperResult, elasticSearchMappers } from './mappers';

const SuccessResponseSchema =
    z.object({ contentType: z.string() })
    .and(z.record(z.string(), z.unknown()));

export class ContentfulDetailService extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.gbif.org/v1';
    }

    public getById = async (id: string, preview: boolean = false): Promise<ElasticSearchMapperResult> => {
        let path = `/content/${id}`;
        if (preview) path += '/preview';

        const response = await this.get(path);

        // Try to parse the response
        const parsedResponse = SuccessResponseSchema.safeParse(response);

        // If the response is not valid, throw an error
        if (!parsedResponse.success) {
            console.error(parsedResponse.error);
            throw new Error(`Unable to parse response from Contentful: ${parsedResponse.error.message}`);
        }

        const { data } = parsedResponse;

        // Try to get the mapper for the content type
        const contentType = data.contentType;
        const mapper = elasticSearchMappers.find(m => m.contentType === contentType);

        // If there is no mapper, return null
        if (mapper == null) {
            console.warn(`Unable to parse result from ElasticSearch because there is no mapper for the contentType of: ${contentType}`);
            return null;
        }

        // Otherwise, parse the result
        return mapper.parse(data);
    }
}