import { contentfulDataUseMapper } from "./dataUse";
import { contentfulEventMapper } from "./event";
import { contentfulNewsMapper } from "./news";
import { contentfulNotificationMapper } from "./notification";

export const contentfulMappers = [
    contentfulDataUseMapper,
    contentfulEventMapper,
    contentfulNewsMapper,
    contentfulNotificationMapper,
] as const;

export type ContentfulMapperResult = ReturnType<typeof contentfulMappers[number]['parse']>;