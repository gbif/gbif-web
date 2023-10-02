import { z } from "zod";
import { Mapper, localized } from "./_shared";
import { DateAsStringSchema } from "../utils";
import { pickLanguage } from "../languages";
import { HeaderBlock, HeaderBlockDTOSchema, parseHeaderBlockDTO } from "./blocks/headerBlock";
import { FeatureBlock, FeatureBlockDTOSchema, parseFeatureBlockDTO } from "./blocks/featureBlock";
import { CarouselBlock, CarouselBlockDTOSchema, parseCarouselBlockDTO } from "./blocks/carouselBlock";
import { CustomComponentBlock, CustomComponentBlockDTOSchema, parseCustomComponentBlockDTO } from "./blocks/customComponentBlock";
import { FeaturedTextBlock, FeaturedTextBlockDTOSchema, parseFeaturedTextBlockDTO } from "./blocks/featuredTextBlock";
import { MediaBlock, MediaBlockDTOSchema, parseMediaBlockDTO } from "./blocks/mediaBlock";
import { MediaCountBlock, MediaCountBlockDTOSchema, parseMediaCountBlockDTO } from "./blocks/mediaCountBlock";
import { TextBlock, TextBlockDTOSchema, parseTextBlockDTO } from "./blocks/textBlock";

export const compositionContentType = 'composition';

export type Composition = {
    contentType: typeof compositionContentType;
    id: string;
    title?: string;
    summary?: string;
    createdAt: Date;
    searchable?: boolean;
    machineIdentifier?: string;
    urlAlias?: string;
    keywords: string[];
    blocks: {
        headerBlock: Array<HeaderBlock>;
        featureBlock: Array<FeatureBlock>;
        carouselBlock: Array<CarouselBlock>;
        customComponentBlock: Array<CustomComponentBlock>;
        featuredTextBlock: Array<FeaturedTextBlock>;
        mediaBlock: Array<MediaBlock>;
        mediaCountBlock: Array<MediaCountBlock>;
        textBlock: Array<TextBlock>;
    }
}

export const CompositionDTOSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    summary: localized(z.string()).optional(),
    createdAt: DateAsStringSchema,
    searchable: z.boolean(),
    machineIdentifier: z.string().optional(),
    urlAlias: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    // TODO: Add primary iamge
    blocks: z.object({
        headerBlock: z.array(HeaderBlockDTOSchema).optional(),
        featureBlock: z.array(FeatureBlockDTOSchema).optional(),
        carouselBlock: z.array(CarouselBlockDTOSchema).optional(),
        customComponentBlock: z.array(CustomComponentBlockDTOSchema).optional(),
        featuredTextBlock: z.array(FeaturedTextBlockDTOSchema).optional(),
        mediaBlock: z.array(MediaBlockDTOSchema).optional(),
        mediaCountBlock: z.array(MediaCountBlockDTOSchema).optional(),
        textBlock: z.array(TextBlockDTOSchema).optional(),
    })
});

export function parseCompositionDTO(dto: z.infer<typeof CompositionDTOSchema>, language?: string): Composition {
    return {
        contentType: compositionContentType,
        id: dto.id,
        title: dto.title,
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary),
        createdAt: dto.createdAt,
        searchable: dto.searchable,
        machineIdentifier: dto.machineIdentifier,
        urlAlias: dto.urlAlias,
        keywords: dto.keywords ?? [],
        blocks: {
            headerBlock: dto.blocks.headerBlock?.map(b => parseHeaderBlockDTO(b, language)) ?? [],
            featureBlock: dto.blocks.featureBlock?.map(b => parseFeatureBlockDTO(b, language)) ?? [],
            carouselBlock: dto.blocks.carouselBlock?.map(b => parseCarouselBlockDTO(b, language)) ?? [],
            customComponentBlock: dto.blocks.customComponentBlock?.map(b => parseCustomComponentBlockDTO(b, language)) ?? [],
            featuredTextBlock: dto.blocks.featuredTextBlock?.map(b => parseFeaturedTextBlockDTO(b, language)) ?? [],
            mediaBlock: dto.blocks.mediaBlock?.map(b => parseMediaBlockDTO(b, language)) ?? [],
            mediaCountBlock: dto.blocks.mediaCountBlock?.map(b => parseMediaCountBlockDTO(b, language)) ?? [],
            textBlock: dto.blocks.textBlock?.map(b => parseTextBlockDTO(b, language)) ?? [],
        }
    }
}

export const compositionMapper: Mapper<Composition, typeof CompositionDTOSchema> = {
    contentType: compositionContentType,
    Schema: CompositionDTOSchema,
    map: parseCompositionDTO,
}