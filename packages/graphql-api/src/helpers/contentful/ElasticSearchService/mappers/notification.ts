import { z } from "zod";
import { DateAsStringSchema, pickLanguage } from "../../utils";
import { Notification } from "../../entities/notification";

export const ElasticSearchNotificationDTOSchema = z.object({
    contentType: z.literal('notification'),
    id: z.string(),
    title: z.record(z.string(), z.string()),
    summary: z.string().optional(),
    body: z.record(z.string(), z.string()).optional(),
    start: DateAsStringSchema,
    end: DateAsStringSchema,
    url: z.string().optional(),
    notificationType: z.string(),
    severity: z.string(),
});

export function parseElasticSearchNotificationDTO(notificationDTO: z.infer<typeof ElasticSearchNotificationDTOSchema>): Notification {
    return {
        contentType: 'notification',
        id: notificationDTO.id,
        title: pickLanguage(notificationDTO.title),
        summary: notificationDTO.summary,
        body: notificationDTO.body == null ? undefined : pickLanguage(notificationDTO.body),
        start: notificationDTO.start,
        end: notificationDTO.end,
        url: notificationDTO.url,
        notificationType: notificationDTO.notificationType,
        severity: notificationDTO.severity,
    };
}