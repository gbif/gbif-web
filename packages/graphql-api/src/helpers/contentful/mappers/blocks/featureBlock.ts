import { z } from "zod";
import { localized } from "../_shared";
import { pickLanguage } from "../../languages";

export type FeatureBlock = {
    title?: string;
    body?: string;
    maxPerRow?: number;
    backgroundColour?: string;
    hideTitle?: boolean;
}

export const FeatureBlockDTOSchema = z.object({
    title: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    // TODO: Add optional features (This is currently a link to entries of type DataUse, Event, feature or news)
    maxPerRow: localized(z.number().int()).optional(),
    backgroundColour: localized(z.string()).optional(),
    hideTitle: localized(z.boolean()).optional(),
});

export function parseFeatureBlockDTO(dto: z.infer<typeof FeatureBlockDTOSchema>, language?: string): FeatureBlock {
    return {
        title: dto.title == null ? undefined : pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        maxPerRow: dto.maxPerRow == null ? undefined : pickLanguage(dto.maxPerRow, language),
        backgroundColour: dto.backgroundColour == null ? undefined : pickLanguage(dto.backgroundColour, language),
        hideTitle: dto.hideTitle == null ? undefined : pickLanguage(dto.hideTitle, language),
    }
}