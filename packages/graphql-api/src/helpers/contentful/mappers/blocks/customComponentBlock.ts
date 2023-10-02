import { z } from "zod";
import { localized } from "../_shared";
import { pickLanguage } from "../../languages";

export type CustomComponentBlock = {
    title?: string;
    backgroundColour?: string;
    settings: {
        tableStyle: string;
        programmeId: string;
    };
    componentType: string;
    width?: string;
};

export const CustomComponentBlockDTOSchema = z.object({
    title: localized(z.string()).optional(),
    backgroundColour: localized(z.string()).optional(),
    settings: localized(z.object({
        tableStyle: z.string(),
        programmeId: z.string(),
    })),
    componentType: localized(z.string()),
    width: localized(z.string()).optional(),
});

export function parseCustomComponentBlockDTO(dto: z.infer<typeof CustomComponentBlockDTOSchema>, language?: string): CustomComponentBlock {
    return {
        title: dto.title == null ? undefined : pickLanguage(dto.title, language),
        backgroundColour: dto.backgroundColour == null ? undefined : pickLanguage(dto.backgroundColour, language),
        settings: {
            tableStyle: dto.settings.tableStyle,
            programmeId: dto.settings.programmeId,
        },
        componentType: pickLanguage(dto.componentType, language),
        width: dto.width == null ? undefined : pickLanguage(dto.width, language),
    }
}