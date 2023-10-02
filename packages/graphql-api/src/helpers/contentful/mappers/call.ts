import { z } from "zod";
import { Mapper, localized } from "./_shared";
import { pickLanguage } from "../languages";

export const callContentType = 'call';

export type Call = {
    contentType: typeof callContentType;
    id: string;
    title: string;
    body?: string;
    acronym?: string;
}

export const CallDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    body: localized(z.string()).optional(),
    acronym: z.string().optional(),
});

export function parseCallDTO(dto: z.infer<typeof CallDTOSchema>, language?: string): Call {
    return {
        contentType: callContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        acronym: dto.acronym,
    }
}

export const callMapper: Mapper<Call, typeof CallDTOSchema> = {
    contentType: callContentType,
    Schema: CallDTOSchema,
    map: parseCallDTO,
}