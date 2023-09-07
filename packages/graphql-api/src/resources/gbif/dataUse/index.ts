import typeDef from "./dataUse.type"
import resolver from "./dataUse.resolver"
import { ElasticSearchService } from "#/helpers/contentful/ElasticSearchService"
import { ContentfulService } from "#/helpers/contentful/ContentfulService"

export default {
    resolver,
    typeDef,
    dataSource: {
        elasticSearchService: ElasticSearchService,
        contentfulService: ContentfulService,
    },
}