import { elasticSearchDataUseMapper } from "./dataUse";
import { elasticSearchEventMapper } from "./event";
import { elasticSearchNewsMapper } from "./news";
import { elasticSearchNotificationMapper } from "./notification";

export const elasticSearchMappers = [
    elasticSearchDataUseMapper,
    elasticSearchEventMapper,
    elasticSearchNewsMapper,
    elasticSearchNotificationMapper,
] as const;

export type ElasticSearchMapperResult = ReturnType<typeof elasticSearchMappers[number]['parse']>;