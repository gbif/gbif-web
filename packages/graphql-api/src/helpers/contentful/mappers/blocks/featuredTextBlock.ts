import { z } from "zod";
import { localized } from "../_shared";
import { pickLanguage } from "../../languages";

export type FeaturedTextBlock = {
    title?: string;
    body?: string;
    backgroundColour?: string;
    hideTitle?: boolean;
    style?: string;
}

export const FeaturedTextBlockDTOSchema = z.object({
    title: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    // TODO: Add primary iamge
    backgroundColour: localized(z.string()).optional(),
    hideTitle: localized(z.boolean()).optional(),
    // I assume this field is localized because most of the fields from ElasticSearch are localized, but Contentful says it's not localized.
    // There are no examples of this field being used from our ElasticSearch data.
    style: localized(z.string()).optional(),
});

export function parseFeaturedTextBlockDTO(dto: z.infer<typeof FeaturedTextBlockDTOSchema>, language?: string): FeaturedTextBlock {
    return {
        title: dto.title == null ? undefined : pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        backgroundColour: dto.backgroundColour == null ? undefined : pickLanguage(dto.backgroundColour, language),
        hideTitle: dto.hideTitle == null ? undefined : pickLanguage(dto.hideTitle, language),
        style: dto.style == null ? undefined : pickLanguage(dto.style, language)
    }
}
