import { excerpt } from '#/helpers/utils';
import { getThumborUrl } from '../resource/misc/misc.resolver';
/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    organizationSearch: (parent, query, { dataSources }) =>
      dataSources.organizationAPI.searchOrganizations({ query }),
    organization: (parent, { key }, { dataSources }) =>
      dataSources.organizationAPI.getOrganizationByKey({ key }),
  },
  Organization: {
    hostedDataset: ({ key }, args, { dataSources }) => {
      return dataSources.organizationAPI.getHostedDatasets({
        key,
        query: args,
      });
    },
    publishedDataset: ({ key }, args, { dataSources }) => {
      return dataSources.organizationAPI.getPublishedDatasets({
        key,
        query: args,
      });
    },
    installation: ({ key }, args, { dataSources }) => {
      return dataSources.organizationAPI.getInstallations({ key, query: args });
    },
    endorsingNode: ({ endorsingNodeKey: key }, args, { dataSources }) => {
      // No need to throw an error, the user have no way of knowing if the key is present
      if (typeof key === 'undefined') return null;
      return dataSources.nodeAPI.getNodeByKey({ key });
    },
    excerpt: src => excerpt({ body: src.description }),
    thumborLogoUrl: ({ logoUrl: url }, { fitIn, width = '', height = '' }) => getThumborUrl({url, fitIn, width, height}),
  },
};
