import { articleMapper } from "./article";
import { callMapper } from "./call";
import { compositionMapper } from "./composition";
import { datauseMapper } from "./dataUse";
import { documentMapper } from "./document";
import { eventMapper } from "./event";
import { helpMapper } from "./help";
import { newsMapper } from "./news";
import { notificationMapper } from "./notification";
import { projectMapper } from "./project";
import { toolMapper } from "./tool";

export const mappers= [
    articleMapper,
    callMapper,
    compositionMapper,
    datauseMapper,
    documentMapper,
    eventMapper,
    helpMapper,
    newsMapper,
    notificationMapper,
    projectMapper,
    toolMapper,
] as const;

export type MapperResult = ReturnType<typeof mappers[number]['map']>;