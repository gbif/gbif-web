import { z } from "zod";
import { Notification } from "../../contentTypes/notification";
import { DataMapper, DateAsStringSchema, createContentfulMapper } from "./_shared";

export const contentfulNotificationMapper: DataMapper<Notification> = createContentfulMapper({
    contentType: 'notification',
    fields: z.object({
        title: z.string(),
        summary: z.string().optional(),
        body: z.string().optional(),
        start: DateAsStringSchema,
        end: DateAsStringSchema,
        url: z.string().optional(),
        notificationType: z.string(),
        severity: z.string()
    }),
    map: dto => ({
        contentType: 'notification',
        id: dto.sys.id,
        title: dto.fields.title,
        summary: dto.fields.summary,
        body: dto.fields.body,
        start: dto.fields.start,
        end: dto.fields.end,
        url: dto.fields.url,
        notificationType: dto.fields.notificationType,
        severity: dto.fields.severity
    })
})