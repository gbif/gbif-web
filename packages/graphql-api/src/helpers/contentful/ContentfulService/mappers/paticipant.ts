import { z } from "zod";
import { Participant } from "../../contentTypes/participant";
import { DataMapper, createContentfulMapper } from "./_shared";

export const contentfulParticipantMapper: DataMapper<Participant> = createContentfulMapper({
    contentType: 'Participant',
    fields: z.object({
        title: z.string(),
        country: z.object({
            sys: z.object({
                id: z.string()
            }),
        })
    }),
    map: dto => ({
        contentType: 'participant',
        id: dto.sys.id,
        title: dto.fields.title,
        country: dto.fields.country.sys.id
    })
})