import { z } from "zod";
import { Topic } from "../../contentTypes/topic";
import { DataMapper, createContentfulMapper } from "./_shared";
import { toConstCase } from "../../utils";

export const contentfulTopicMapper: DataMapper<Topic> = createContentfulMapper({
    contentType: 'Topic',
    fields: z.object({
        term: z.string(),
    }),
    map: dto => ({
        contentType: 'topic',
        term: toConstCase(dto.fields.term),
    })
});