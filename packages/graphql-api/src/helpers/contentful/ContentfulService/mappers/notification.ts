import { z } from "zod";
import { Notification } from "../../entities/notification";
import { DateAsStringSchema } from "./_shared";

export const ContentfulNotificationDTOSchema = z.object({
    sys: z.object({
        id: z.string(),
        contentType: z.object({
            sys: z.object({
                id: z.literal('notification')
            })
        })
    }),
    fields: z.object({
        title: z.string(),
        summary: z.string().optional(),
        body: z.string().optional(),
        start: DateAsStringSchema,
        end: DateAsStringSchema,
        url: z.string().optional(),
        notificationType: z.string(),
        severity: z.string()
    })
});

export function parseContentfulNotificationDTO(notificationDTO: z.infer<typeof ContentfulNotificationDTOSchema>): Notification {
    return {
        contentType: 'notification',
        id: notificationDTO.sys.id,
        title: notificationDTO.fields.title,
        summary: notificationDTO.fields.summary,
        body: notificationDTO.fields.body,
        start: notificationDTO.fields.start,
        end: notificationDTO.fields.end,
        url: notificationDTO.fields.url,
        notificationType: notificationDTO.fields.notificationType,
        severity: notificationDTO.fields.severity
    };
}