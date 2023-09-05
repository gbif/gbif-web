import typeDef from "./dataUse.type"
import resolver from "./dataUse.resolver"
import ContentfulDataUseAPI from "./dataUse.source"

export default {
    resolver,
    typeDef,
    dataSource: {
        contentfulDataUseAPI: ContentfulDataUseAPI,
    },
}