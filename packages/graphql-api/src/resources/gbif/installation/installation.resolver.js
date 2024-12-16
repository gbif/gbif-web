import { getHtml } from '#/helpers/utils';
/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    installationSearch: (parent, args, { dataSources }) =>
      dataSources.installationAPI.searchInstallations({ query: args }),
    installation: (parent, { key }, { dataSources }) =>
      dataSources.installationAPI.getInstallationByKey({ key }),
  },
  Installation: {
    dataset: ({ key }, args, { dataSources }) => {
      return dataSources.installationAPI.getDatasets({ key, query: args });
    },
    organization: ({ organizationKey: key }, args, { dataSources }) => {
      // No need to throw an error, the user have no way of knowing if the key is present
      if (typeof key === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    homepage: ({ type, endpoints }) => {
      if (type === 'IPT_INSTALLATION') {
        var iptRssFeed = endpoints.find((x) => x.type === 'FEED');
        if (iptRssFeed) {
          var iptHomePage = iptRssFeed.url.replace(/rss\.do$/, '');
          return iptHomePage;
        }
      }
    },
    description: (src, _, { locale }) => getHtml(src.description, { locale }),
  },
};
