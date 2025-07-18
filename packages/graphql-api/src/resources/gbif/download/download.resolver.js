import { getGbifMachineDescription } from '#/helpers/generateSql';
import { highlight } from 'sql-highlight';

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
    userDownloads: (
      parent,
      { username, limit = 10, offset = 0 },
      { dataSources },
      info,
    ) => {
      info.cacheControl.setCacheHint({
        maxAge: 0,
        scope: 'PRIVATE',
      });
      return dataSources.downloadAPI.getUsersDownloads({
        username,
        query: { limit, offset },
      });
    },
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
    gbifMachineDescription: ({ sql, machineDescription }) => {
      try {
        const gbifMachineDescription = getGbifMachineDescription(
          machineDescription,
          sql,
        );
        return gbifMachineDescription;
      } catch (err) {
        return null;
      }
    },
    sqlFormatted: ({ sql }) => {
      try {
        const highlighted = highlight(sql, {
          html: true,
        });
        return highlighted;
      } catch (err) {
        return sql;
      }
    },
  },
};
