import { z } from "zod";

export type EntryReference = {
    id: string;
}

export const EntryReferenceDTOSchema = z.object({
    sys: z.object({
        type: z.literal('Link'),
        linkType: z.literal('Entry'),
        id: z.string(),
    })
})

export function parseEntryReferenceDTO(dto: z.infer<typeof EntryReferenceDTOSchema>): EntryReference {
    return {
        id: dto.sys.id,
    }
}