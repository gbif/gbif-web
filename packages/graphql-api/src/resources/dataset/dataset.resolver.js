/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    datasetSearch: (parent, args, { dataSources }) =>
      dataSources.datasetAPI.searchDatasets({ query: args }),
    dataset: (parent, { key }, { dataSources }) =>
      dataSources.datasetAPI.getDatasetByKey({ key })
  },
  Dataset: {
    installation: ({ installationKey: key }, args, { dataSources }) =>
      dataSources.installationAPI.getInstallationByKey({ key }),
    duplicateOfDataset: ({ duplicateOfDatasetKey: key }, args, { dataSources }) => {
      // no need to throw an error, the user have no way of knowing if the key is present
      if (typeof key === 'undefined') return null;
      return dataSources.datasetAPI.getDatasetByKey({ key });
    },
    hostingOrganization: ({ hostingOrganizationKey: key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    publishingOrganization: ({ publishingOrganizationKey: key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    parentDataset: ({ parentDatasetKey: key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.datasetAPI.getDatasetByKey({ key });
    },
    constituents: ({ key }, args, { dataSources }) => {
      return dataSources.datasetAPI.getConstituents({ key, query: args });
    },
    networks: ({ key }, args, { dataSources }) => {
      return dataSources.datasetAPI.getNetworks({ key });
    },
  }
};
