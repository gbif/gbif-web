import resolver from './event.resolver'
import typeDef from './event.type'
import ContentfulEventAPI from './event.source'

export default {    
    resolver,
    typeDef,
    dataSource: {
        contentfulEventAPI: ContentfulEventAPI,
    }
}