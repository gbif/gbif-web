import { z } from "zod";
import { DataMapper, createElasticSearchMapper, localized } from "./_shared";
import { pickLanguage } from "../languages";

type Call = {
    contentType: 'call';
    id: string;
    title: string;
    body?: string;
    acronym?: string;
}

export const elasticSearchCallMapper: DataMapper<Call> = createElasticSearchMapper({
    contentType: 'call',
    fields: z.object({
        id: z.string(),
        title: localized(z.string()),
        body: localized(z.string()).optional(),
        acronym: z.string().optional(),
    }),
    map: (dto, language) => ({
        contentType: 'call',
        id: dto.id,
        title: pickLanguage(dto.title, language),
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        acronym: dto.acronym,
    }),
});