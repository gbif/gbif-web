import typeDef from "./dataUse.type"
import resolver from "./dataUse.resolver"
import { ContentfulSearchService } from "#/helpers/contentful/ContentfulSearchService"
import { ContentfulDetailService } from "#/helpers/contentful/ContentfulDetailService"

export default {
    resolver,
    typeDef,
    dataSource: {
        contentfulSearchService: ContentfulSearchService,
        contentfulDetailService: ContentfulDetailService
    },
}