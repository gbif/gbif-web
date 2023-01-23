import taxonAPI from './taxon.source';
import resolver from './taxon.resolver';
import typeDef from './taxon.type';

export default { resolver, typeDef, dataSource: { taxonAPI } };
