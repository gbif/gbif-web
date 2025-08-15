import { excerpt, getHtml } from '#/helpers/utils';
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
    machineTags: ({ machineTags }, { namespace, name, value }) => {
      // allow filtering of machine tags
      if (namespace || name || value) {
        return machineTags.filter(
          (mt) =>
            (!namespace || mt.namespace === namespace) &&
            (!name || mt.name === name) &&
            (!value || mt.value === value),
        );
      }
      return machineTags;
    },
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
    excerpt: (src) => excerpt({ body: src.description }),
    description: (src, _, { locale }) =>
      getHtml(src.description, {
        trustLevel: 'untrusted',
        wrapTables: true,
        locale,
      }),
    thumborLogoUrl: ({ logoUrl: url }, { fitIn, width = '', height = '' }) =>
      getThumborUrl({ url, fitIn, width, height }),
    occurrenceCount: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;

      return dataSources.occurrenceAPI
        .searchOccurrenceDocuments({
          query: {
            size: 0,
            predicate: { type: 'equals', key: 'publishingOrg', value: key },
          },
        })
        .then((documents) => documents.total);
    },
    literatureCount: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.literatureAPI
        .searchLiterature({
          query: { publishingOrganizationKey: key, size: 0 },
        })
        .then((response) => response.documents.total);
    },
  },
};
