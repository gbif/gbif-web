import { z } from "zod";
import { pickLanguage } from "../languages";

export const localized = <T extends z.ZodType>(schema: T)=> z.record(z.string(), schema);

export const CoordinatesSchema = z.object({
    lat: z.number(),
    lon: z.number(),
})

export const PartnerSchema = z.object({
    id: z.string(),
    country: z.string().optional(),
    title: localized(z.string()),
})

export function parseElasticSearchPartnerDTO(partnerDto: z.infer<typeof PartnerSchema>, language?: string) {
    return {
        id: partnerDto.id,
        country: partnerDto.country,
        title: pickLanguage(partnerDto.title, language),
    }
}

export type Mapper<T, TSchema extends z.AnyZodObject> = {
    contentType: string;
    Schema: TSchema
    map: (dto: z.infer<TSchema> , language?: string) => T;
}