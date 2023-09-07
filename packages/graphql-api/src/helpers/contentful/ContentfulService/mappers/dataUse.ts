import { z } from "zod";
import { DataUse } from "../../entities/dataUse";
import { ContentfulReferenceSchema } from "./_shared";

export const ContentfulDataUseDTOSchema =
    z.object({
        sys: z.object({
            id: z.string(),
            contentType: z.object({
                sys: z.object({
                    id: z.literal('DataUse')
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

export function parseContentfulDataUseDTO(dataUseDTO: z.infer<typeof ContentfulDataUseDTOSchema>): DataUse {
    return {
        contentType: 'dataUse',
        id: dataUseDTO.sys.id,
        title: dataUseDTO.fields.title,
        summary: dataUseDTO.fields.summary,
        body: dataUseDTO.fields.body,
        primaryImage: dataUseDTO.fields.primaryImage?.sys.id != null ? { id: dataUseDTO.fields.primaryImage.sys.id } : undefined,
        primaryLink: dataUseDTO.fields.primaryLink?.sys.id != null ? { id: dataUseDTO.fields.primaryLink.sys.id } : undefined,
        secondaryLinks: dataUseDTO.fields.secondaryLinks?.map(l => ({ id: l.sys.id })) ?? [],
        citation: dataUseDTO.fields.citation,
        resourceUsed: dataUseDTO.fields.resourceUsed,
        countriesOfResearchers: dataUseDTO.fields.countriesOfResearcher?.map(c => c.sys.id) ?? [],
        countriesOfCoverage: dataUseDTO.fields.countriesOfCoverage?.map(c => c.sys.id) ?? [],
        topics: dataUseDTO.fields.topics?.map(t => ({ id: t.sys.id })) ?? [],
        purposes: dataUseDTO.fields.purposes?.map(p => ({ id: p.sys.id })) ?? [],
        audiences: dataUseDTO.fields.audiences?.map(a => ({ id: a.sys.id })) ?? [],
        keywords: dataUseDTO.fields.keywords ?? [],
        searchable: dataUseDTO.fields.searchable,
        homepage: dataUseDTO.fields.homepage,
    };
}