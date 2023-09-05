import ContentfulNotificationAPI from "./notification.source";
import resolver from "./notification.resolver";
import typeDef from "./notification.type";

export default {
    resolver,
    typeDef,
    dataSource: {
        contentfulNotificationAPI: ContentfulNotificationAPI,
    }
};