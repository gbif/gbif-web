import { z } from "zod";
import { Mapper, localized } from "./_shared";
import { DateAsStringSchema } from "../utils";
import { pickLanguage } from "../languages";

export const helpContentType = 'help';

export type Help = {
    contentType: typeof helpContentType;
    id: string;
    title: string;
    body: string;
    identifier: string;
    searchable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const HelpDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    body: localized(z.string()),
    identifier: z.string(),
    searchable: z.boolean(),
    createdAt: DateAsStringSchema,
    updatedAt: DateAsStringSchema,
});

export function parseHelpDTO(dto: z.infer<typeof HelpDTOSchema>, language?: string): Help {
    return {
        contentType: helpContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        body: pickLanguage(dto.body, language),
        identifier: dto.identifier,
        searchable: dto.searchable,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    }
}

export const helpMapper: Mapper<Help, typeof HelpDTOSchema> = {
    contentType: helpContentType,
    Schema: HelpDTOSchema,
    map: parseHelpDTO,
}