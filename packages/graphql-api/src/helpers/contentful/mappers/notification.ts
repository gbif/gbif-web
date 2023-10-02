import { z } from "zod";
import { DateAsStringSchema } from "../utils";
import { pickLanguage } from "../languages";
import { Mapper, localized } from "./_shared";

export const notificationContentType = 'notification';

export type Notification = {
    contentType: typeof notificationContentType;
    id: string;
    title: string;
    summary?: string;
    body?: string;
    start: Date;
    end?: Date;
    url?: string;
    // TODO: Should probably be an enum
    notificationType: string;
    // TODO: Should probably be an enum
    severity: string;
}

export const NotificationDTOSchema = z.object({
    id: z.string(),
    title: localized(z.string()),
    summary: z.string(),
    body: localized(z.string()),
    start: DateAsStringSchema,
    end: DateAsStringSchema,
    url: z.string().optional(),
    notificationType: z.string(),
    severity: z.string(),
});

export function parseNotificationDTO(dto: z.infer<typeof NotificationDTOSchema>, language?: string): Notification {
    return {
        contentType: notificationContentType,
        id: dto.id,
        title: pickLanguage(dto.title, language),
        summary: dto.summary,
        body: dto.body == null ? undefined : pickLanguage(dto.body, language),
        start: dto.start,
        end: dto.end,
        url: dto.url,
        notificationType: dto.notificationType,
        severity: dto.severity,
    }
}

export const notificationMapper: Mapper<Notification, typeof NotificationDTOSchema> = {
    contentType: notificationContentType,
    Schema: NotificationDTOSchema,
    map: parseNotificationDTO,
}