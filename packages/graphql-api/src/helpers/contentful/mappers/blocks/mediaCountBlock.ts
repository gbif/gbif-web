import { z } from "zod";
import { localized } from "../_shared";
import { pickLanguage } from "../../languages";

export type MediaCountBlock = {
    title: string;
    titleCountPart: string;
    subtitle?: string;
    body?: string;
    roundImage?: boolean;
    backgroundColour?: string;
    reverse?: boolean;
}

export const MediaCountBlockDTOSchema = z.object({
    title: localized(z.string()),
    titleCountPart: localized(z.string()),
    subtitle: localized(z.string()).optional(),
    body: localized(z.string()).optional(),
    // TODO: Add optional callToAction
    // TODO: Add optional primary iamge
    roundImage: localized(z.boolean()).optional(),
    backgroundColour: localized(z.string()).optional(),
    reverse: localized(z.boolean()).optional(),
});

export function parseMediaCountBlockDTO(dto: z.infer<typeof MediaCountBlockDTOSchema>, language?: string): MediaCountBlock {
    return {
        title: pickLanguage(dto.title, language),
        titleCountPart: pickLanguage(dto.titleCountPart, language),
        subtitle: dto.subtitle == null ? undefined : pickLanguage(dto.subtitle, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        roundImage: dto.roundImage == null ? undefined : pickLanguage(dto.roundImage, language),
        backgroundColour: dto.backgroundColour == null ? undefined : pickLanguage(dto.backgroundColour, language),
        reverse: dto.reverse == null ? undefined : pickLanguage(dto.reverse, language),
    }
}