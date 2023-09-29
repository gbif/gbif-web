import { z } from "zod";
import { Composition } from "../contentTypes/composition";
import { DataMapper, createElasticSearchMapper, localized } from "./_shared";
import { DateAsStringSchema } from "../utils";

export const elasticSearchCompositionMapper: DataMapper<Composition> = createElasticSearchMapper({
    contentType: 'composition',
    fields: z.object({
        id: z.string(),
        title: z.string().optional(),
        summary: localized(z.string()).optional(),
        createdAt: DateAsStringSchema,
        searchable: z.boolean().optional().default(false),
        machineIdentifier: z.string().optional(),
        urlAlias: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        // TODO: Add primary iamge
        blocks: z.object({
            headerBlock: z.array(z.object({
                // TODO: Add primary iamge
                hideTitle: localized(z.boolean()).optional(),
                title: localized(z.string()),
                type: localized(z.string()).optional(),
                summary: localized(z.string()).optional(),
            })).optional(),

            featureBlock: z.array(z.object({
                title: localized(z.string()).optional(),
                body: localized(z.string()).optional(),
                // TODO: Add optional features (This is currently a link to entries of type DataUse, Event, feature or news)
                maxPerRow: localized(z.number().int()).optional(),
                backgroundColour: localized(z.string()).optional(),
                hideTitle: localized(z.boolean()).optional(),
            })).optional(),

            carouselBlock: z.array(z.object({
                title: localized(z.string()).optional(),
                body: localized(z.string()).optional(),
                // TODO: Add optional features (This is currently a link to entries of type mediaBlock or mediaCountBlock)
                backgroundColour: localized(z.string()).optional(),
            })).optional(),

            customComponentBlock: z.array(z.object({
                title: localized(z.string()).optional(),
                backgroundColour: localized(z.string()).optional(),
                settings: localized(z.object({
                    tableStyle: z.string(),
                    programmeId: z.string(),
                })),
                componentType: localized(z.string()),
                width: localized(z.string()).optional(),
            })).optional(),
            
            featuredTextBlock: z.array(z.object({
                title: localized(z.string()).optional(),
                body: localized(z.string()).optional(),
                // TODO: Add primary iamge
                backgroundColour: localized(z.string()).optional(),
                hideTitle: localized(z.boolean()).optional(),
                // I assume this field is localized because most of the fields from ElasticSearch are localized, but Contentful says it's not localized.
                // There are no examples of this field being used from our ElasticSearch data.
                style: localized(z.string()).optional(),
            })).optional(),

            mediaBlock: z.array(z.object({
                title: localized(z.string()),
                subtitle: localized(z.string()).optional(),
                body: localized(z.string()).optional(),
                // TODO: Add callToAction
                // TODO: Add primary iamge
                roundImage: localized(z.boolean()).optional(),
                backgroundColour: localized(z.string()).optional(),
                reverse: localized(z.boolean()).optional(),
            })).optional(),

            mediaCountBlock: z.array(z.object({
                title: localized(z.string()),
                titleCountPart: localized(z.string()),
                subtitle: localized(z.string()).optional(),
                body: localized(z.string()).optional(),
                // TODO: Add optional callToAction
                // TODO: Add optional primary iamge
                roundImage: localized(z.boolean()).optional(),
                backgroundColour: localized(z.string()).optional(),
                reverse: localized(z.boolean()).optional(),
            })).optional(),

            textBlock: z.array(z.object({
                title: localized(z.string()).optional(),
                body: localized(z.string()).optional(),
                hideTitle: localized(z.boolean()).optional(),
                backgroundColour: localized(z.string()).optional(),
            })).optional(),
        }),
    }),
    map: (dto, language) => ({
        contentType: 'composition',
        id: dto.id,
    }),
});