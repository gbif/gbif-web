import { z } from "zod";
import { localized } from "../_shared";
import { pickLanguage } from "../../languages";

export type TextBlock = {
    title?: string;
    body?: string;
    hideTitle?: boolean;
    backgroundColour?: string,
}

export const TextBlockDTOSchema = z.object({
    title: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    hideTitle: localized(z.boolean()).optional(),
    backgroundColour: localized(z.string()).optional(),
});

export function parseTextBlockDTO(dto: z.infer<typeof TextBlockDTOSchema>, language?: string): TextBlock {
    return {
        title: dto.title == null ? undefined : pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        hideTitle: dto.hideTitle == null ? undefined : pickLanguage(dto.hideTitle, language),
        backgroundColour: dto.backgroundColour == null ? undefined : pickLanguage(dto.backgroundColour, language),
    }
}