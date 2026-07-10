import { NotFoundError } from '@/helpers/GraphQL404Error';
import { excerpt, isValidDoi } from '@/helpers/utils';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    userDerivedDatasets: (
      parent,
      { username, limit = 10, offset = 0 },
      { dataSources },
      info,
    ) => {
      info.cacheControl.setCacheHint({
        maxAge: 0,
        scope: 'PRIVATE',
      });
      return dataSources.derivedDatasetAPI.getUsersDerivedDataset({
        username,
        query: { limit, offset },
      });
    },
    derivedDataset: (parent, { key }, { dataSources }, info) => {
      if (!isValidDoi(key)) {
        throw new NotFoundError();
      }
      return dataSources.derivedDatasetAPI.getDerivedDataset({ key });
    },
  },
  DerivedDataset: {
    excerpt: (src) => excerpt({ body: src.description }),
    contributingDatasets: (
      parent,
      { limit = 10, offset = 0 },
      { dataSources },
    ) => {
      return dataSources.derivedDatasetAPI.getContributingDatasetsByDerivedDatasetKey(
        {
          key: parent.doi,
          query: { limit, offset },
        },
      );
    },
  },
};
