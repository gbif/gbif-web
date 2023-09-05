import { z } from "zod"
import { News } from "./news.type";
import { ContentfulReferenceSchema } from "#/helpers/contentful/validation";
import { BaseContentfulAPI } from "#/helpers/contentful/BaseContentfulAPI";
import { GraphQLError } from "graphql";

const NewsSchema = z.object({
    fields: z.object({
        title: z.string(),
        summary: z.string().optional(),
        body: z.string().optional(),
        primaryImage: ContentfulReferenceSchema.optional(),
        primaryLink: ContentfulReferenceSchema.optional(),
        secondaryLinks: z.array(ContentfulReferenceSchema).optional(),
        citation: z.string().optional(),
        countriesOfCoverage: z.array(ContentfulReferenceSchema).optional(),
        topics: z.array(ContentfulReferenceSchema).optional(),
        purposes: z.array(ContentfulReferenceSchema).optional(),
        audiences: z.array(ContentfulReferenceSchema).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
        homepage: z.boolean()
    })
});

class ContentfulNewsAPI extends BaseContentfulAPI<News> {
    protected readonly parseResponseToType = (response: unknown): News => {
        const result = NewsSchema.safeParse(response);

        if (!result.success) {
            console.error(result.error);
            throw new GraphQLError(`Contentful parsing error: ${result.error.name}`);
        }

        // Map the response to the News type
        const news: News = {
            title: result.data.fields.title,
            summary: result.data.fields.summary,
            body: result.data.fields.body,
            primaryImageId: result.data.fields.primaryImage?.sys.id,
            primaryLink: result.data.fields.primaryLink?.sys.id,
            secondaryLinks: result.data.fields.secondaryLinks?.map(l => l.sys.id) ?? [],
            citation: result.data.fields.citation,
            countriesOfCoverageIds: result.data.fields.countriesOfCoverage?.map(c => c.sys.id) ?? [],
            topicIds: result.data.fields.topics?.map(t => t.sys.id) ?? [],
            purposes: result.data.fields.purposes?.map(p => p.sys.id) ?? [],
            audiences: result.data.fields.audiences?.map(a => a.sys.id) ?? [],
            keywords: result.data.fields.keywords ?? [],
            searchable: result.data.fields.searchable,
            homepage: result.data.fields.homepage,
        };

        return news;
    };
}

export default ContentfulNewsAPI;