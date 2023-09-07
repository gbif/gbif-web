import { z } from "zod";
import { News } from "../../entities/news";
import { ContentfulReferenceSchema } from "./_shared";

export const ContentfulNewsDTOSchema = z.object({
    sys: z.object({
        id: z.string(),
        contentType: z.object({
            sys: z.object({
                id: z.literal('News')
            })
        })
    }),
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

export function parseContentfulNewsDTO(newsDTO: z.infer<typeof ContentfulNewsDTOSchema>): News {
    return {
        contentType: 'news',
        id: newsDTO.sys.id,
        title: newsDTO.fields.title,
        summary: newsDTO.fields.summary,
        body: newsDTO.fields.body,
        primaryImage: newsDTO.fields.primaryImage?.sys.id != null ? { id: newsDTO.fields.primaryImage.sys.id } : undefined,
        primaryLink: newsDTO.fields.primaryLink?.sys.id != null ? { id: newsDTO.fields.primaryLink.sys.id } : undefined,
        secondaryLinks: newsDTO.fields.secondaryLinks?.map(l => ({ id: l.sys.id })) ?? [],
        citation: newsDTO.fields.citation,
        countriesOfCoverage: newsDTO.fields.countriesOfCoverage?.map(c => c.sys.id) ?? [],
        topics: newsDTO.fields.topics?.map(t => ({ id: t.sys.id })) ?? [],
        purposes: newsDTO.fields.purposes?.map(p => ({ id: p.sys.id })) ?? [],
        audiences: newsDTO.fields.audiences?.map(a => ({ id: a.sys.id })) ?? [],
        keywords: newsDTO.fields.keywords ?? [],
        searchable: newsDTO.fields.searchable,
        homepage: newsDTO.fields.homepage,
    };
}