import resolver from './node.resolver';
import { NodeAPI, NodeDirectoryAPI } from './node.source';
import typeDef from './node.type';

export default {
  resolver,
  typeDef,
  dataSource: {
    nodeAPI: NodeAPI, // Every request should have its own instance, see https://github.com/apollographql/apollo-server/issues/1562
    nodeDirectoryAPI: NodeDirectoryAPI,
  },
};
