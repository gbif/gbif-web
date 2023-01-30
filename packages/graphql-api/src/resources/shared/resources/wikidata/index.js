import wikidataAPI from './wikidata.source';
import resolver from './wikidata.resolver';
import typeDef from './wikidata.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    wikidataAPI,
  },
};
