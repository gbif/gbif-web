import { z } from "zod";
import { DataMapper, createElasticSearchMapper, localized } from "./_shared";
import { DateAsStringSchema } from "../utils";
import { pickLanguage } from "../languages";
import { Help } from "../contentTypes/help";

export const elasticSearchHelpMapper: DataMapper<Help> = createElasticSearchMapper({
    contentType: 'help',
    fields: z.object({
        id: z.string(),
        title: localized(z.string()),
        body: localized(z.string()),
        identifier: z.string(),
        searchable: z.boolean(),
        createdAt: DateAsStringSchema,
        updatedAt: DateAsStringSchema,
    }),
    map: (dto, language) => ({
        contentType: 'help',
        id: dto.id,
        title: pickLanguage(dto.title, language),
        body: pickLanguage(dto.body, language),
        identifier: dto.identifier,
        searchable: dto.searchable,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    }),
});