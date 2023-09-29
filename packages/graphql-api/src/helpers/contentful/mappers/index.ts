import { elasticSearchDataUseMapper } from "./dataUse";
import { elasticSearchEventMapper } from "./event";
import { elasticSearchCompositionMapper } from "./composition";
import { elasticSearchNewsMapper } from "./news";
import { elasticSearchNotificationMapper } from "./notification";
import { elasticSearchProjectMapper } from "./project";
import { elasticSearchHelpMapper } from "./help";

export const elasticSearchMappers = [
    elasticSearchDataUseMapper,
    elasticSearchEventMapper,
    elasticSearchNewsMapper,
    elasticSearchNotificationMapper,
    elasticSearchProjectMapper,
    elasticSearchCompositionMapper,
    elasticSearchHelpMapper,
] as const;

export type ElasticSearchMapperResult = ReturnType<typeof elasticSearchMappers[number]['parse']>;