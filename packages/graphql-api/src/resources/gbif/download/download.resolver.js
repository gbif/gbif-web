import { verifyJson } from '#/helpers/utils';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    datasetDownloads: (parent, args, { dataSources }) =>
      dataSources.downloadAPI.datasetDownloads({ query: args }),
    datasetsByDownload: (
      parent,
      { key, limit = 10, offset = 0 },
      { dataSources },
    ) =>
      dataSources.downloadAPI.getContributingDatasetsByDownloadKey({
        key,
        query: { limit, offset },
      }),
    download: (parent, { key }, { dataSources }) =>
      dataSources.downloadAPI.getDownloadByKey({ key }),
  },
  DownloadRequest: {
    gbifMachineDescription: ({ machineDescription }) => {
      try {
        // check if the machineDescription is an object, if not return null
        if (typeof machineDescription !== 'object') return null;
        // check if the machineDescription is signed by us
        const { signature, parameters } = machineDescription;
        if (!signature || !parameters) return null;
        // sign the parameters and compare
        const signedByUs = verifyJson(parameters, signature);
        if (signedByUs) {
          // return the machineDescription except signature
          const { signature: _, ...rest } = machineDescription;
          return rest;
        }
        return null;
      } catch (err) {
        return null;
      }
    },
    predicate: () => {
      return {
        type: 'and',
        predicates: [
          {
            type: 'not',
            predicate: {
              type: 'in',
              key: 'RECORDED_BY',
              values: ['erik vikkelso rasmussen (4500era)'],
            },
          },
          {
            type: 'not',
            predicate: {
              type: 'in',
              key: 'COLLECTION_KEY',
              values: ['b2190553-4505-4fdd-8fff-065c8ca26f72'],
            },
          },
          {
            type: 'not',
            predicate: {
              type: 'in',
              key: 'DWCA_EXTENSION',
              values: [
                'http://purl.org/germplasm/germplasmTerm#GermplasmAccession',
              ],
            },
          },
          {
            type: 'not',
            predicate: {
              type: 'in',
              key: 'ISSUE',
              values: ['GEODETIC_DATUM_ASSUMED_WGS84', 'COORDINATE_ROUNDED'],
            },
          },
        ],
      };
    },
  },
};
