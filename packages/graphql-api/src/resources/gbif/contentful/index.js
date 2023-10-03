import { ContentfulAPI, ContentfulSearchAPI } from './contentful.source';
import typeDef from './contentful.type';

export default {
    typeDef,
    dataSource: {
        contentfulAPI: ContentfulAPI,
        contentfulSearchAPI: ContentfulSearchAPI,
    }
}