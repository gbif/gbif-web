import { z } from "zod";
import { DateAsStringSchema } from "../utils";
import { pickLanguage } from "../languages";
import { Notification } from "../contentTypes/notification";
import { DataMapper, createElasticSearchMapper } from "./_shared";

export const elasticSearchNotificationMapper: DataMapper<Notification> = createElasticSearchMapper({
    contentType: 'notification',
    fields: z.object({
        id: z.string(),
        title: z.record(z.string(), z.string()),
        summary: z.string().optional(),
        body: z.record(z.string(), z.string()).optional(),
        start: DateAsStringSchema,
        end: DateAsStringSchema,
        url: z.string().optional(),
        notificationType: z.string(),
        severity: z.string(),
    }),
    map: (dto, language) => ({
        contentType: 'notification',
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary,
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        start: dto.start,
        end: dto.end,
        url: dto.url,
        notificationType: dto.notificationType,
        severity: dto.severity,
    })
})