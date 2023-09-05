import { BaseContentfulAPI } from "#/helpers/contentful/BaseContentfulAPI";
import { ContentfulReferenceSchema } from "#/helpers/contentful/validation";
import { z } from "zod";
import { DataUse } from "./dataUse.type";

const DataUseSchema = z.object({
    fields: z.object({
        title: z.string(),
        summary: z.string().optional(),
        body: z.string().optional(),
        primaryImage: ContentfulReferenceSchema.optional(),
        primaryLink: ContentfulReferenceSchema.optional(),
        secondaryLinks: z.array(ContentfulReferenceSchema).optional(),
        citation: z.string().optional(),
        resourceUsed: z.string().optional(),
        countriesOfResearcher: z.array(ContentfulReferenceSchema).optional(),
        countriesOfCoverage: z.array(ContentfulReferenceSchema).optional(),
        topics: z.array(ContentfulReferenceSchema).optional(),
        purposes: z.array(ContentfulReferenceSchema).optional(),
        audiences: z.array(ContentfulReferenceSchema).optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean(),
        homepage: z.boolean(),
    })
});

class ContentfulDataUseAPI extends BaseContentfulAPI<DataUse> {
    protected readonly parseResponseToType = (response: unknown): DataUse => {
        const result = DataUseSchema.safeParse(response);

        if (!result.success) {
            console.error(result.error);
            throw new Error(`Contentful parsing error: ${result.error}`);
        }

        // Map the response to the DataUse type
        const dataUse: DataUse = {
            title: result.data.fields.title,
            summary: result.data.fields.summary,
            body: result.data.fields.body,
            primaryImageId: result.data.fields.primaryImage?.sys.id,
            primaryLink: result.data.fields.primaryLink?.sys.id,
            secondaryLinks: result.data.fields.secondaryLinks?.map(l => l.sys.id) ?? [],
            citation: result.data.fields.citation,
            resourceUsed: result.data.fields.resourceUsed,
            countriesOfResearcherIds: result.data.fields.countriesOfResearcher?.map(c => c.sys.id) ?? [],
            countriesOfCoverageIds: result.data.fields.countriesOfCoverage?.map(c => c.sys.id) ?? [],
            topicIds: result.data.fields.topics?.map(t => t.sys.id) ?? [],
            purposes: result.data.fields.purposes?.map(p => p.sys.id) ?? [],
            audiences: result.data.fields.audiences?.map(a => a.sys.id) ?? [],
            keywords: result.data.fields.keywords ?? [],
            searchable: result.data.fields.searchable,
            homepage: result.data.fields.homepage,
        };

        return dataUse;
    }
}

export default ContentfulDataUseAPI;