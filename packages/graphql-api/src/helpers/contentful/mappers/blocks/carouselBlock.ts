import { z } from "zod";
import { localized } from "../_shared";
import { pickLanguage } from "../../languages";

export type CarouselBlock = {
    title?: string;
    body?: string;
    backgroundColour?: string;
}

export const CarouselBlockDTOSchema = z.object({
    title: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    // TODO: Add optional features (This is currently a link to entries of type mediaBlock or mediaCountBlock)
    backgroundColour: localized(z.string()).optional(),
});

export function parseCarouselBlockDTO(dto: z.infer<typeof CarouselBlockDTOSchema>, language?: string): CarouselBlock {
    return {
        title: dto.title == null ? undefined : pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        backgroundColour: dto.backgroundColour == null ? undefined : pickLanguage(dto.backgroundColour, language),
    }
}