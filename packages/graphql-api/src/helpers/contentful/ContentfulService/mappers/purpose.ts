import { z } from "zod";
import { DataMapper, createContentfulMapper } from "./_shared";
import { toConstCase } from "../../utils";
import { Purpose } from "../../contentTypes/purpose";

export const contentfulPurposeMapper: DataMapper<Purpose> = createContentfulMapper({
    contentType: 'Purpose',
    fields: z.object({
        term: z.string(),
    }),
    map: dto => ({
        contentType: 'purpose',
        term: toConstCase(dto.fields.term),
    })
});