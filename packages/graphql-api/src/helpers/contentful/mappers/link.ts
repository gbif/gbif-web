import { z } from "zod";
import { pickLanguage } from "../languages";
import { localized } from "./_shared";

export const linkContentType = 'link';

export type Link = {
    contentType: typeof linkContentType;
    label: string;
    url: string;
}

export const LinkDTOSchema = z.object({
    id: z.string(),
    label: localized(z.string()),
    url: localized(z.string()),
});

export function parseLinkDTO(dto: z.infer<typeof LinkDTOSchema>, language?: string): Link {
    return {
        contentType: linkContentType,
        label: pickLanguage(dto.label, language),
        url: pickLanguage(dto.url, language),
    }
}