import { contentfulAudienceMapper } from "./audience";
import { contentfulDataUseMapper } from "./dataUse";
import { contentfulEventMapper } from "./event";
import { contentfulAssetMapper } from "./image";
import { contentfulLinkMapper } from "./link";
import { contentfulNewsMapper } from "./news";
import { contentfulNotificationMapper } from "./notification";
import { contentfulParticipantMapper } from "./paticipant";
import { contentfulPurposeMapper } from "./purpose";
import { contentfulTopicMapper } from "./topic";

export const contentfulMappers = [
    contentfulDataUseMapper,
    contentfulEventMapper,
    contentfulNewsMapper,
    contentfulNotificationMapper,
    contentfulAssetMapper,
    contentfulLinkMapper,
    contentfulParticipantMapper,
    contentfulTopicMapper,
    contentfulPurposeMapper,
    contentfulAudienceMapper,
] as const;

export type ContentfulMapperResult = ReturnType<typeof contentfulMappers[number]['parse']>;