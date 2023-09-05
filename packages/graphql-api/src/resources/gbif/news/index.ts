import typeDef from './news.type';
import resolver from './news.resolver'
import ContentfulNewsAPI from './news.source';

export default {
    resolver,
    typeDef,
    dataSource: {
        contentfulNewsAPI: ContentfulNewsAPI,
    },
}