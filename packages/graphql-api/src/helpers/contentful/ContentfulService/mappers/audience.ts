import { z } from "zod";
import { DataMapper, createContentfulMapper } from "./_shared";
import { toConstCase } from "../../utils";
import { Audience } from "../../contentTypes/audience";

export const contentfulAudienceMapper: DataMapper<Audience> = createContentfulMapper({
    contentType: 'Audience',
    fields: z.object({
        term: z.string(),
    }),
    map: dto => ({
        contentType: 'audience',
        term: toConstCase(dto.fields.term),
    })
});