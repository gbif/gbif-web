import typeDef from "./dataUse.type"
import resolver from "./dataUse.resolver"
import { ElasticSearchService } from "#/helpers/contentful/ContentfulSearchService"
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService"

export default {
    resolver,
    typeDef,
    dataSource: {
        elasticSearchService: ElasticSearchService,
        contentfulDetailService: ContentfulDetailService
    },
}