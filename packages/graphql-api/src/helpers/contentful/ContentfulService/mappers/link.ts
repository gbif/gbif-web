import { z } from "zod";
import { DataMapper, createContentfulMapper } from "./_shared";
import { Link } from "../../contentTypes/link";

export const contentfulLinkMapper: DataMapper<Link> = createContentfulMapper({
    contentType: 'Link',
    fields: z.object({
        label: z.string(),
        url: z.string(),
    }),
    map: dto => ({
        contentType: 'link',
        label: dto.fields.label,
        url: dto.fields.url,
    })
});