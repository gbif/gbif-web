import { GraphQLError } from "graphql";
import ContentfulNotificationAPI from "./notification.source";
import { Notification } from "./notification.type";

interface PartialContext {
    dataSources: {
        contentfulNotificationAPI: ContentfulNotificationAPI;
    }
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
    Query: {
        notification: async (_: unknown, args: { id: string }, context: PartialContext): Promise<Notification> => {
            const entry = await context.dataSources.contentfulNotificationAPI.getEntry(args.id);
            if (entry == null) throw new GraphQLError(`There is no news entry with an id of ${args.id}`);
            return entry;
        }
    },
    Notification: {
        title: src => src.title,
        summary: src => src.summary,
        body: src => src.body,
        start: src => src.start.toISOString(),
        end: src => src.end.toISOString(),
        url: src => src.url,
        notificationType: src => src.notificationType,
        severity: src => src.severity,
    } as Record<string, (src: Notification) => unknown>
}

