import { z } from "zod";
import { localized } from "../_shared";
import { pickLanguage } from "../../languages";

export type HeaderBlock = {
    hideTitle?: boolean;
    title: string;
    type?: string;
    summary?: string;
}

export const HeaderBlockDTOSchema = z.object({
    // TODO: Add primary iamge
    hideTitle: localized(z.boolean()).optional(),
    title: localized(z.string()),
    type: localized(z.string()).optional(),
    summary: localized(z.string()).optional(),
});

export function parseHeaderBlockDTO(dto: z.infer<typeof HeaderBlockDTOSchema>, language?: string): HeaderBlock {
    return {
        hideTitle: dto.hideTitle == null ? undefined : pickLanguage(dto.hideTitle, language),
        title: pickLanguage(dto.title, language),
        type: dto.type == null ? undefined : pickLanguage(dto.type, language),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary, language)
    }
}