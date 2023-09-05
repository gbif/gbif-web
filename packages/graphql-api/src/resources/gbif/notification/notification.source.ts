import { BaseContentfulAPI } from "#/helpers/contentful/BaseContentfulAPI";
import { DateAsStringSchema } from "#/helpers/contentful/validation";
import { z } from "zod";
import { Notification } from "./notification.type";
import { GraphQLError } from "graphql";

const NotificationSchema = z.object({
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

class ContentfulNotificationAPI extends BaseContentfulAPI<Notification> {
    protected readonly parseResponseToType = (response: unknown): Notification => {
        const result = NotificationSchema.safeParse(response);

        if (!result.success) {
            console.error(result.error);
            throw new GraphQLError(`Contentful parsing error: ${result.error.name}`);
        }

        const notification: Notification = {
            title: result.data.fields.title,
            summary: result.data.fields.summary,
            body: result.data.fields.body,
            start: result.data.fields.start,
            end: result.data.fields.end,
            url: result.data.fields.url,
            notificationType: result.data.fields.notificationType,
            severity: result.data.fields.severity
        };

        return notification;
    }
}

export default ContentfulNotificationAPI;